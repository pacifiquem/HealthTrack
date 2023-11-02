#define samp_siz 4
#define rise_threshold 4

// Pulse Monitor  Test Script
int sensorPin = 0;
float first, second, third, before, print_value;
long int last_beat;

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  float avgHeartRate = getHeartRate();
  Serial.print(avgHeartRate);
  Serial.print('\n');
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