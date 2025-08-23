# File: app.py
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn


matplotlib.use('Agg') # Non-GUI backend for matplotlib

import seaborn as sns
from io import BytesIO
from fastapi.responses import Response

# Define the data structure for a single customer (input validation)
class CustomerData(BaseModel):
    Age: int
    Income: int
    ProductQuality: int
    ServiceQuality: int
    PurchaseFrequency: int
    Gender: str
    Country: str
    FeedbackScore: str
    LoyaltyLevel: str

# Initialize the FastAPI app
app = FastAPI(title="Customer Pulse Prediction API")

# Load the model during startup
try:
    model = joblib.load('customer_pulse_model.pkl')
    print("ML Model 'customer_pulse_model.pkl' loaded successfully.")
except FileNotFoundError:
    print("ERROR: Model file 'customer_pulse_model.pkl' not found.")
    print("Please run 'python train_model.py' first.")
    model = None

# API root endpoint
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Customer Pulse Prediction API is running"}

# Single prediction endpoint
@app.post("/predict_sigle")
def predict_single(customer: CustomerData):
    if not model:
        raise HTTPException(status_code=500, detail="Model is not loaded")
    
    input_df = pd.DataFrame([customer.dict()])
    prediction = model.predict(input_df)[0]
    predicted_score = round(max(1, min(100, prediction)), 1)
    score_category = "High" if predicted_score >= 80 else "Medium" if predicted_score >= 60 else "Low"
    
    return {"predicted_score": predicted_score, "score_category": score_category}

# Bulk prediction endpoint
@app.post("/predict_bulk")
def predict_bulk(customers: List[CustomerData]):
    if not model:
        raise HTTPException(status_code=500, detail="Model is not loaded")

    input_df = pd.DataFrame([c.dict() for c in customers])
    predictions = model.predict(input_df)
    
    input_df['PredictedSatisfactionScore'] = [round(max(1, min(100, p)), 1) for p in predictions]
    
    return input_df.to_dict(orient='records')

# --- Plotting Endpoint ---

def load_plot_data():
    try:
        return pd.read_csv('customer_feedback_satisfaction.csv')
    except FileNotFoundError:
        print("ERROR: Dataset 'customer_feedback_satisfaction.csv' not found for plotting.")
        raise HTTPException(status_code=500, detail="Dataset for plotting not found on server.")

@app.get("/plot")
def get_plot(plot_name: str, feature: Optional[str] = None):
    df = load_plot_data()
    fig, ax = plt.subplots(figsize=(8, 5))
    plt.style.use('seaborn-v0_8-whitegrid') # Use a nice style for the plots

    try:
        if plot_name == "distribution":
            sns.histplot(data=df, x='SatisfactionScore', kde=True, ax=ax, color='#3b82f6')
            ax.set_title('Distribution of Customer Satisfaction Scores', fontsize=14, weight='bold')
        elif plot_name == "feature_importance":
            # In a real scenario, you'd calculate this from your model's feature_importances_
            importances = pd.Series([0.4, 0.3, 0.15, 0.1, 0.05], index=['ServiceQuality', 'ProductQuality', 'LoyaltyLevel', 'FeedbackScore', 'Income'])
            importances.sort_values().plot(kind='barh', ax=ax, color='#10b981')
            ax.set_title('Key Driver Analysis (Feature Importance)', fontsize=14, weight='bold')
        elif plot_name == "segment_comparison" and feature:
            sns.boxplot(data=df, x=feature, y='SatisfactionScore', ax=ax, palette='viridis')
            ax.set_title(f'Satisfaction Score by {feature}', fontsize=14, weight='bold')
            plt.xticks(rotation=15, ha="right")
        else:
            ax.text(0.5, 0.5, 'Plot Not Available', ha='center', va='center', fontsize=16)
            ax.set_title('Select a Plot', fontsize=14, weight='bold')

        # Save the plot to a memory buffer
        buf = BytesIO()
        fig.savefig(buf, format="png", bbox_inches='tight', dpi=100)
        plt.close(fig)
        buf.seek(0)
        
        # Return the image directly as a response
        return Response(content=buf.getvalue(), media_type="image/png")
    except Exception as e:
        print(f"Error generating plot '{plot_name}': {e}")
        raise HTTPException(status_code=500, detail="Error generating plot.")


# This allows running the server directly for testing
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)