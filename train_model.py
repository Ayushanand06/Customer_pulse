# File: train_model.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import os

def generate_and_save_data():
    """Generates and saves a sample dataset if one doesn't exist."""
    if os.path.exists('customer_feedback_satisfaction.csv'):
        print("Dataset 'customer_feedback_satisfaction.csv' already exists.")
        return pd.read_csv('customer_feedback_satisfaction.csv')

    print("Generating sample dataset: customer_feedback_satisfaction.csv...")
    np.random.seed(42)
    num_samples = 1000
    data = {
        'CustomerID': range(1, num_samples + 1),
        'Age': np.random.randint(18, 70, size=num_samples), 'Income': np.random.randint(25000, 150000, size=num_samples),
        'ProductQuality': np.random.randint(1, 11, size=num_samples), 'ServiceQuality': np.random.randint(1, 11, size=num_samples),
        'PurchaseFrequency': np.random.randint(1, 51, size=num_samples), 'Gender': np.random.choice(['Male', 'Female'], size=num_samples),
        'Country': np.random.choice(['USA', 'Canada', 'UK', 'Germany', 'France'], size=num_samples),
        'FeedbackScore': np.random.choice(['Low', 'Medium', 'High'], size=num_samples),
        'LoyaltyLevel': np.random.choice(['Bronze', 'Silver', 'Gold', 'Platinum'], size=num_samples),
    }
    df = pd.DataFrame(data)
    
    base_score = 30 + (df['ProductQuality'] + df['ServiceQuality']) * 2.5
    loyalty_bonus = df['LoyaltyLevel'].map({'Platinum': 15, 'Gold': 10, 'Silver': 5, 'Bronze': 0})
    feedback_bonus = df['FeedbackScore'].map({'High': 10, 'Medium': 5, 'Low': 0})
    df['SatisfactionScore'] = np.clip(base_score + loyalty_bonus + feedback_bonus + np.random.normal(0, 5, size=num_samples), 1, 100).round(2)
    
    df.to_csv('customer_feedback_satisfaction.csv', index=False)
    print("Dataset saved successfully.")
    return df

def train_and_save_model():
    """Trains the model using the dataset and saves it as a .pkl file."""
    df = generate_and_save_data()
        
    print("Starting model training...")
    
    X = df.drop(columns=['CustomerID', 'SatisfactionScore'])
    y = df['SatisfactionScore']
    
    categorical_cols = ["Gender", "Country", "FeedbackScore", "LoyaltyLevel"]
    numerical_cols = ["Age", "Income", "ProductQuality", "ServiceQuality", "PurchaseFrequency"]
    
    preprocessor = ColumnTransformer(transformers=[
        ("num", StandardScaler(), numerical_cols),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols)
    ])
    
    model_pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", GradientBoostingRegressor(random_state=42))
    ])
    
    model_pipeline.fit(X, y)
    joblib.dump(model_pipeline, 'customer_pulse_model.pkl')
    
    print("\n✅ Model training complete! Saved as 'customer_pulse_model.pkl'")

if __name__ == "__main__":
    train_and_save_model()