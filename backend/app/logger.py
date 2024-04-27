from sys import stdout
import logging

from loguru import logger

import google.cloud.logging
from google.cloud.logging_v2.handlers import CloudLoggingHandler
from google.auth.credentials import with_scopes_if_required

config = {
    "handlers": [
        {
            "sink": stdout,
            "level": "INFO",
            "format": "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | \
                <level>{level: <8}</level> | <level>{message}</level>",
        },
        {
            "sink": "logs/app.log",
            "serialize": True,
            "rotation": "1 day",
            "retention": "30 days",
            "level": "DEBUG",
        },
    ],
}


def setup_logger(
    name: str = "my_logger",
    level: int = logging.DEBUG,
    project_id: str = "my_project",
):
    logger.remove()
    logger.configure(**config)

    # Cloud Logging:
    credentials = with_scopes_if_required(
        None, ["https://www.googleapis.com/auth/cloud-platform"]
    )
    client = google.cloud.logging.Client(
        project=project_id,
        credentials=credentials,
    )
    handler = CloudLoggingHandler(client, name=name)
    handler.setLevel(level=level)
    logger.add(handler)
