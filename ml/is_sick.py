import sqlite3
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Retrieve data from SQLite database
connection = sqlite3.connect("../training_health_track.db")
cursor = connection.cursor()
cursor.execute("SELECT heart_rate, body_temperature, sickness_status FROM health_tbl")
data = cursor.fetchall()
connection.close()

# Organize data into features and labels
features = [(heart_rate, body_temperature) for heart_rate, body_temperature, sickness_status in data]
labels = [sickness_status for _, _, sickness_status in data]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

# Feature Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Model Selection and Training (Logistic Regression example)
model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# Model Evaluation
y_pred = model.predict(X_test_scaled)
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)

# Prediction for new data
# Assuming you have new data
new_rate = 80
new_temperature = 34

# Creating a new data point with the provided values
new_data_point = [(new_rate, new_temperature)]

# Scaling the new data point using the previously fitted scaler
new_data_point_scaled = scaler.transform(new_data_point)

# Making predictions using the trained model
predicted_sickness_status = model.predict(new_data_point_scaled)

# Printing the predicted sickness status
print("Predicted Sickness:", predicted_sickness_status)
