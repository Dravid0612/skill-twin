# backend/ml_engine.py
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import json

class PerformancePredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        
    def predict(self, data):
        """
        Predict student performance based on historical data
        """
        # Extract features
        features = self._extract_features(data)
        
        # Mock prediction for now
        # In production, you'd train this model on real data
        predicted_score = np.mean([
            data.get('attendance', 80) * 0.3,
            np.mean(data.get('previous_marks', [75])) * 0.7
        ])
        
        # Add some randomness
        predicted_score += np.random.normal(0, 5)
        
        return min(100, max(0, predicted_score))
    
    def _extract_features(self, data):
        """Extract features from input data"""
        features = []
        
        # Attendance feature
        features.append(data.get('attendance', 80) / 100)
        
        # Previous marks average
        prev_marks = data.get('previous_marks', [75])
        features.append(np.mean(prev_marks) / 100)
        
        # Subject performance
        subjects = data.get('subjects', [])
        if subjects:
            subject_scores = [s.get('marks', 70) for s in subjects]
            features.append(np.mean(subject_scores) / 100)
        else:
            features.append(0.7)
            
        return np.array(features).reshape(1, -1)

class CodingAnalyzer:
    def analyze_patterns(self, data):
        """
        Analyze coding patterns and predict contest ratings
        """
        problems_solved = data.get('problems_solved', 0)
        current_rating = data.get('contest_rating', 1200)
        
        # Simple rating prediction formula
        predicted_rating = current_rating + (problems_solved * 0.5)
        
        # Calculate skill levels
        skill_levels = {
            'algorithms': min(100, problems_solved * 0.3),
            'data_structures': min(100, problems_solved * 0.4),
            'problem_solving': min(100, problems_solved * 0.35)
        }
        
        return {
            'predicted_rating': predicted_rating,
            'skill_levels': skill_levels,
            'improvement_rate': problems_solved * 0.1,
            'recommendations': self._generate_recommendations(skill_levels)
        }
    
    def _generate_recommendations(self, skill_levels):
        recommendations = []
        
        if skill_levels['algorithms'] < 60:
            recommendations.append("Focus on learning core algorithms like sorting and searching")
        if skill_levels['data_structures'] < 60:
            recommendations.append("Practice implementing basic data structures")
        if skill_levels['problem_solving'] < 60:
            recommendations.append("Solve more medium-difficulty problems")
            
        return recommendations

class PlacementPredictor:
    def predict_readiness(self, student_data):
        """
        Predict placement readiness based on various factors
        """
        cgpa = student_data.get('cgpa', 7.0)
        coding_score = student_data.get('coding_score', 50)
        soft_skills = student_data.get('soft_skills', 50)
        
        # Weighted score calculation
        readiness_score = (
            cgpa * 10 * 0.4 +
            coding_score * 0.4 +
            soft_skills * 0.2
        )
        
        # Categorize readiness
        if readiness_score >= 80:
            category = "Highly Ready"
        elif readiness_score >= 60:
            category = "Moderately Ready"
        elif readiness_score >= 40:
            category = "Needs Improvement"
        else:
            category = "At Risk"
            
        return {
            'readiness_score': readiness_score,
            'category': category,
            'recommendations': self._placement_recommendations(readiness_score)
        }
    
    def _placement_recommendations(self, score):
        if score < 40:
            return ["Focus on improving core technical skills", 
                    "Practice more coding problems",
                    "Improve academic performance"]
        elif score < 60:
            return ["Start mock interviews", 
                    "Build project portfolio",
                    "Improve communication skills"]
        else:
            return ["Apply for company-specific preparation",
                    "Practice advanced algorithms",
                    "Participate in hackathons"]

# Initialize models
performance_predictor = PerformancePredictor()
coding_analyzer = CodingAnalyzer()
placement_predictor = PlacementPredictor()

def predict_performance(data):
    """Wrapper function for performance prediction"""
    return performance_predictor.predict(data)

def analyze_coding_patterns(data):
    """Wrapper function for coding analysis"""
    return coding_analyzer.analyze_patterns(data)

def predict_placement(data):
    """Wrapper function for placement prediction"""
    return placement_predictor.predict_readiness(data)