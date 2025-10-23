from fastapi import FastAPI
from app.services.recommender import recommend_events

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"} 

@app.get("/recommend/{user_id}")
async def recommend(user_id: int, top_n: int = 5):
    return {"recommendation" : recommend_events(user_id, top_n)}
