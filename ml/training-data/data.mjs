/*
*   This script will generate 1 million records that will be used to train ML model located in ``../is_sick.py``.
*   They are in form of (Heart Rate, Body temperature, sickness status)
*   Every case sickness_status=0 and sickness_status=1 have exactly 500 000 records.
*/

const generated_records = [];

// generate 250000  Records for only (sickness_status=1) and heart rate is low
for (let i = 0; i < 250000; i++) {
    const heart_rate = Math.floor(Math.random() * (60 - 0 + 1)) + 0;
    const body_temperature = Math.floor(Math.random() * (36 - 30 + 1)) + 30;
    let sickness_status = 1;
    generated_records.push(`(${heart_rate},${body_temperature},${sickness_status})`);
}

// generate 250000  Records for only (sickness_status=1) and heart rate is high
for (let i = 0; i < 250000; i++) {
    const heart_rate = Math.floor(Math.random() * (200 - 90 + 1)) + 90;
    const body_temperature = Math.floor(Math.random() * (42 - 37 + 1)) + 37;
    let sickness_status = 1;
    generated_records.push(`(${heart_rate},${body_temperature},${sickness_status})`);
}

// generate 5 Hundred Thousand Records for only (sickness_status=0)
for (let i = 0; i < 500000; i++) {
    const heart_rate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
    const body_temperature = Math.random() * (37.5 - 36) + 36;
    let sickness_status = 0; // not sick
    generated_records.push(`(${heart_rate},${body_temperature},${sickness_status})`);

}

generated_records.join(',\n');

export default generated_records;
