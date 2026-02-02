from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware
from ml_engine import predict_student_performance
import os
import random

# --- CONFIG ---
# REPLACE WITH YOUR SUPABASE CREDENTIALS
SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_KEY = "your-anon-key"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class UserData(BaseModel):
    firebase_uid: str
    email: str
    role: str
    full_name: str

class StatUpdate(BaseModel):
    user_id: str  # UPDATED: Now accepts UUID
    platform: str
    rating: int
    problems_solved: int

# --- ROUTES ---

@app.post("/auth/sync")
def sync_user(user: UserData):
    # Check if user exists
    res = supabase.table('users').select("*").eq('email', user.email).execute()
    
    if not res.data:
        # Create new user
        data = supabase.table('users').insert({
            "firebase_uid": user.firebase_uid,
            "email": user.email,
            "role": user.role,
            "full_name": user.full_name
        }).execute()
        # Return new User ID
        return {"status": "created", "role": user.role, "user_id": data.data[0]['id']}
    
    # Return existing User ID
    return {"status": "exists", "role": res.data[0]['role'], "user_id": res.data[0]['id']}

@app.get("/student/dashboard/{user_id}")
def get_student_data(user_id: str):
    # Fetch Stats by User ID
    stats = supabase.table('coding_stats').select("*").eq('user_id', user_id).execute()
    
    prediction = {"predicted_rating": 0, "suggestion": "No data available yet."}
    
    if stats.data:
        # Sort by date to get latest
        sorted_stats = sorted(stats.data, key=lambda x: x['contest_date'])
        latest = sorted_stats[-1]
        
        # ML Prediction
        pred_rating, sugg = predict_student_performance(latest['rating'], latest['problems_solved'])
        prediction = {"predicted_rating": pred_rating, "suggestion": sugg}

    return {"history": stats.data, "prediction": prediction}

@app.get("/advisor/generate-test")
def generate_test():
    problems = [
        {"id": 1, "title": "Two Sum", "difficulty": "Easy", "platform": "LeetCode"},
        {"id": 2, "title": "Merge K Lists", "difficulty": "Hard", "platform": "LeetCode"},
        {"id": 3, "title": "Chef and Strings", "difficulty": "Medium", "platform": "CodeChef"},
        {"id": 4, "title": "Watermelon", "difficulty": "Easy", "platform": "CodeForces"},
    ]
    return random.sample(problems, min(3, len(problems)))

@app.get("/hod/overview")
def get_hod_overview():
    users = supabase.table('users').select("*").execute()
    stats = supabase.table('coding_stats').select("*").execute()
    return {
        "total_students": len([u for u in users.data if u['role'] == 'student']),
        "total_submissions": len(stats.data),
        "raw_data": stats.data
    }

@app.post("/stats/update")
def update_stats(data: StatUpdate):
    res = supabase.table('coding_stats').insert(data.dict()).execute()
    return {"message": "Stats updated successfully"}