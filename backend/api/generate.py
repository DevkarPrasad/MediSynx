from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import pandas as pd
from tempfile import NamedTemporaryFile
import os
import logging
from synthcity.plugins import Plugins

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/generate/")
async def generate(file: UploadFile = File(...), model_name: str = Form(...)):
    temp_file = None
    try:
        # Validate file
        if not file.filename or not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        logger.info(f"Processing file: {file.filename}, model: {model_name}")
        
        # Save uploaded file to temp
        temp_file = NamedTemporaryFile(delete=False, suffix='.csv')
        contents = await file.read()
        temp_file.write(contents)
        temp_file.close()

        df = pd.read_csv(temp_file.name)
        logger.info(f"Loaded CSV with shape: {df.shape}")
        
        # Warn if non-numeric columns are present
        non_numeric_cols = [col for col in df.columns if not pd.api.types.is_numeric_dtype(df[col])]
        if non_numeric_cols:
            logger.warning(f"Non-numeric columns detected: {non_numeric_cols}. Ensure your model supports categorical data.")
        
        # Validate model
        available_models = Plugins().list()
        if model_name not in available_models:
            raise HTTPException(
                status_code=400, 
                detail=f"Model '{model_name}' not available. Available models: {available_models}"
            )
        
        # Use Plugins API to get the plugin class
        logger.info(f"Loading plugin: {model_name}")
        syn_model = Plugins().get(name=model_name)
        
        logger.info("Fitting model to data...")
        try:
            syn_model.fit(df)
        except Exception as fit_exc:
            # Try to catch n_splits error and provide a user-friendly message
            if "n_splits" in str(fit_exc):
                # Try to auto-detect a target column (if any categorical col with few unique values)
                target_col = None
                for col in df.columns:
                    if df[col].dtype == 'object' or pd.api.types.is_categorical_dtype(df[col]):
                        if df[col].nunique() < len(df) // 2:
                            target_col = col
                            break
                if target_col:
                    min_class_count = df[target_col].value_counts().min()
                    if min_class_count < 2:
                        raise HTTPException(status_code=400, detail=f"Not enough samples per class in '{target_col}' for cross-validation. Please upload more data.")
                    raise HTTPException(status_code=400, detail=f"Your data is too small for this model (min samples per class: {min_class_count}). Please upload more data.")
                else:
                    raise HTTPException(status_code=400, detail="n_splits error: Could not auto-detect a suitable target column. Please upload more data or check your CSV.")
            else:
                logger.error(f"Error in fit: {fit_exc}")
                raise HTTPException(status_code=500, detail=f"Generation failed: {fit_exc}")
        
        logger.info("Generating synthetic data...")
        synthetic_data = syn_model.generate(count=len(df))
        synthetic_data_df = synthetic_data.dataframe()

        # Save synthetic data
        output_path = temp_file.name.replace(".csv", "_synthetic.csv")
        synthetic_data_df.to_csv(output_path, index=False)
        
        logger.info(f"Synthetic data saved to: {output_path}")

        return {"message": "Generated!", "path": output_path}
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error in generate: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
    finally:
        # Clean up input temp file
        if temp_file and os.path.exists(temp_file.name):
            try:
                os.unlink(temp_file.name)
                logger.info("Cleaned up input temp file")
            except Exception as e:
                logger.warning(f"Failed to clean up temp file: {e}") 