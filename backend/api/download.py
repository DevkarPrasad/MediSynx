from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/download/")
async def download(path: str):
    return FileResponse(path, media_type='text/csv', filename="synthetic_data.csv") 