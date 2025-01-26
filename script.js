document.getElementById('calculator').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get inputs
  const raceDistance = document.getElementById('raceDistance').value;
  const raceTime = parseFloat(document.getElementById('raceTime').value);

  // Validate inputs
  if (!raceDistance || isNaN(raceTime) || raceTime <= 0) {
    alert('Please enter valid race details.');
    return;
  }

  // Calculate VDOT
  const vdot = calculateVDOT(raceDistance, raceTime);

  // Calculate Training Paces
  const trainingPaces = calculateTrainingPaces(vdot);

  // Display Results
  displayResults(vdot, trainingPaces);
});

// VDOT Lookup Table
const vdotTable = {
  '5K': [
    { time: 14, vdot: 85 },
    { time: 16, vdot: 75 },
    { time: 18, vdot: 65 },
    { time: 20, vdot: 55 },
    { time: 22, vdot: 45 },
    { time: 24, vdot: 35 },
  ],
  '10K': [
    { time: 30, vdot: 85 },
    { time: 35, vdot: 75 },
    { time: 40, vdot: 65 },
    { time: 45, vdot: 55 },
    { time: 50, vdot: 45 },
    { time: 55, vdot: 35 },
  ],
  'Half Marathon': [
    { time: 65, vdot: 85 },
    { time: 75, vdot: 75 },
    { time: 85, vdot: 65 },
    { time: 95, vdot: 55 },
    { time: 105, vdot: 45 },
    { time: 115, vdot: 35 },
  ],
  'Marathon': [
    { time: 140, vdot: 85 },
    { time: 160, vdot: 75 },
    { time: 180, vdot: 65 },
    { time: 200, vdot: 55 },
    { time: 220, vdot: 45 },
    { time: 240, vdot: 35 },
  ],
};

function calculateVDOT(distance, time) {
  const table = vdotTable[distance];
  if (!table) return null;

  // Find the closest lower and higher times
  let lower = null;
  let higher = null;

  for (const entry of table) {
    if (entry.time <= time) {
      lower = entry;
    } else {
      higher = entry;
      break;
    }
  }

  // If time is outside the table range, return the closest VDOT
  if (!lower) return table[0].vdot;
  if (!higher) return table[table.length - 1].vdot;

  // Interpolate VDOT
  const vdot = lower.vdot + ((time - lower.time) / (higher.time - lower.time)) * (higher.vdot - lower.v
