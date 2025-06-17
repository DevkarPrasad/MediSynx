from fastapi import APIRouter, UploadFile, File, Form
from synthcity.plugins import Plugins
import pandas as pd
from tempfile import NamedTemporaryFile

router = APIRouter()

@router.post("/generate/")
async def generate(file: UploadFile = File(...), model_name: str = Form(...)):
    temp = NamedTemporaryFile(delete=False)
    contents = await file.read()
    temp.write(contents)
    temp.close()

    df = pd.read_csv(temp.name)
    
    plugin = Plugins.get(model_name)
    plugin.fit(df)
    synthetic_data = plugin.generate(count=len(df))

    output_path = temp.name.replace(".csv", "_synthetic.csv")
    synthetic_data.to_csv(output_path, index=False)

    return {"message": "Synthetic data generated", "path": output_path} 