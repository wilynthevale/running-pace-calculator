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

    console.log("Estimated VDOT:", vdot);

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
        "5K": { 20: "42:24", 25: "35:31", 30: "30:40", 32: "29:05", 34: "27:39", 36: "26:22", 38: "25:17", 40: "24:08", 42: "23:09", 44: "21:56", 46: "21:25", 47: "21:02", 48: "20:39", 49: "20:18", 50: "19:57", 51: "19:37", 52: "19:17", 53: "18:58", 54: "18:40", 55: "18:22", 56: "18:05", 57: "17:49", 58: "17:33", 59: "17:17", 60: "17:03", 61: "16:48", 62: "16:34", 63: "16:21", 64: "16:07", 65: "15:53", 66: "15:42", 67: "15:29", 68: "15:16", 69: "15:03", 70: "14:50", 71: "14:44", 72: "14:33", 73: "14:23", 74: "14:13", 75: "14:03", 76: "13:53", 77: "13:44", 78: "13:26", 79: "13:16", 80: "13:07", 81: "12:59", 82: "12:51", 83: "12:47", 85: "12:37" },
        "10K": { 20: "1:29:00", 25: "1:14:10", 30: "63:46", 32: "60:26", 34: "57:26", 36: "54:44", 38: "52:17", 40: "50:03", 42: "48:01", 44: "46:09", 46: "44:15", 47: "43:06", 48: "42:13", 49: "41:24", 50: "40:39", 51: "39:50", 52: "39:05", 53: "38:20", 54: "37:36", 55: "37:06", 56: "36:31", 57: "36:00", 58: "35:24", 59: "35:00", 60: "35:22", 61: "34:52", 62: "34:23", 63: "34:05", 64: "33:45", 65: "33:21", 66: "32:35", 67: "31:59", 68: "31:14", 69: "30:32", 70: "29:48", 71: "29:20", 72: "28:55", 73: "28:30", 74: "28:06", 75: "27:43", 76: "27:20", 77: "26:58", 78: "26:37", 79: "26:19", 80: "26:00", 81: "25:42", 82: "25:24", 83: "25:10", 85: "24:56" },
        "Half": { 20: "3:13:29", 25: "2:43:00", 30: "2:21:04", 32: "2:13:49", 34: "2:07:16", 36: "2:01:19", 38: "1:55:55", 40: "1:50:59", 42: "1:46:27", 44: "1:42:17", 46: "1:38:37", 47: "1:36:38", 48: "1:34:53", 49: "1:33:12", 50: "1:31:33", 51: "1:30:02", 52: "1:28:31", 53: "1:27:08", 54: "1:25:40", 55: "1:24:18", 56: "1:23:00", 57: "1:21:48", 58: "1:20:35", 59: "1:19:30", 60: "1:18:09", 61: "1:17:02", 62: "1:15:57", 63: "1:14:54", 64: "1:13:52", 65: "1:12:53", 66: "1:11:56", 67: "1:11:00", 68: "1:10:05", 69: "1:09:12", 70: "1:08:19", 71: "1:07:31", 72: "1:06:42", 73: "1:05:54", 74: "1:05:06", 75: "1:04:18", 76: "1:03:39", 77: "1:03:03", 78: "1:02:27", 79: "1:01:54", 80: "1:01:34", 81: "1:01:05", 82: "1:00:37", 83: "1:00:11", 85: "59:50" },
        "Marathon": { 20: "6:31:59", 25: "5:32:15", 30: "4:49:17", 32: "4:34:59", 34: "4:22:03", 36: "4:10:19", 38: "3:59:35", 40: "3:49:45", 42: "3:40:43", 44: "3:32:23", 46: "3:24:39", 47: "3:21:00", 48: "3:17:29", 49: "3:14:06", 50: "3:10:47", 51: "3:07:39", 52: "3:04:36", 53: "3:01:45", 54: "2:58:47", 55: "2:56:01", 56: "2:53:16", 57: "2:50:47", 58: "2:48:27", 59: "2:46:05", 60: "2:43:23", 61: "2:41:08", 62: "2:38:54", 63: "2:36:43", 64: "2:34:38", 65: "2:32:35", 66: "2:30:36", 67: "2:28:40", 68: "2:26:47", 69: "2:24:57", 70: "2:23:10", 71: "2:21:26", 72: "2:19:44", 73: "2:18:05", 74: "2:16:29", 75: "2:14:55", 76: "2:13:23", 77: "2:11:53", 78: "2:10:25", 79: "2:09:02", 80: "2:07:38", 81: "2:06:17", 82: "2:04:57", 83: "2:03:40", 85: "2:01:10" }
    };

    if (!(raceDistance in raceTimes)) {
        console.error("Race distance not found in table");
        return null;
    }

    let raceTimeSec = convertTimeToSeconds(raceTime);
    if (!raceTimeSec) {
        console.error("Invalid race time format");
        return null;
    }

    const distanceTimes = raceTimes[raceDistance];
    let vdotValues = Object.keys(distanceTimes).map(Number).sort((a, b) => a - b);

    let minVDOT = vdotValues[0];
    let maxVDOT = vdotValues[vdotValues.length - 1];

    let minTime = convertTimeToSeconds(distanceTimes[minVDOT]);
    let maxTime = convertTimeToSeconds(distanceTimes[maxVDOT]);

    // If race time is slower than the lowest VDOT entry, return min VDOT
    if (raceTimeSec >= minTime) return minVDOT;
    // If race time is faster than the highest VDOT entry, return max VDOT
    if (raceTimeSec <= maxTime) return maxVDOT;

    // Find the closest two VDOT values for interpolation
    let lowerVdot = null, upperVdot = null;
    for (let i = 0; i < vdotValues.length - 1; i++) {
        let timeLower = convertTimeToSeconds(distanceTimes[vdotValues[i]]);
        let timeUpper = convertTimeToSeconds(distanceTimes[vdotValues[i + 1]]);

        if (raceTimeSec <= timeLower && raceTimeSec >= timeUpper) {
            lowerVdot = vdotValues[i];
            upperVdot = vdotValues[i + 1];
            break;
        }
    }

    // If we couldn't find a valid range, return null (shouldn't happen)
    if (lowerVdot === null || upperVdot === null) {
        console.error("No valid VDOT range found for interpolation");
        return null;
    }

    let lowerTime = convertTimeToSeconds(distanceTimes[lowerVdot]);
    let upperTime = convertTimeToSeconds(distanceTimes[upperVdot]);

    // Linear interpolation
    let interpolatedVdot = lowerVdot + ((raceTimeSec - lowerTime) / (upperTime - lowerTime)) * (upperVdot - lowerVdot);

    // Ensure the interpolated VDOT is within bounds
    interpolatedVdot = Math.max(minVDOT, Math.min(maxVDOT, interpolatedVdot));

    return Math.round(interpolatedVdot);
}
