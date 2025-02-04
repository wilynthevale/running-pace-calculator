document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculate-btn").addEventListener("click", calculatePaceZones);
});

// More precise VDOT lookup table from Jack Daniels' Table 2
const vdotTable = {
    30: { E: "7:40", M: "6:40", T: "6:20", I: "6:00", R: "5:40" },
    35: { E: "7:10", M: "6:10", T: "5:50", I: "5:30", R: "5:10" },
    40: { E: "6:35", M: "5:40", T: "5:20", I: "5:00", R: "4:40" },
    45: { E: "6:00", M: "5:20", T: "5:00", I: "4:40", R: "4:20" },
    50: { E: "5:40", M: "5:00", T: "4:40", I: "4:20", R: "4:00" },
    55: { E: "5:20", M: "4:40", T: "4:20", I: "4:00", R: "3:40" },
    60: { E: "5:00", M: "4:30", T: "4:10", I: "3:50", R: "3:30" },
    65: { E: "4:50", M: "4:20", T: "4:00", I: "3:40", R: "3:20" },
    70: { E: "4:40", M: "4:10", T: "3:50", I: "3:30", R: "3:10" },
    75: { E: "4:30", M: "4:00", T: "3:40", I: "3:20", R: "3:00" },
    80: { E: "4:20", M: "3:50", T: "3:30", I: "3:10", R: "2:50" },
    85: { E: "4:10", M: "3:40", T: "3:20", I: "3:00", R: "2:40" }
};

function calculatePaceZones() {
    let raceTime = document.getElementById("race-time").value;
    let raceDistance = document.getElementById("race-distance").value;

    if (!raceTime || !raceDistance) {
        document.getElementById("results").innerHTML = "<p style='color:red;'>Please enter a valid race time and select a race distance.</p>";
        return;
    }

    let vdot = estimateVDOT(raceTime, raceDistance);
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

// Convert race time from "HH:MM:SS" or "MM:SS" to total seconds
function convertTimeToSeconds(timeStr) {
    let parts = timeStr.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return null;
}

// More precise VDOT estimation using race time lookup from Table 1
function estimateVDOT(raceTime, raceDistance) {
    const raceTimes = {
        "5K": { 30: "30:40", 35: "27:39", 40: "24:08", 45: "21:56", 50: "19:57", 55: "18:22", 60: "17:03", 65: "15:53", 70: "14:50", 75: "14:03", 80: "13:07", 85: "12:37" },
        "10K": { 30: "63:46", 35: "57:26", 40: "50:03", 45: "44:15", 50: "40:39", 55: "37:06", 60: "34:52", 65: "32:35", 70: "29:48", 75: "27:43", 80: "26:00", 85: "24:56" },
        "Half": { 30: "2:21:04", 35: "2:07:16", 40: "1:50:59", 45: "1:38:37", 50: "1:31:33", 55: "1:24:18", 60: "1:17:02", 65: "1:11:00", 70: "1:08:19", 75: "1:04:18", 80: "1:01:34", 85: "59:50" },
        "Marathon": { 30: "4:49:17", 35: "4:22:03", 40: "3:49:45", 45: "3:24:39", 50: "3:10:47", 55: "2:56:01", 60: "2:41:08", 65: "2:32:35", 70: "2:23:10", 75: "2:14:55", 80: "2:07:38", 85: "2:01:10" }
    };

    if (!(raceDistance in raceTimes)) return null;

    let raceTimeSec = convertTimeToSeconds(raceTime);
    if (!raceTimeSec) return null;

    let vdotKeys = Object.keys(raceTimes[raceDistance]).map(Number);
    let lowerVDOT = null, upperVDOT = null;

    for (let i = 0; i < vdotKeys.length - 1; i++) {
        let v1 = vdotKeys[i];
        let v2 = vdotKeys[i + 1];

        let t1 = convertTimeToSeconds(raceTimes[raceDistance][v1]);
        let t2 = convertTimeToSeconds(raceTimes[raceDistance][v2]);

        if (raceTimeSec >= t1 && raceTimeSec <= t2) {
            lowerVDOT = v1;
            upperVDOT = v2;
            break;
        }
    }

    if (lowerVDOT === null || upperVDOT === null) return null; // Outside range

    let t1 = convertTimeToSeconds(raceTimes[raceDistance][lowerVDOT]);
    let t2 = convertTimeToSeconds(raceTimes[raceDistance][upperVDOT]);

    let interpolatedVDOT = lowerVDOT + (upperVDOT - lowerVDOT) * ((raceTimeSec - t1) / (t2 - t1));
    return Math.round(interpolatedVDOT);
}
