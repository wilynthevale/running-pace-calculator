document.getElementById('calculator').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get inputs
  const maxHR = parseFloat(document.getElementById('maxHR').value);
  const restingHR = parseFloat(document.getElementById('restingHR').value) || 0;
  const thresholdPace = parseFloat(document.getElementById('thresholdPace').value);

  // Calculate Heart Rate Zones
  const hrZones = calculateHRZones(maxHR, restingHR);

  // Calculate Pace Zones
  const paceZones = calculatePaceZones(thresholdPace);

  // Display Results
  displayResults(hrZones, paceZones);
});

function calculateHRZones(maxHR, restingHR) {
  const zones = [
    { name: 'Easy', min: 0.5, max: 0.6 },
    { name: 'Aerobic', min: 0.6, max: 0.7 },
    { name: 'Threshold', min: 0.7, max: 0.8 },
    { name: 'VO2 Max', min: 0.8, max: 0.9 },
    { name: 'Anaerobic', min: 0.9, max: 1.0 },
  ];

  return zones.map(zone => ({
    name: zone.name,
    min: Math.round((maxHR - restingHR) * zone.min + restingHR),
    max: Math.round((maxHR - restingHR) * zone.max + restingHR),
  }));
}

function calculatePaceZones(thresholdPace) {
  if (!thresholdPace) return null;

  const zones = [
    { name: 'Easy', min: 1.1, max: 1.25 },
    { name: 'Aerobic', min: 1.05, max: 1.1 },
    { name: 'Threshold', min: 0.95, max: 1.05 },
    { name: 'VO2 Max', min: 0.85, max: 0.95 },
    { name: 'Anaerobic', min: 0.75, max: 0.85 },
  ];

  return zones.map(zone => ({
    name: zone.name,
    min: (thresholdPace * zone.max).toFixed(2),
    max: (thresholdPace * zone.min).toFixed(2),
  }));
}

function displayResults(hrZones, paceZones) {
  let resultsHTML = '<h2>Heart Rate Zones</h2>';
  resultsHTML += '<table><tr><th>Zone</th><th>Min HR</th><th>Max HR</th></tr>';
  hrZones.forEach(zone => {
    resultsHTML += `<tr><td>${zone.name}</td><td>${zone.min}</td><td>${zone.max}</td></tr>`;
  });
  resultsHTML += '</table>';

  if (paceZones) {
    resultsHTML += '<h2>Pace Zones</h2>';
    resultsHTML += '<table><tr><th>Zone</th><th>Min Pace</th><th>Max Pace</th></tr>';
    paceZones.forEach(zone => {
      resultsHTML += `<tr><td>${zone.name}</td><td>${zone.min}</td><td>${zone.max}</td></tr>`;
    });
    resultsHTML += '</table>';
  }

  document.getElementById('results').innerHTML = resultsHTML;
}
