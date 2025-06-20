from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"status": "Backend is alive 🚀"}

# Run this with:
# uvicorn backend.debug_main:app --reload 