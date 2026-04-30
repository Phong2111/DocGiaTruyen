# Main entry point for AI & Audio Service
from fastapi import FastAPI

app = FastAPI(title="DocGiaTruyen AI & Audio Service")

@app.get("/")
def read_root():
    return {"message": "AI & Audio Service is running"}
