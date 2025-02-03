function calculatePaceZones() {
    let raceTime = document.getElementById("race-time").value;
    let raceDistance = parseFloat(document.getElementById("race-distance").value);

    if (!raceTime || isNaN(raceDistance) || raceDistance <= 0) {
        document.getElementById("results").innerHTML = "<p>Please enter a valid race time and distance.</p>";
        document.getElementById("zone-descriptions").innerHTML = "";
        return;
    }

    let paceInSeconds = convertTimeToSeconds(raceTime) / raceDistance;
    let vdotPaces = calculateVDOTPaces(paceInSeconds);

    let resultsHtml = "<table><tr><th>Zone</th><th>Pace (min/km)</th></tr>";
    for (let zone in vdotPaces) {
        resultsHtml += `<tr class="${vdotPaces[zone].class}"><td>${zone}</td><td>${formatPace(vdotPaces[zone].pace)}</td></tr>`;
    }
    resultsHtml += "</table>";

    let descriptionsHtml = `
        <div class="zone-description"><strong>Zone 1 (Easy Pace):</strong> A relaxed, conversational pace, perfect for recovery runs and building aerobic capacity.</div>
        <div class="zone-description"><strong>Zone 2 (Marathon Pace):</strong> A steady, controlled pace suitable for long-distance race efforts.</div>
        <div class="zone-description"><strong>Zone 3 (Threshold Pace):</strong> Also called tempo pace, this effort is comfortably hard and helps improve lactate threshold.</div>
        <div class="zone-description"><strong>Zone 4 (Interval Pace):</strong> A high-intensity pace used for VO2 max workouts, typically lasting 3-5 minutes per rep.</div>
        <div class="zone-description"><strong>Zone 5 (Repetition Pace):</strong> The fastest training pace, used for short sprints to develop speed and power.</div>
    `;

    document.getElementById("results").innerHTML = resultsHtml;
    document.getElementById("zone-descriptions").innerHTML = descriptionsHtml;
}

function convertTimeToSeconds(timeStr) {
    let parts = timeStr.split(":").map(Number);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function formatPace(secondsPerKm) {
    let minutes = Math.floor(secondsPerKm / 60);
    let seconds = Math.round(secondsPerKm % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} min/km`;
}

function calculateVDOTPaces(basePace) {
    return {
        "Zone 1 (Easy Pace)": { pace: basePace * 1.15, class: "zone1" },
        "Zone 2 (Marathon Pace)": { pace: basePace * 1.05, class: "zone2" },
        "Zone 3 (Threshold Pace)": { pace: basePace * 0.95, class: "zone3" },
        "Zone 4 (Interval Pace)": { pace: basePace * 0.90, class: "zone4" },
        "Zone 5 (Repetition Pace)": { pace: basePace * 0.85, class: "zone5" }
    };
}
