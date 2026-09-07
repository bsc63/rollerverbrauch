let verbrauchChart = null;

function updateChart(consumptionPerKmWh, consumptionPer100Km, costPer100Km) {

    const ctx = document.getElementById('verbrauchChart').getContext('2d');

    const labels = [
        "Wh/km",
        "kWh/100km",
        "€/100km"
    ];

    const data = [
        consumptionPerKmWh,
        consumptionPer100Km,
        costPer100Km
    ];

    if (verbrauchChart) {
        verbrauchChart.data.datasets[0].data = data;
        verbrauchChart.update();
        return;
    }

    verbrauchChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Verbrauch",
                data: data,
                backgroundColor: [
                    "rgba(76, 175, 80, 0.7)",
                    "rgba(33, 150, 243, 0.7)",
                    "rgba(255, 152, 0, 0.7)"
                ],
                borderRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 600
            },
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: "#333" }
                },
                x: {
                    ticks: { color: "#333" }
                }
            }
        }
    });
}

function saveValuesAndCalculate() {
    const costPerKwh = document.getElementById('cost-per-kwh').value;
    const distance = document.getElementById('distance').value;
    const consumption = document.getElementById('consumption').value;

    if (costPerKwh && distance && consumption) {
        localStorage.setItem('cost-per-kwh', costPerKwh);
        localStorage.setItem('distance', distance);
        localStorage.setItem('consumption', consumption);
        calculateValues();
    }
}

function calculateValues() {
    const costPerKwh = localStorage.getItem('cost-per-kwh');
    const distance = localStorage.getItem('distance');
    const consumption = localStorage.getItem('consumption');

    if (!costPerKwh || !distance || !consumption) return;

    const range = (distance * 100) / consumption;
    document.getElementById('range').innerText = range.toFixed(2);

    const consumptionPerKmWh = 3744 / range;
    document.getElementById('consumption-per-km').innerText = consumptionPerKmWh.toFixed(2);

    const percentageConsumptionPerKm = consumption / distance;
    document.getElementById('percentage-consumption-per-km').innerText = percentageConsumptionPerKm.toFixed(2);

    const consumptionPer100Km = consumptionPerKmWh / 10;
    document.getElementById('consumption-per-100km').innerText = consumptionPer100Km.toFixed(2);

    const costPer100Km = costPerKwh * consumptionPer100Km;
    document.getElementById('cost-per-100km').innerText = costPer100Km.toFixed(2);

    const tripCost = (consumptionPer100Km / 100) * distance * costPerKwh;
    document.getElementById('trip-cost').innerText = tripCost.toFixed(2);

    const costPerCharge = 3.744 * costPerKwh;
    document.getElementById('cost-per-charge').innerText = costPerCharge.toFixed(2);

    updateChart(consumptionPerKmWh, consumptionPer100Km, costPer100Km);
}

function incrementValue(id) {
    const input = document.getElementById(id);
    input.stepUp();
    saveValuesAndCalculate();
}

function decrementValue(id) {
    const input = document.getElementById(id);
    input.stepDown();
    saveValuesAndCalculate();
}

document.addEventListener('DOMContentLoaded', calculateValues);