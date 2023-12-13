from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import os

from src.config import CONFIG
from src.tasks.alignment import process_audio_file

router = APIRouter()


@router.post("/alignment")
async def upload_file(
    audio_file: UploadFile = File(...), transcription_file: UploadFile = File(...)
):
    UPLOAD_FOLDER = CONFIG.data_path / "uploads"
    os.makedirs(os.path.dirname(UPLOAD_FOLDER), exist_ok=True)

    audio_file_location = UPLOAD_FOLDER / str(audio_file.filename)
    transcription_file_location = UPLOAD_FOLDER / str(transcription_file.filename)

    # Save the files
    with open(audio_file_location, "wb") as f:
        f.write(audio_file.file.read())
    with open(transcription_file_location, "wb") as f:
        f.write(transcription_file.file.read())

    # Queue the task with file paths
    task = process_audio_file.delay(
        audio_file_location.as_posix(), transcription_file_location.as_posix()
    )

    return {"task_id": task.id}


@router.get("/alignment/{task_id}")
async def get_status(task_id):
    task_result = process_audio_file.AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result,
    }


@router.get("/alignment/{task_id}/download")
async def download_result(task_id):
    task_result = process_audio_file.AsyncResult(task_id)
    if task_result.status == "SUCCESS":
        return FileResponse(task_result.result)
    else:
        return {
            "task_id": task_id,
            "status": task_result.status,
            "result": task_result.result,
        }
