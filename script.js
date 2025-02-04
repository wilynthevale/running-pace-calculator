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

    if (!raceTime || isNaN(parseFloat(raceDistance)) || raceDistance <= 0) {
        document.getElementById("results").innerHTML = "<p style='color:red;'>Please enter a valid race time and distance.</p>";
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
    return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] :
           parts.length === 2 ? parts[0] * 60 + parts[1] : null;
}

// More precise VDOT estimation using race time
function estimateVDOT(raceTime, raceDistance) {
    const raceTimes = {
        "5K": { 30: "26:50", 35: "24:44", 40: "23:06", 45: "21:42", 50: "20:30", 55: "19:27", 60: "18:34", 65: "17:49", 70: "17:06", 75: "16:31", 80: "16:00", 85: "15:32" },
        "10K": { 30: "56:39", 35: "51:27", 40: "47:46", 45: "44:46", 50: "42:15", 55: "40:05", 60: "38:09", 65: "36:26", 70: "34:55", 75: "33:33", 80: "32:18", 85: "31:11" },
        "Half": { 30: "122:48", 35: "110:58", 40: "101:45", 45: "94:07", 50: "87:42", 55: "82:09", 60: "77:23", 65: "73:14", 70: "69:36", 75: "66:26", 80: "63:34", 85: "60:58" },
        "Marathon": { 30: "257:06", 35: "230:18", 40: "209:28", 45: "192:51", 50: "179:01", 55: "167:16", 60: "157:07", 65: "148:26", 70: "140:50", 75: "134:14", 80: "128:26", 85: "123:25" }
    };

    if (!(raceDistance in raceTimes)) return null;

    let raceTimeSec = convertTimeToSeconds(raceTime);
    if (!raceTimeSec) return null;

    let bestMatch = null;
    for (let vdot in raceTimes[raceDistance]) {
        let vdotTimeSec = convertTimeToSeconds(raceTimes[raceDistance][vdot]);
        if (!vdotTimeSec) continue;
        if (!bestMatch || Math.abs(vdotTimeSec - raceTimeSec) < Math.abs(convertTimeToSeconds(raceTimes[raceDistance][bestMatch]) - raceTimeSec)) {
            bestMatch = vdot;
        }
    }
    return bestMatch ? parseInt(bestMatch) : null;
}
