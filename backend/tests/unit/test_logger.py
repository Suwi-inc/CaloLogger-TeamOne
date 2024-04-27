from unittest.mock import patch

from app.logger import setup_logger


# Mock the logger to avoid actual file I/O during tests
@patch("loguru.logger.add")
def test_setup_logger(mock_add):
    setup_logger()
    mock_add.assert_called_once()
    args, kwargs = mock_add.call_args

    # Check if the log file configuration is correct
    path = "logs/app.log"
    assert kwargs["sink"] == path, "Log file should be 'logs/app.log'"
    error_message = "Logs should be serialized (JSON format)"
    assert kwargs["serialize"], error_message
    assert kwargs["rotation"] == "1 day", "Log rotation should be set to 1 day"
    error_message = "Log retention should be set to 30 days"
    assert kwargs["retention"] == "30 days", error_message
    assert kwargs["level"] == "DEBUG", "Log level should be set to DEBUG"
