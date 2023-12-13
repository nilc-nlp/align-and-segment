import os
from uuid import uuid4
import subprocess

from src.config import CONFIG
from src.celery_broker import celery_app

OUTPUTS_FOLDER = CONFIG.data_path / "outputs"
OUTPUTS_FOLDER.mkdir(parents=True, exist_ok=True)


# Define a Celery task
@celery_app.task(bind=True)
def process_audio_file(self, audio_file_path, transcription_file_path):
    try:
        # Your processing logic here
        print(f"Processing file: {audio_file_path}")
        self.update_state(state="PROCESSING", meta={"step": "Initializing"})

        # ... processing the file ...
        import time

        time.sleep(10)  # Simulating a long task
        # LOGIC HERE
        subprocess.run(
            "upfalign -i audio_file_path -t transcription_file_path -o output_file_path"
        )
        #

        output_file_path = OUTPUTS_FOLDER / f"{uuid4()}.txt"
        with open(output_file_path, "w") as f:
            f.write(
                f"This is the output for the files: {audio_file_path} and {transcription_file_path}"
            )

        # After processing, delete the file
        os.remove(audio_file_path)
        os.remove(transcription_file_path)
        print(f"Deleted the files: {audio_file_path} and {transcription_file_path}")

        return output_file_path.as_posix()

    except Exception as e:
        # Handle exceptions
        return {"status": "Error", "error": str(e)}
