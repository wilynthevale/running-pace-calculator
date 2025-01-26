document.getElementById('calculator').addEventListener('submit', function (e) {
  e.preventDefault();

  // Get inputs
  const vdotPace = parseFloat(document.getElementById('vdotPace').value);

  // Calculate Training Paces
  const trainingPaces = calculateTrainingPaces(vdotPace);

  // Display Results
  displayResults(trainingPaces);
});

function calculateTrainingPaces(vdotPace) {
  const zones = [
    { name: 'Easy (E)', min: 0.59, max: 0.74 },
    { name: 'Marathon (M)', min: 0.75, max: 0.84 },
    { name: 'Threshold (T)', min: 0.83, max: 0.88 },
    { name: 'Interval (I)', min: 0.95, max: 1.0 },
    { name: 'Repetition (R)', min: 1.05, max: 1.1 },
  ];

  return zones.map(zone => ({
    name: zone.name,
    min: (vdotPace / zone.max).toFixed(2),
    max: (vdotPace / zone.min).toFixed(2),
  }));
}

function displayResults(trainingPaces) {
  let resultsHTML = '<h2>Training Paces (Jack Daniels)</h2>';
  resultsHTML += '<table><tr><th>Zone</th><th>Min Pace</th><th>Max Pace</th></tr>';
  trainingPaces.forEach(zone => {
    resultsHTML += `<tr><td>${zone.name}</td><td>${zone.min}</td><td>${zone.max}</td></tr>`;
  });
  resultsHTML += '</table>';

  document.getElementById('results').innerHTML = resultsHTML;
}
