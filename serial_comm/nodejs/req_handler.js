import { SerialPort } from 'serialport';
const Readline = SerialPort.parsers.Readline;
import { request } from 'request';
import process from 'process';


const port = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600,
});

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

const apiURL = 'http://localhost:1000/health-track/record';

parser.on('data', (data) => {
  data = data.trim();
  if (data && parseFloat(data) <= 120 && parseFloat(data) >= 60) {
    console.log(`Received data from Arduino: ${data}`);
    const request_body = {
      patient_id: '4567893021869403',
      heart_rate: parseInt(parseFloat(data)),
      body_temperature: 42,
    };

    request.post(
      {
        url: apiURL,
        json: request_body,
      },
      (error, response) => {
        if (!error && response.statusCode === 201) {
          console.log('Data uploaded successfully!');
        } else {
          console.log('Failed to upload data');
        }
      }
    );
  }
});

process.on('SIGINT', () => {
  console.log('Serial communication interrupted.');
  port.close();
});