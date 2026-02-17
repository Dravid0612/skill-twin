# backend/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uvicorn
import jwt
import bcrypt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from ml_engine import predict_performance, analyze_coding_patterns, predict_placement

# Load environment variables
load_dotenv()

app = FastAPI(title="SkillTwin API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret key for JWT
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")

# Models
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    token: str

class PerformanceData(BaseModel):
    user_id: str
    subjects: List[dict]
    attendance: float
    previous_marks: List[float]

class CodingData(BaseModel):
    user_id: str
    platform: str
    problems_solved: int
    contest_rating: float
    rank: int

# Mock database (replace with real database)
users_db = {}
performance_db = {}

@app.get("/")
async def root():
    return {"message": "Welcome to SkillTwin API", "status": "running"}

@app.post("/api/login", response_model=UserResponse)
async def login(user: UserLogin):
    try:
        # Mock authentication - replace with real database check
        user_id = f"user_{len(users_db) + 1}"
        token = jwt.encode(
            {
                "user_id": user_id,
                "email": user.email,
                "role": user.role,
                "exp": datetime.utcnow() + timedelta(days=1)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        
        response = UserResponse(
            id=user_id,
            email=user.email,
            name=user.email.split('@')[0],
            role=user.role,
            token=token
        )
        
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/predict-performance")
async def predict_student_performance(data: PerformanceData):
    try:
        # Call ML engine
        prediction = predict_performance(data.dict())
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-coding")
async def analyze_coding(data: CodingData):
    try:
        analysis = analyze_coding_patterns(data.dict())
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/student/{student_id}/progress")
async def get_student_progress(student_id: str):
    # Mock data - replace with database query
    return {
        "student_id": student_id,
        "cgpa": 8.7,
        "coding_score": 85,
        "problems_solved": 347,
        "contest_rating": 1642,
        "attendance": 92,
        "at_risk": False,
        "recommendations": [
            "Focus on Dynamic Programming",
            "Practice System Design",
            "Improve Database concepts"
        ]
    }

@app.get("/api/advisor/{advisor_id}/students")
async def get_advisor_students(advisor_id: str):
    # Mock data for advisor dashboard
    return {
        "total_students": 45,
        "at_risk_students": 3,
        "average_performance": 78.5,
        "students": [
            {"id": "1", "name": "John Doe", "performance": 85, "status": "good"},
            {"id": "2", "name": "Jane Smith", "performance": 62, "status": "at_risk"},
            {"id": "3", "name": "Bob Johnson", "performance": 91, "status": "excellent"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)