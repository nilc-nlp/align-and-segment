from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes import alignment, segmentation

app = FastAPI()

# Initialize FastAPI app
app = FastAPI(
    title="Audio Processing API",
    description="An API to process audio files asynchronously",
)

allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alignment.router)
app.include_router(segmentation.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
