from loguru import logger


def setup_logger():
    logger.add(
        sink="logs/app.log",
        serialize=True,
        rotation="1 day",
        retention="30 days",
        level="DEBUG",
    )
