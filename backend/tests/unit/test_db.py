import pytest
from unittest.mock import patch, MagicMock
from app.utils.db import get_db

# Define the path to the SessionLocal object in the app.database module
SESSION_LOCAL_PATH = "app.utils.db.SessionLocal"


def test_get_db():
    # Mock the SessionLocal object
    with patch(SESSION_LOCAL_PATH, return_value=MagicMock()) as mock_session:
        # Call the get_db function
        db_generator = get_db()
        db = next(db_generator)

        # Assertions
        # Check if SessionLocal was called once
        mock_session.assert_called_once()
        # Check if the returned database object matches the mocked session
        assert db == mock_session.return_value

        # Ensure that the session is closed when generator is exhausted
        with pytest.raises(StopIteration):
            next(db_generator)
        # Check if the close method of the mocked session was called once
        db.close.assert_called_once()
