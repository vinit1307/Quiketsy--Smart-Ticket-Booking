from fastapi import FastAPI
from app.services.recommender import recommend_events
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Add your React app URL
    allow_credentials=True,
    allow_methods=["*"],  # Or specify ["GET", "POST"] etc.
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"} 

@app.get("/recommend/{user_id}")
async def recommend(user_id: int, top_n: int = 12):
    return {"recommendation" : recommend_events(user_id, top_n)}
