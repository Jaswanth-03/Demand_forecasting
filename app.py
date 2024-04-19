from flask import Flask, render_template, request, flash
from sklearn.exceptions import DataDimensionalityWarning
import warnings
import pickle
import os
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

app = Flask(__name__)

# Reload the combined model and transformer
loaded_dict = joblib.load("demand_model.joblib")
loaded_ct = loaded_dict["transformer"]
loaded_model = loaded_dict["gb_best_model"]


@app.route('/', methods=['GET', 'POST'])
def predict_demand():
    if request.method == 'POST':
        # Get user input from the form
        try:
            brand = request.form['brand']
            price = float(request.form['price'].replace(',', ''))
            screen_size = float(request.form['screen_size'].replace(',', ''))
            ram = int(request.form['ram'])
            storage = int(request.form['storage'])
            camera = float(request.form['camera'].replace(',', ''))
            marketing_budget = float(request.form['marketing_budget'].replace(',', ''))
            region = request.form['region']
            Quarter = request.form['Quarter']
        except ValueError:
            flash('Invalid input for one or more fields. Please check your input and try again.', 'error')
            return render_template('index.html')

        # Preprocess the input data
        new_data = [[brand, price, screen_size, ram, storage, camera, marketing_budget, region, Quarter]]
        
        # Convert new_data to a DataFrame
        new_data_df = pd.DataFrame(new_data, columns=['Brand', 'Price (USD)', 'Screen Size', 'RAM', 'Storage', 'Camera (MP)', 'Marketing Budget (USD)', 'Region', 'Quarter'])

        
        # Apply the transformation
        new_data_processed = loaded_ct.transform(new_data_df)

        # Predict on transformed new data
        new_data_predictions = loaded_model.predict(new_data_processed)
        # preprocessed_data = preprocess_data(new_data)

        # Make a prediction using the model
        # predicted_demand = model.predict(preprocessed_data.reshape(1, -1))[0]

        # Render the result template with the predicted demand
        return render_template('result.html', predicted_demand=int(new_data_predictions[0]),
                               brand=brand, price=price, screen_size=screen_size,
                               ram=ram, storage=storage, camera=camera,
                               marketing_budget=marketing_budget, region=region, Quarter=Quarter)

    # Render the input form for the initial GET request
    return render_template('index.html')

# def preprocess_data(product_details):
#     preprocessed_data = preprocessor.transform([product_details])
#     return preprocessed_data

if __name__ == '__main__':
    app.run(debug=True, port=int(os.environ.get('PORT', 5000)))