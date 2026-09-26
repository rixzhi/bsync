import os
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rag_chat import ChatRequest, handle_citizen_chat, handle_officer_chat

app = FastAPI(title="TS-bPASS Backend")

frontend_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:3000,http://localhost:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "online", "system": "TS-bPASS Engine"}

@app.post("/chat/citizen")
async def citizen_chat(request: ChatRequest):
    try:
        return await handle_citizen_chat(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@app.post("/chat/officer")
async def officer_chat(request: ChatRequest):
    try:
        return await handle_officer_chat(request)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
