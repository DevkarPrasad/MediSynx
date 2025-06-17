from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import auth, preprocess, generate, evaluate, download

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 👀 Replace with exact frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(preprocess.router)
app.include_router(generate.router)
app.include_router(evaluate.router)
app.include_router(download.router)

@app.get("/")
def read_root():
    return {"msg": "Backend running!"}
