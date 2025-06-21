from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import pandas as pd
from tempfile import NamedTemporaryFile
import os
import logging
from synthcity.plugins import Plugins
import time
import uuid

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
        logger.info(f"DataFrame dtypes: {df.dtypes.to_dict()}")
        
        # --- Preprocessing for real-world CSVs ---
        # 1. Drop columns like Patient_ID
        id_cols = [col for col in df.columns if 'id' in col.lower() or col.lower() in ['patient_id', 'record_id']]
        if id_cols:
            logger.warning(f"Dropping ID columns: {id_cols}")
            df = df.drop(columns=id_cols)

        # 2. Encode categoricals
        cat_cols = [col for col in df.columns if df[col].dtype == 'object' or pd.api.types.is_categorical_dtype(df[col])]
        if cat_cols:
            logger.warning(f"Encoding categorical columns: {cat_cols}")
            try:
                df = pd.get_dummies(df, columns=cat_cols, drop_first=True)
            except Exception as e:
                logger.warning(f"pd.get_dummies failed, trying LabelEncoder: {e}")
                from sklearn.preprocessing import LabelEncoder
                for col in cat_cols:
                    le = LabelEncoder()
                    try:
                        df[col] = le.fit_transform(df[col].astype(str))
                    except Exception as le_e:
                        logger.warning(f"LabelEncoder failed for {col}: {le_e}. Dropping column.")
                        df = df.drop(columns=[col])

        # 3. Fill NaNs
        if df.isnull().any().any():
            logger.warning("Filling NaN values using forward/backward fill.")
            df = df.fillna(method="ffill").fillna(method="bfill")
        # --- End preprocessing ---
        
        logger.info(f"Preprocessed DataFrame shape: {df.shape}")
        logger.info(f"Preprocessed DataFrame dtypes: {df.dtypes.to_dict()}")

        # Suggest model-specific optimizations
        if model_name.lower() in ["dpgan", "ctgan", "tvae", "vae"]:
            logger.info(f"Model '{model_name}' is a deep learning model and may be slow. For faster results, try 'privbayes' or a Bayesian model.")
        elif model_name.lower() == "privbayes":
            logger.info("'privbayes' is generally fast and suitable for most tabular data.")

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
        
        # Log timing for model loading
        t0 = time.time()
        logger.info(f"Loading plugin: {model_name}")
        syn_model = Plugins().get(name=model_name)
        t1 = time.time()
        logger.info(f"Model loading took {t1 - t0:.2f} seconds.")
        
        # Log timing for model fitting
        logger.info("Fitting model to data...")
        t2 = time.time()
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
        t3 = time.time()
        fit_time = t3 - t2
        logger.info(f"Model fitting took {fit_time:.2f} seconds.")
        if fit_time > 5.0:
            logger.warning(f"Model fitting is slow (>5s). Consider downsampling your data, reducing the number of features, or using a simpler model like 'privbayes'.")
        if df.shape[0] > 10000 or df.shape[1] > 50:
            logger.info(f"Large data detected (rows: {df.shape[0]}, cols: {df.shape[1]}). This can slow down training, especially for deep models.")
        if len([col for col in df.columns if '_' in col]) > 20:
            logger.info("Many one-hot encoded columns detected. Categorical explosion can slow down training. Consider reducing the number of categories.")
        
        # Log timing for synthetic data generation
        logger.info("Generating synthetic data...")
        t4 = time.time()
        synthetic_data = syn_model.generate(count=len(df))
        synthetic_data_df = synthetic_data.dataframe()
        t5 = time.time()
        logger.info(f"Synthetic data generation took {t5 - t4:.2f} seconds.")

        # Save synthetic data to a dedicated outputs folder
        output_dir = "backend/outputs"
        os.makedirs(output_dir, exist_ok=True)
        
        filename = f"{uuid.uuid4()}_{model_name}_synthetic.csv"
        output_path = os.path.join(output_dir, filename)
        synthetic_data_df.to_csv(output_path, index=False)
        
        logger.info(f"Synthetic data saved to: {output_path}")

        return {"message": "Generated!", "path": filename}
        
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