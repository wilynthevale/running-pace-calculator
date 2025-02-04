document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculate-btn").addEventListener("click", calculatePaceZones);
});

// More precise VDOT lookup table from Jack Daniels' Table 2
const vdotTable = {
    20: { E1: "8:23", E2: "9:09", M: "9:16", T: "7:47", I: "6:32", R: "6:17" },
    25: { E1: "7:41", E2: "8:24", M: "7:52", T: "6:52", I: "5:57", R: "5:42" },    
    30: { E1: "7:06", E2: "7:46", M: "6:51", T: "6:10", I: "5:29", R: "5:14" },    
    35: { E1: "6:35", E2: "7:14", M: "6:04", T: "5:35", I: "5:04", R: "4:49" },    
    40: { E1: "6:07", E2: "6:43", M: "5:27", T: "5:06", I: "4:42", R: "4:27" },    
    45: { E1: "5:35", E2: "6:08", M: "4:57", T: "4:39", I: "4:17", R: "4:02" },    
    50: { E1: "5:07", E2: "5:38", M: "4:31", T: "4:15", I: "3:55", R: "3:40" },    
    55: { E1: "4:45", E2: "5:14", M: "4:11", T: "3:57", I: "3:38", R: "3:23" },    
    60: { E1: "4:25", E2: "4:52", M: "3:52", T: "3:40", I: "3:22", R: "3:07" },    
    65: { E1: "4:08", E2: "4:34", M: "3:37", T: "3:26", I: "3:10", R: "2:55" },
    70: { E1: "3:54", E2: "4:18", M: "3:23", T: "3:14", I: "2:59", R: "2:44" },
    75: { E1: "3:42", E2: "4:05", M: "3:12", T: "3:04", I: "2:50", R: "2:35" },
    80: { E1: "3:30", E2: "3:51", M: "3:01", T: "2:54", I: "2:40", R: "2:25" },
    85: { E1: "3:20", E2: "3:41", M: "2:52", T: "2:46", I: "2:33", R: "2:18" }
};

function calculatePaceZones() {
    let raceTime = document.getElementById("race-time").value;
    let raceDistance = document.getElementById("race-distance").value;

    if (!raceTime || !raceDistance) {
        document.getElementById("results").innerHTML = "<p style='color:red;'>Please enter a valid race time and select a race distance.</p>";
        return;
    }

    let vdot = estimateVDOT(raceTime, raceDistance);
    if (vdot < 20 || vdot > 85) {
        document.getElementById("results").innerHTML = `<p style='color:red;'>VDOT value out of range.</p>`;
        return;
    }

    let lowerVDOT = Math.floor(vdot/5)*5;
    let upperVDOT = Math.ceil(vdot/5)*5;
/*
    let paces;
    if (lowerVDOT === upperVDOT) {
        paces = vdotTable[lowerVDOT];
    } else {
        paces = interpolatePaces(lowerVDOT, upperVDOT, vdot);
    }*/

document.getElementById("results").innerHTML = `<p style='color:red;'>VDOT here.</p>`;
        return
    
    let resultsHtml = "<table><tr><th>Zone</th><th>Pace (min/km)</th></tr>";
    resultsHtml += `<tr class="zone1"><td>Easy Pace (E)</td><td>${paces.E1}~${paces.E2}</td></tr>`;
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

function interpolatePaces(lowerVDOT, upperVDOT, vdot) {
    function interpolate(time1, time2, factor) {
        let [min1, sec1] = time1.split(":").map(Number);
        let [min2, sec2] = time2.split(":").map(Number);

        let totalSec1 = min1 * 60 + sec1;
        let totalSec2 = min2 * 60 + sec2;

        let interpolatedSec = totalSec1 + (totalSec2 - totalSec1) * factor;
        let newMin = Math.floor(interpolatedSec / 60);
        let newSec = Math.round(interpolatedSec % 60);

        return `${newMin}:${newSec.toString().padStart(2, "0")}`;
    }

    let factor = (vdot - lowerVDOT) / (upperVDOT - lowerVDOT);
    let lowerPaces = vdotTable[lowerVDOT];
    let upperPaces = vdotTable[upperVDOT];

    return {
        E1: interpolate(lowerPaces.E1, upperPaces.E1, factor),
        E2: interpolate(lowerPaces.E2, upperPaces.E2, factor),
        M: interpolate(lowerPaces.M, upperPaces.M, factor),
        T: interpolate(lowerPaces.T, upperPaces.T, factor),
        I: interpolate(lowerPaces.I, upperPaces.I, factor),
        R: interpolate(lowerPaces.R, upperPaces.R, factor)
    };
}

// More precise VDOT estimation using race time lookup from Table 1
function estimateVDOT(raceTime, raceDistance) {
    const raceTimes = {
        "5K": { 20: "42:24", 25: "35:31", 30: "30:40", 32: "29:05", 34: "27:39", 36: "26:22", 38: "25:17", 40: "24:08", 42: "23:09", 44: "21:56", 46: "21:25", 47: "21:02", 48: "20:39", 49: "20:18", 50: "19:57", 51: "19:37", 52: "19:17", 53: "18:58", 54: "18:40", 55: "18:22", 56: "18:05", 57: "17:49", 58: "17:33", 59: "17:17", 60: "17:03", 61: "16:48", 62: "16:34", 63: "16:21", 64: "16:07", 65: "15:53", 66: "15:42", 67: "15:29", 68: "15:16", 69: "15:03", 70: "14:50", 71: "14:44", 72: "14:33", 73: "14:23", 74: "14:13", 75: "14:03", 76: "13:53", 77: "13:44", 78: "13:26", 79: "13:16", 80: "13:07", 81: "12:59", 82: "12:51", 83: "12:47", 85: "12:37" },
        "10K": { 20: "1:29:00", 25: "1:14:10", 30: "63:46", 32: "60:26", 34: "57:26", 36: "54:44", 38: "52:17", 40: "50:03", 42: "48:01", 44: "46:09", 46: "44:15", 47: "43:06", 48: "42:13", 49: "41:24", 50: "40:39", 51: "39:50", 52: "39:05", 53: "38:20", 54: "37:36", 55: "37:06", 56: "36:31", 57: "36:00", 58: "35:24", 59: "35:00", 60: "35:22", 61: "34:52", 62: "34:23", 63: "34:05", 64: "33:45", 65: "33:21", 66: "32:35", 67: "31:59", 68: "31:14", 69: "30:32", 70: "29:48", 71: "29:20", 72: "28:55", 73: "28:30", 74: "28:06", 75: "27:43", 76: "27:20", 77: "26:58", 78: "26:37", 79: "26:19", 80: "26:00", 81: "25:42", 82: "25:24", 83: "25:10", 85: "24:56" },
        "Half": { 20: "3:13:29", 25: "2:43:00", 30: "2:21:04", 32: "2:13:49", 34: "2:07:16", 36: "2:01:19", 38: "1:55:55", 40: "1:50:59", 42: "1:46:27", 44: "1:42:17", 46: "1:38:37", 47: "1:36:38", 48: "1:34:53", 49: "1:33:12", 50: "1:31:33", 51: "1:30:02", 52: "1:28:31", 53: "1:27:08", 54: "1:25:40", 55: "1:24:18", 56: "1:23:00", 57: "1:21:48", 58: "1:20:35", 59: "1:19:30", 60: "1:18:09", 61: "1:17:02", 62: "1:15:57", 63: "1:14:54", 64: "1:13:52", 65: "1:12:53", 66: "1:11:56", 67: "1:11:00", 68: "1:10:05", 69: "1:09:12", 70: "1:08:19", 71: "1:07:31", 72: "1:06:42", 73: "1:05:54", 74: "1:05:06", 75: "1:04:18", 76: "1:03:39", 77: "1:03:03", 78: "1:02:27", 79: "1:01:54", 80: "1:01:34", 81: "1:01:05", 82: "1:00:37", 83: "1:00:11", 85: "59:50" },
        "Marathon": { 20: "6:31:59", 25: "5:32:15", 30: "4:49:17", 32: "4:34:59", 34: "4:22:03", 36: "4:10:19", 38: "3:59:35", 40: "3:49:45", 42: "3:40:43", 44: "3:32:23", 46: "3:24:39", 47: "3:21:00", 48: "3:17:29", 49: "3:14:06", 50: "3:10:47", 51: "3:07:39", 52: "3:04:36", 53: "3:01:45", 54: "2:58:47", 55: "2:56:01", 56: "2:53:16", 57: "2:50:47", 58: "2:48:27", 59: "2:46:05", 60: "2:43:23", 61: "2:41:08", 62: "2:38:54", 63: "2:36:43", 64: "2:34:38", 65: "2:32:35", 66: "2:30:36", 67: "2:28:40", 68: "2:26:47", 69: "2:24:57", 70: "2:23:10", 71: "2:21:26", 72: "2:19:44", 73: "2:18:05", 74: "2:16:29", 75: "2:14:55", 76: "2:13:23", 77: "2:11:53", 78: "2:10:25", 79: "2:09:02", 80: "2:07:38", 81: "2:06:17", 82: "2:04:57", 83: "2:03:40", 85: "2:01:10" }
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
