from fastapi.testclient import TestClient
from app.main import app


def client():
    with TestClient(app) as c:
        return c


if __name__ == "__main__":
    client()
