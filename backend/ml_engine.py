import numpy as np
from sklearn.linear_model import LinearRegression

# Mock training data [Current Rating, Problems Solved] -> [Next Rating]
X_train = np.array([[1200, 50], [1250, 60], [1240, 65], [1300, 80]]) 
y_train = np.array([1250, 1240, 1300, 1350]) 

model = LinearRegression()
model.fit(X_train, y_train)

def predict_student_performance(current_rating, problems_solved):
    if not current_rating or not problems_solved:
        return 0, "Not enough data"
        
    prediction = model.predict(np.array([[current_rating, problems_solved]]))
    predicted_val = int(prediction[0])
    
    suggestion = ""
    if predicted_val > current_rating:
        suggestion = "Great trajectory! Try the weekly hard challenge."
    else:
        suggestion = "Risk of rating drop. Focus on Graph Theory problems."
        
    return predicted_val, suggestion