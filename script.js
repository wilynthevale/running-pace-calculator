document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculate-btn").addEventListener("click", calculatePaceZones);
});

// Hardcoded VDOT lookup table (example values)
const vdotTable = {
    50: { E: "5:40", M: "4:50", T: "4:30", I: "4:10", R: "3:50" },
    55: { E: "5:20", M: "4:30", T: "4:10", I: "3:50", R: "3:30" },
    60: { E: "5:00", M: "4:10", T: "3:50", I: "3:30", R: "3:10" },
    65: { E: "4:40", M: "3:55", T: "3:35", I: "3:15", R: "2:55" }
};

function calculatePaceZones() {
    let raceTime = document.getElementById("race-time").value;
    let raceDistance = parseFloat(document.getElementById("race-distance").value);

    if (!raceTime || isNaN(raceDistance) || raceDistance <= 0) {
        document.getElementById("results").innerHTML = "<p style='color:red;'>Please enter a valid race time and distance.</p>";
        return;
    }

    let paceInSeconds = convertTimeToSeconds(raceTime) / raceDistance;
    let vdot = estimateVDOT(paceInSeconds);
    let paces = vdotTable[vdot];

    if (!paces) {
        document.getElementById("results").innerHTML = `<p style='color:red;'>VDOT value out of range.</p>`;
        return;
    }

    let resultsHtml = "<table><tr><th>Zone</th><th>Pace (min/km)</th></tr>";
    resultsHtml += `<tr class="zone1"><td>Easy Pace (E)</td><td>${paces.E}</td></tr>`;
    resultsHtml += `<tr class="zone2"><td>Marathon Pace (M)</td><td>${paces.M}</td></tr>`;
    resultsHtml += `<tr class="zone3"><td>Threshold Pace (T)</td><td>${paces.T}</td></tr>`;
    resultsHtml += `<tr class="zone4"><td>Interval Pace (I)</td><td>${paces.I}</td></tr>`;
    resultsHtml += `<tr class="zone5"><td>Repetition Pace (R)</td><td>${paces.R}</td></tr>`;
    resultsHtml += "</table>";

    let descriptionsHtml = `
        <div class="zone-description"><strong>Easy Pace (E):</strong> Comfortable running pace for recovery and base building.</div>
        <div class="zone-description"><strong>Marathon Pace (M):</strong> Steady pace for marathon race effort.</div>
        <div class="zone-description"><strong>Threshold Pace (T):</strong> Hard but sustainable pace to improve endurance.</div>
        <div class="zone-description"><strong>Interval Pace (I):</strong> High-intensity pace to boost aerobic capacity.</div>
        <div class="zone-description"><strong>Repetition Pace (R):</strong> Very fast pace for short, high-intensity efforts.</div>
    `;

    document.getElementById("results").innerHTML = resultsHtml;
    document.getElementById("zone-descriptions").innerHTML = descriptionsHtml;
}

function convertTimeToSeconds(timeStr) {
    let parts = timeStr.split(":").map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function estimateVDOT(pace) {
    if (pace >= 280) return 50;
    if (pace >= 250) return 55;
    if (pace >= 220) return 60;
    if (pace >= 190) return 65;
    return 50; // Default if out of range
}
