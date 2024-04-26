import os
import uvicorn
from dotenv import load_dotenv

from app.main import app

load_dotenv()

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=os.getenv("PORT", 5000),
    )
