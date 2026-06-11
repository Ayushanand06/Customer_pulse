# Customer Pulse 

A comprehensive application for customer satisfaction analysis and prediction.

## 🚀 Features

- **Data Insights**: Interactive exploratory data analysis with dynamic visualizations
- **Live Prediction**: Real-time satisfaction score predictions for individual customers
- **Bulk Forecasting**: Batch predictions for entire customer datasets
- **Export Ready**: Download prediction results as CSV files

## 📦 Installation

1. Install required dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Set up the project (train model and generate sample data):
\`\`\`bash
python scripts/setup_project.py
\`\`\`

3. Run the Streamlit application:
\`\`\`bash
streamlit run app.py
\`\`\`

## 🏗️ Project Structure

\`\`\`
customer-pulse/
├── app.py                              # Main Streamlit application
├── train_model.py                      # Model training script
├── requirements.txt                    # Python dependencies
├── customer_pulse_model.pkl           # Trained model (generated)
├── customer_feedback_satisfaction.csv # Dataset (generated)
├── scripts/
│   └── setup_project.py              # Project setup script
└── README.md                         # This file
\`\`\`

## 🎯 Usage

### Training the Model
The model follows the "Train Once, Use Everywhere" principle:
- Run `train_model.py` once to create the model and sample dataset
- The Streamlit app loads the pre-trained model for fast predictions

### Using the Application
1. **Home**: Overview and introduction to Customer Pulse
2. **Data Insights**: Explore customer data with interactive visualizations
3. **Live Prediction**: Get instant satisfaction predictions for individual customers
4. **Bulk Forecasting**: Upload CSV files for batch predictions

## 📊 Required CSV Format for Bulk Predictions

Your CSV file must contain these columns:
- `Age`: Customer age (18-100)
- `Income`: Annual income in dollars
- `ProductQuality`: Product quality rating (1-10)
- `ServiceQuality`: Service quality rating (1-10)
- `PurchaseFrequency`: Number of purchases per year
- `Gender`: Male, Female, or Other
- `Country`: Customer's country
- `FeedbackScore`: Poor, Fair, Good, or Excellent
- `LoyaltyLevel`: Bronze, Silver, Gold, or Platinum

## 🤖 Model Details

- **Algorithm**: Gradient Boosting Regressor
- **Features**: 9 customer attributes (5 numerical, 4 categorical)
- **Target**: Customer satisfaction score (0-100)
- **Preprocessing**: StandardScaler for numerical, OneHotEncoder for categorical

## 🛠️ Technical Requirements

- Python 3.8+
- Streamlit 1.28.0+
- scikit-learn 1.3.0+
- pandas 2.0.3+
- matplotlib 3.7.2+
- seaborn 0.12.2+

## 📈 Performance

The application uses Streamlit caching for optimal performance:
- `@st.cache_resource` for model loading
- `@st.cache_data` for dataset loading
- Fast predictions without model retraining
