import serial
import requests
import random

ser = serial.Serial("/dev/ttyACM0", 9600, timeout=1)

# API endpoint URL
api_url = "http://localhost:1000/health-track/record"

def getRandomTemprature():

    # getting random body temprature by now.
    lower_bound = 30
    upper_bound = 45
    random_temprature = random.uniform(lower_bound, upper_bound)

    return random_temprature

print("==================== Welcome to Health Track Pro Plus ==================")

try:
    while True:
        data = ser.readline().decode().strip()
        if data and float(data) <=120 and float(data) >= 60:
            print(f"Received data from Arduino: {data}")
            request_body = {"patient_id": "0987654312123456", "heart_rate": int(float(data)), "body_temperature": int(getRandomTemprature()),}
            response = requests.post(api_url, json=request_body)
            if response.status_code == 201:
                print('Data uploaded successfully!')
            else:
                print("Failed to upload data")
except KeyboardInterrupt:
    print("Serial communication interrupted.")
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
finally:
    ser.close()