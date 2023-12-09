from fastapi import FastAPI, UploadFile, File
from celery import Celery
from pathlib import Path
from uuid import uuid4

from src.config import CONFIG

DATA_PATH = Path("../data")
UPLOAD_PATH = DATA_PATH / "uploads"
UPLOAD_PATH.mkdir(parents=True, exist_ok=True)

# Initialize FastAPI app
app = FastAPI(
    title="Audio Processing API",
    description="An API to process audio files asynchronously",
)

# Setup Celery
celery = Celery(
    __name__,
    broker=CONFIG.redis.url.unicode_string(),
    backend=CONFIG.redis.url.unicode_string(),
)


# Define a Celery task
@celery.task(bind=True)
def process_audio_file(self, file_path):
    # Long-running task (dummy implementation)
    # Replace with actual audio processing logic
    import time

    time.sleep(120)  # Simulating a long task
    return {"status": "Completed", "file": file_path}


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Save file to a directory
    file_location = UPLOAD_PATH / (file.filename or f"{uuid4()}.{file.content_type}")
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    # Queue the task
    task = process_audio_file.delay(str(file_location))

    return {"task_id": task.id}


@app.get("/status/{task_id}")
def get_status(task_id):
    task_result = process_audio_file.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
