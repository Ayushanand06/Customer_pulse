"""
Setup script to initialize the Customer Pulse project
Run this script to train the model and prepare all necessary files
"""

import subprocess
import sys
import os

def run_setup():
    """Run the complete project setup"""
    print("🚀 Setting up Customer Pulse project...")
    
    # Check if model training script exists
    if not os.path.exists('train_model.py'):
        print("❌ train_model.py not found!")
        return
    
    # Run model training
    print("🤖 Training the machine learning model...")
    try:
        result = subprocess.run([sys.executable, 'train_model.py'], 
                              capture_output=True, text=True, check=True)
        print("✅ Model training completed successfully!")
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error during model training: {e}")
        print(e.stdout)
        print(e.stderr)
        return
    
    # Check if required files were created
    required_files = ['customer_pulse_model.pkl', 'customer_feedback_satisfaction.csv']
    missing_files = [f for f in required_files if not os.path.exists(f)]
    
    if missing_files:
        print(f"❌ Missing files after training: {missing_files}")
        return
    
    print("🎉 Project setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Run: streamlit run app.py")
    print("2. Open your browser to the provided URL")
    print("3. Start exploring Customer Pulse!")

if __name__ == "__main__":
    run_setup()
