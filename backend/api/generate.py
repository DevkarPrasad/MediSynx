from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import pandas as pd
from tempfile import NamedTemporaryFile
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Define available models manually to avoid PluginLoader issues
AVAILABLE_MODELS = ["dpgan", "ctgan", "privbayes"]

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
        
        # Validate model
        if model_name not in AVAILABLE_MODELS:
            raise HTTPException(
                status_code=400, 
                detail=f"Model '{model_name}' not available. Available models: {AVAILABLE_MODELS}"
            )
        
        # Import and use the specific plugin
        logger.info(f"Loading plugin: {model_name}")
        if model_name == "dpgan":
            from synthcity.plugins.core.dataloader import DataLoader
            from synthcity.plugins.generic.plugin_dpgan import DPGANPlugin
            syn_model = DPGANPlugin()
        elif model_name == "ctgan":
            from synthcity.plugins.generic.plugin_ctgan import CTGANPlugin
            syn_model = CTGANPlugin()
        elif model_name == "privbayes":
            from synthcity.plugins.generic.plugin_privbayes import PrivBayesPlugin
            syn_model = PrivBayesPlugin()
        else:
            raise HTTPException(status_code=400, detail=f"Model {model_name} not implemented")
        
        logger.info("Fitting model to data...")
        syn_model.fit(df)
        
        logger.info("Generating synthetic data...")
        synthetic_data = syn_model.generate(count=len(df))

        # Save synthetic data
        output_path = temp_file.name.replace(".csv", "_synthetic.csv")
        synthetic_data.to_csv(output_path, index=False)
        
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