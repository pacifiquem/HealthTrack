#include <OneWire.h>
#include <DallasTemperature.h>
#include <SPI.h>
#include <MFRC522.h>

#define samp_siz 4
#define rise_threshold 4
#define ONE_WIRE_BUS 2 // Digital pin #2
#define RST_PIN 9      // Digital pin #9
#define SS_PIN 10      // Digital pin #10

// Pulse Monitor  Test Script
int sensorPin = 0;
float first, second, third, before, print_value;
long int last_beat;
float offsetCorrection = 10; // Offset correction value in degrees Celsius

// RFID configs
MFRC522 mfrc522(SS_PIN, RST_PIN);
MFRC522::MIFARE_Key key;
MFRC522::StatusCode card_status;

// Temperature sensor configs
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup()
{
  Serial.begin(9600);
  sensors.begin();
  sensors.setResolution(12); // Set the resolution to 12 bits
  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println(F("PCD Ready!"));
}

void loop()
{

  // set encryption to the card.
  for (byte i = 0; i < 6; i++)
  {
    key.keyByte[i] = 0xFF;
  }

  if (!mfrc522.PICC_IsNewCardPresent())
  {
    return;
  }

  if (!mfrc522.PICC_ReadCardSerial())
  {
    return;
  }

  // read data accordingly
  String patient_id = getPatientID_From_card();

  Serial.print("Recording records for patient with id: ");
  Serial.println(patient_id);
  Serial.println("=======================================");

  for (;;)
  {
    float avgHeartRate = getHeartRate();
    float temperature = getTemprature();
    givePythonData(patient_id, avgHeartRate, temperature);
    delay(3000);
  }

  // stop any operation (either cryptographic or activeness) on both PCD && PICC
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();

  // wait for 5 seconds before another RECORD.
  delay(2000);
}

float getHeartRate()
{
  float reads[samp_siz], sum;
  long int now, ptr;
  float last, reader, start;
  bool rising;
  int rise_count;
  int n;

  for (int i = 0; i < samp_siz; i++)
    reads[i] = 0;
  sum = 0;
  ptr = 0;
  float total = 0;
  int count = 0;

  long int start_time = millis();
  while (millis() < start_time + 5000) // average heart rate in 5 seconds
  {
    n = 0;
    start = millis();
    reader = 0.;
    do
    {
      reader += analogRead(sensorPin);
      n++;
      now = millis();
    } while (now < start + 20);
    reader /= n; // we got an average

    sum -= reads[ptr];
    sum += reader;
    reads[ptr] = reader;
    last = sum / samp_siz;

    if (last > before)
    {
      rise_count++;
      if (!rising && rise_count > rise_threshold)
      {
        rising = true;
        first = millis() - last_beat;
        last_beat = millis();

        print_value = 60000. / (0.4 * first + 0.3 * second + 0.3 * third);

        total += print_value;
        count++;

        third = second;
        second = first;
      }
    }
    else
    {
      rising = false;
      rise_count = 0;
    }
    before = last;

    ptr++;
    ptr %= samp_siz;
  }

  return total / count;
}

float getTemprature()
{
  sensors.requestTemperatures();                                      // Send command to get temperatures
  delay(750);                                                         // Wait for the conversion to finish (for 12-bit resolution)
  float temperatureC = sensors.getTempCByIndex(0) + offsetCorrection; // Apply offset correction

  return temperatureC;
}

void givePythonData(String patient_id, float heart_rate, float temperature)
{
  Serial.println();
  Serial.print("Patient ID: ");
  Serial.print(patient_id);
  Serial.print(" && Heart Rate: ");
  Serial.print(heart_rate);
  Serial.print(" && Body Temperature: ");
  Serial.print(temperature);
}

String getPatientID_From_card()
{
  byte patientIdBlock = 1;

  card_status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, patientIdBlock, &key, &(mfrc522.uid));
  if (card_status != MFRC522::STATUS_OK)
  {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(card_status));

    return "Authentication Failed"; // Return an error message or code
  }

  byte arrayAddress[18];
  byte buffersize = sizeof(arrayAddress);
  card_status = mfrc522.MIFARE_Read(patientIdBlock, arrayAddress, &buffersize);

  if (card_status != MFRC522::STATUS_OK)
  {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(card_status));

    return "Reading Failed"; // Return an error message or code
  }

  String value = "";
  for (uint8_t i = 0; i < 16; i++)
  {
    value += (char)arrayAddress[i];
  }

  value.trim();

  return value;
}
