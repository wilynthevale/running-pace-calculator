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
        "5K": {
            20: "42:24", 25: "35:31", 30: "30:40", 35: "27:39", 40: "24:08", 45: "21:25", 
            50: "19:57", 55: "18:22", 60: "17:03", 65: "15:53", 70: "14:50", 
            75: "14:03", 80: "13:07", 85: "12:37"
        }
    };

    console.log("Race Distance:", raceDistance);
    console.log("Race Time (Input):", raceTime);

    if (!(raceDistance in raceTimes)) {
        console.error("Error: Race distance not found in table.");
        return null;
    }

    let raceTimeSec = convertTimeToSeconds(raceTime);
    console.log("Race Time (Seconds):", raceTimeSec);

    if (!raceTimeSec) {
        console.error("Error: Invalid race time format.");
        return null;
    }

    const distanceTimes = raceTimes[raceDistance];
    let vdotValues = Object.keys(distanceTimes).map(Number).sort((a, b) => a - b);

    let minVDOT = vdotValues[0];
    let maxVDOT = vdotValues[vdotValues.length - 1];

    let minTime = convertTimeToSeconds(distanceTimes[minVDOT]);
    let maxTime = convertTimeToSeconds(distanceTimes[maxVDOT]);

    console.log("VDOT Range:", minVDOT, "to", maxVDOT);
    console.log("Time Range (Seconds):", minTime, "to", maxTime);

    // If race time is slower than the lowest VDOT entry, return min VDOT
    if (raceTimeSec >= minTime) {
        console.warn("Warning: Race time slower than table range. Returning min VDOT:", minVDOT);
        return minVDOT;
    }
    
    // If race time is faster than the highest VDOT entry, return max VDOT
    if (raceTimeSec <= maxTime) {
        console.warn("Warning: Race time faster than table range. Returning max VDOT:", maxVDOT);
        return maxVDOT;
    }

    // Find the closest two VDOT values for interpolation
    let lowerVdot = null, upperVdot = null;
    for (let i = 0; i < vdotValues.length - 1; i++) {
        let timeLower = convertTimeToSeconds(distanceTimes[vdotValues[i]]);
        let timeUpper = convertTimeToSeconds(distanceTimes[vdotValues[i + 1]]);

        if (raceTimeSec <= timeLower && raceTimeSec >= timeUpper) {
            lowerVdot = vdotValues[i];
            upperVdot = vdotValues[i + 1];
            console.log("Interpolating between VDOT:", lowerVdot, "and", upperVdot);
            break;
        }
    }

    // If no valid range is found, return null (shouldn't happen now)
    if (lowerVdot === null || upperVdot === null) {
        console.error("Error: No valid VDOT range found for interpolation.");
        return null;
    }

    let lowerTime = convertTimeToSeconds(distanceTimes[lowerVdot]);
    let upperTime = convertTimeToSeconds(distanceTimes[upperVdot]);

    // Linear interpolation
    let interpolatedVdot = lowerVdot + ((raceTimeSec - lowerTime) / (upperTime - lowerTime)) * (upperVdot - lowerVdot);

    // Ensure interpolated VDOT is within bounds
    interpolatedVdot = Math.max(minVDOT, Math.min(maxVDOT, interpolatedVdot));

    console.log("Interpolated VDOT:", interpolatedVdot);

    return Math.round(interpolatedVdot);
}
