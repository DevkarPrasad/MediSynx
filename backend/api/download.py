from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter()

OUTPUT_DIR = "backend/outputs"

@router.get("/download/{filename}")
async def download(filename: str):
    """
    Downloads a file from the output directory.
    The path parameter is the filename of the file to download.
    """
    
    # Security: ensure path is just a filename and doesn't try to traverse directories
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid file path.")

    file_path = os.path.join(OUTPUT_DIR, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail=f"File not found at path: {file_path}")

    return FileResponse(file_path, media_type='text/csv', filename=filename) 