from celery import Celery

from src.config import CONFIG

# Setup Celery
celery_app = Celery(
    __name__,
    broker=CONFIG.redis.url.unicode_string(),
    backend=CONFIG.redis.url.unicode_string(),
)

celery_app.autodiscover_tasks(["src.tasks.alignment"], force=True)
