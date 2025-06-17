from fastapi import APIRouter, UploadFile, File
import pandas as pd
from tempfile import NamedTemporaryFile

router = APIRouter()

@router.post("/preprocess/")
async def preprocess_csv(file: UploadFile = File(...)):
    temp_file = NamedTemporaryFile(delete=False)
    contents = await file.read()
    temp_file.write(contents)
    temp_file.close()

    df = pd.read_csv(temp_file.name)
    summary = df.describe(include='all').to_dict()

    return {"summary": summary} 