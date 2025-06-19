from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
from tempfile import NamedTemporaryFile
import os
import logging
import numpy as np

router = APIRouter()
logger = logging.getLogger(__name__)

def sanitize_json(obj):
    if isinstance(obj, dict):
        return {k: sanitize_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_json(x) for x in obj]
    elif isinstance(obj, float):
        if np.isnan(obj) or np.isinf(obj):
            return None
        return obj
    return obj

@router.post("/preprocess/")
async def preprocess_csv(file: UploadFile = File(...)):
    try:
        # Validate file
        if not file.filename or not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        logger.info(f"Preprocessing file: {file.filename}")
        
        temp_file = NamedTemporaryFile(delete=False)
        contents = await file.read()
        temp_file.write(contents)
        temp_file.close()

        df = pd.read_csv(temp_file.name)
        logger.info(f"Loaded CSV with shape: {df.shape}")
        
        # Get summary statistics
        summary = df.describe(include='all').to_dict()
        
        # Get preview (first 5 rows including headers)
        preview_data = [df.columns.tolist()]  # Headers
        preview_data.extend(df.head(5).values.tolist())  # First 5 rows
        
        # Clean up temp file
        os.unlink(temp_file.name)

        return {
            "preview": sanitize_json(preview_data),
            "summary": sanitize_json(summary)
        }
        
    except Exception as e:
        logger.error(f"Error in preprocess: {str(e)}")
        # Clean up temp file if it exists
        if 'temp_file' in locals() and os.path.exists(temp_file.name):
            os.unlink(temp_file.name)
        raise HTTPException(status_code=500, detail=f"Preprocessing failed: {str(e)}") 