from fastapi import APIRouter, UploadFile, File
import pandas as pd

router = APIRouter()

@router.post("/evaluate/")
async def evaluate(real: UploadFile = File(...), synthetic: UploadFile = File(...)):
    df_real = pd.read_csv(real.file)
    df_synth = pd.read_csv(synthetic.file)

    mse = ((df_real - df_synth) ** 2).mean().to_dict()
    return {"mse": mse} 