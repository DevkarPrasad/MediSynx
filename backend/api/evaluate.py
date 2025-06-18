from fastapi import APIRouter, UploadFile, File
import pandas as pd
from tempfile import NamedTemporaryFile
import os

router = APIRouter()

@router.post("/evaluate/")
async def evaluate(real: UploadFile = File(...), synthetic: UploadFile = File(...)):
    # Save real file temporarily
    temp_real = NamedTemporaryFile(delete=False, suffix='.csv')
    real_contents = await real.read()
    temp_real.write(real_contents)
    temp_real.close()
    
    # Save synthetic file temporarily
    temp_synth = NamedTemporaryFile(delete=False, suffix='.csv')
    synth_contents = await synthetic.read()
    temp_synth.write(synth_contents)
    temp_synth.close()
    
    # Read dataframes
    df_real = pd.read_csv(temp_real.name)
    df_synth = pd.read_csv(temp_synth.name)
    
    # Calculate MSE for each column
    mse = {}
    for col in df_real.columns:
        if col in df_synth.columns:
            mse[col] = ((df_real[col] - df_synth[col]) ** 2).mean()
    
    # Clean up temp files
    os.unlink(temp_real.name)
    os.unlink(temp_synth.name)
    
    return {"mse": mse} 