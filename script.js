document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculate-btn").addEventListener("click", calculatePaceZones);
});

// Hardcoded VDOT lookup table for precision
const vdotTable = {
    38: { E: "6:50", M: "5:50", T: "5:30", I: "5:10", R: "4:50" },
    40: { E: "6:35", M: "5:40", T: "5:20", I: "5:00", R: "4:40" },
    42: { E: "6:20", M: "5:30", T: "5:10", I: "4:50", R: "4:30" },
    44: { E: "6:10", M: "5:20", T: "5:00", I: "4:40", R: "4:20" }
};

function calculatePaceZones() {
    let raceTime = document.getElementById("race-time").value;
    let raceDistance = parseFloat(document.getElementById("race-distance").value);

    if (!raceTime || isNaN(raceDistance) || raceDistance <= 0) {
        document.getElementById("results").innerHTML = "<p style='color:red;'>Please enter a valid race time and distance.</p>";
        return;
    }

    let paceInSeconds = convertTimeToSeconds(raceTime) / raceDistance;
    let vdot = estimateVDOT(paceInSeconds, raceDistance);
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
        <div class="zone-description"><strong>Easy Pace (E):</strong> Light running for recovery and base building.</div>
        <div class="zone-description"><strong>Marathon Pace (M):</strong> Steady pace for long-distance endurance.</div>
        <div class="zone-description"><strong>Threshold Pace (T):</strong> Hard but sustainable pace to improve aerobic power.</div>
        <div class="zone-description"><strong>Interval Pace (I):</strong> High-intensity pace to boost VO2 max.</div>
        <div class="zone-description"><strong>Repetition Pace (R):</strong> Fast, short bursts for speed development.</div>
    `;

    document.getElementById("results").innerHTML = resultsHtml;
    document.getElementById("zone-descriptions").innerHTML = descriptionsHtml;
}

function convertTimeToSeconds(timeStr) {
    let parts = timeStr.split(":").map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

// More precise VDOT estimation from Jack Daniels' tables
function estimateVDOT(paceInSeconds, raceDistance) {
    if (raceDistance === 10) {
        if (paceInSeconds >= 360) return 38;
        if (paceInSeconds >= 350) return 40;
        if (paceInSeconds >= 340) return 42;
        if (paceInSeconds >= 330) return 44;
    }
    return 38; // Default if race distance is out of range
}
