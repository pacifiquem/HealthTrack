#include <OneWire.h>
#include <DallasTemperature.h>

#define samp_siz 4
#define rise_threshold 4
#define ONE_WIRE_BUS 2 // Digital pin #2

// Pulse Monitor  Test Script
int sensorPin = 0;
float first, second, third, before, print_value;
long int last_beat;
float offsetCorrection = 7; // Offset correction value in degrees Celsius

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup()
{
  Serial.begin(9600);
  sensors.begin();
  sensors.setResolution(12); // Set the resolution to 12 bits
}

void loop()
{

  Serial.println();
  
  float avgHeartRate = getHeartRate();
  float temperature = getTemprature();

  givePythonData(avgHeartRate, temperature);

  delay(5000);
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
  while (millis() < start_time + 10000) // average heart rate in 10 seconds
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

void givePythonData(float heart_rate, float temperature)
{
  Serial.println();
  Serial.print("Heart Rate: ");
  Serial.print(heart_rate);
  Serial.print(" && Body Temperature: ");
  Serial.print(temperature);
  Serial.println();
}
