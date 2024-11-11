import pandas as pd
import pickle

def get_data(client, user_id):
    # Connect to MongoDB
    db = client['Calorie']
    collection = db['Health_data']
    print(user_id)
    try:
        data = collection.find_one({"userId": user_id})
        if data:
            return data
        else:
            return "No data found"
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def calc(doc):
    if not doc or "No data found" in doc:
        return "No data found"

    # Convert the document to a DataFrame
    df = pd.DataFrame([doc])
    df = df.drop(['_id', 'userId'], axis=1)

    # Load the ML model
    with open("C://Users//dimaag//Documents//Python Class//ML//Caloriecount//Backend//ML_code//caloriecount_model", 'rb') as f:
        model = pickle.load(f)

    # Make predictions
    res = model.predict(df)
    result = {str(i): int(res[i]) for i in range(len(res))}
    print(result)
    return result
