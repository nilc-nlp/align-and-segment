from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from celery import Celery
from pathlib import Path
import os


from src.config import CONFIG

DATA_PATH = Path("data")
UPLOAD_PATH = DATA_PATH / "uploads"
UPLOAD_PATH.mkdir(parents=True, exist_ok=True)

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

# Setup Celery
celery = Celery(
    __name__,
    broker=CONFIG.redis.url.unicode_string(),
    backend=CONFIG.redis.url.unicode_string(),
)


# Define a Celery task
@celery.task(bind=True)
def process_audio_file(self, file_path):
    try:
        # Your processing logic here
        print(f"Processing file: {file_path}")
        # ... processing the file ...
        import time

        time.sleep(40)  # Simulating a long task

        # Initial state
        self.update_state(state="STARTED", meta={"step": "Initializing"})

        time.sleep(20)

        # Processing step 1
        # ... do something ...
        self.update_state(state="PROGRESS", meta={"step": "Processing step 1"})

        time.sleep(15)

        # Processing step 2
        # ... do something else ...
        self.update_state(state="PROGRESS", meta={"step": "Processing step 2"})

        time.sleep(15)

        # # After processing, delete the file
        # os.remove(file_path)
        # print(f"Deleted file: {file_path}")
        return {"status": "Completed", "file": file_path}

    except Exception as e:
        # Handle exceptions
        return {"status": "Error", "error": str(e)}


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = f"data/uploads/{file.filename}"
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())

    # Queue the task
    task = process_audio_file.delay(str(file_location))

    return {
        "task_id": task.id,
        "file_path": str(file_location),
        "file_name": file.filename,
    }


@app.get("/status/{task_id}")
async def get_status(task_id):
    task_result = process_audio_file.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
