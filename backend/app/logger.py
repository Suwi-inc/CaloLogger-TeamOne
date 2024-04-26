import sys

config = {
    "handlers": [
        {
            "sink": sys.stdout,
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
