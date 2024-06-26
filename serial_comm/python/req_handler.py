import serial
import requests

ser = serial.Serial("/dev/ttyACM0", 9600, timeout=1) # Remember to change port number.

# API endpoint URL
api_url = "http://localhost:1000/health-track/record"

try:
    while True:
        data = ser.readline().decode().strip()
        if data:
            print(data);
            if "Patient ID:" in data and "Heart Rate:" in data and "Body Temperature:" in data:
                # Split the data string into components
                components = data.split(" && ")
                # Extract patient ID, heart rate and body temperature
                patient_id = components[0].split(": ")[1]
                heart_rate = float(components[1].split(": ")[1])
                body_temperature = float(components[2].split(": ")[1])

                if 40 <= heart_rate <= 160:
                    request_body = {"patient_id": patient_id, "heart_rate": int(float(heart_rate)), "body_temperature": int(float(body_temperature))}
                    response = requests.post(api_url, json=request_body)
                    if response.status_code == 201:
                        print(response.json())
                    else:
                        print(response.json())
                        print("Failed to upload data")
except KeyboardInterrupt:
    print("Serial communication interrupted.")
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
finally:
    ser.close()