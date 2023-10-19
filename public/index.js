/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

async function listAllPatients() {
    const res = await fetch("/health-track/patients", {method: "GET"});
    let list = await res.json();

    if(list.success == true) {
        let patient_table_body = document.getElementById("patient-table-body");
        document.getElementById("charts-div").style.display = "none"; // remove charts from viewport    
        list.data.map((patient_data) => {
            let tr = document.createElement('tr');
            let td_id = document.createElement('td');
            let td_name = document.createElement('td');
            let td_frequent_sickness = document.createElement('td');
            let visualize_button  = document.createElement('button');

            visualize_button.setAttribute("onclick", `showChartsPerUser(${patient_data.national_id})`); // display patient's stats when visualize button is clicked.

            visualize_button.className = "bg-transparent border border-slate-600 px-12 py-4 font-mono text-[rgb(75,192,192)] font-extrabold underline";
            td_id.className = "border border-slate-600 px-12 py-4 font-mono text-white font-light";
            td_name.className = "border border-slate-600 px-12  py-4 font-mono text-white font-light";
            td_frequent_sickness.className = "border border-slate-600 px-12 py-4 font-mono text-white font-light";

            visualize_button.appendChild(document.createTextNode("visualize"));
            td_id.appendChild(document.createTextNode(patient_data.national_id));
            td_name.appendChild(document.createTextNode(patient_data.name));
            td_frequent_sickness.appendChild(document.createTextNode(patient_data.frequent_sickness));

            tr.appendChild(td_id);
            tr.appendChild(td_name);
            tr.appendChild(td_frequent_sickness);
            tr.appendChild(visualize_button);

            patient_table_body.appendChild(tr);
        });
    } else {
        console.log("Failed to load ....");
    }
}

// Function to display a chart for a specific patient
async function showChartsPerUser(patientId) {
    console.log(patientId);
    const res = await fetch(`/health-track/patient-record/${patientId}`, { method: "GET" });
    const records = await res.json();

    const chartData = records.data.map(record => ({
        body_temperature: record.body_temperature,
        heart_rate: record.heart_rate
    }));

    const chartLabels = records.data.map((record, index) => `R ${index + 1}`);
    document.getElementById("charts-div").style.display = "block";
    document.getElementById("tables").style.display = "none";
    const chartCanvas = document.getElementById("charts");
    chartCanvas.style.display = "block";

    // eslint-disable-next-line no-undef
    new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Body Temperature',
                    data: chartData.map(record => record.body_temperature),
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false,
                    color: "white"
                },
                {
                    label: 'Heart Rate',
                    data: chartData.map(record => record.heart_rate),
                    borderColor: 'rgb(255, 99, 132)',
                    fill: false,
                    color: "white"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Record'
                    },
                    ticks: {
                        color: "white"
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    ticks: {
                        color: "white"
                    }
                }
            }
        }
    });
}


function visitRepo() {
    window.location.href = "https://github.com/pacifiquem/HealthTrack"
}

function exitTab() {
    window.close();
}