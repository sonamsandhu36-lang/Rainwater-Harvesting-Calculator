
const form = document.getElementById("rainForm");

const areaInput = document.getElementById("area");
const rainfallInput = document.getElementById("rainfall");
const roofInput = document.getElementById("roof");
const efficiencyInput = document.getElementById("efficiency");

const efficiencyValue = document.getElementById("efficiencyValue");

const formatNumber = (number) =>
    new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0
    }).format(number);

function calculateRainwater(event) {
    event.preventDefault();

    if (!form.reportValidity()) {
        return;
    }

    const area = Number(areaInput.value);
    const rainfall = Number(rainfallInput.value);
    const runoffCoefficient = Number(roofInput.value);
    const efficiency = Number(efficiencyInput.value) / 100;

    if (
        !Number.isFinite(area) || area <= 0 ||
        !Number.isFinite(rainfall) || rainfall <= 0
    ) {
        alert("Please enter a valid positive rooftop area and rainfall.");
        return;
    }

    // 1 mm rainfall over 1 m² = 1 litre
    const theoreticalRainwater = area * rainfall;

    const annualYield =
        theoreticalRainwater *
        runoffCoefficient *
        efficiency;

    const monthlyYield = annualYield / 12;
    const dailyYield = annualYield / 365;

    // Difference between theoretical rainfall and estimated collected yield
    const estimatedLosses = theoreticalRainwater - annualYield;

    document.getElementById("annualYield").textContent =
        formatNumber(annualYield);

    document.getElementById("monthlyYield").textContent =
        formatNumber(monthlyYield);

    document.getElementById("dailyYield").textContent =
        formatNumber(dailyYield);

    document.getElementById("losses").textContent =
        formatNumber(estimatedLosses);

    const impact = document.getElementById("impact");
    const recommendation = document.getElementById("recommendationText");

    if (annualYield >= 50000) {
        impact.textContent = "High Potential";
        recommendation.textContent =
            "Your rooftop may collect a substantial volume of rainwater. " +
            "Consider a suitably designed storage or groundwater recharge system.";
    } else if (annualYield >= 10000) {
        impact.textContent = "Good Potential";
        recommendation.textContent =
            "Your rooftop could support useful water-saving activities. " +
            "Consider using safely collected water for gardening and cleaning.";
    } else {
        impact.textContent = "Start Small";
        recommendation.textContent =
            "Even a smaller rooftop can help conserve water. " +
            "Keep gutters clean and explore a suitable storage solution.";
    }
}

efficiencyInput.addEventListener("input", function () {
    efficiencyValue.textContent = this.value + "%";
});

form.addEventListener("submit", calculateRainwater);

document.getElementById("downloadBtn").addEventListener("click", function () {
    const area = Number(areaInput.value);
    const rainfall = Number(rainfallInput.value);

    if (!form.reportValidity() || area <= 0 || rainfall <= 0) {
        alert("Please enter valid details and calculate your results first.");
        return;
    }

    const runoffCoefficient = Number(roofInput.value);
    const efficiency = Number(efficiencyInput.value) / 100;

    const theoretical = area * rainfall;
    const annual = theoretical * runoffCoefficient * efficiency;

    const summary = `
RAINWISE - RAINWATER HARVESTING CALCULATOR
===========================================

Rooftop Area: ${formatNumber(area)} m²
Annual Rainfall: ${formatNumber(rainfall)} mm
Runoff Coefficient: ${runoffCoefficient}
Collection Efficiency: ${efficiency * 100}%

Estimated Annual Harvest: ${formatNumber(annual)} litres
Monthly Average: ${formatNumber(annual / 12)} litres
Daily Average: ${formatNumber(annual / 365)} litres
Estimated Losses: ${formatNumber(theoretical - annual)} litres

Formula:
Annual Yield = Area × Rainfall × Runoff Coefficient × Efficiency

Note: These are educational estimates. Actual collection depends on
local rainfall, roof conditions, system design, and maintenance.
Rainwater must be treated and tested appropriately before drinking.
`;

    const file = new Blob([summary], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "RainWise-Result-Summary.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
});

// Display a default example when the page first loads
areaInput.value = 100;
rainfallInput.value = 800;
calculateRainwater(new Event("submit"));
