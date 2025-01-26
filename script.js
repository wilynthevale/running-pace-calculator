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

function calculateVDOT(distance, time) {
  // Coefficients for polynomial regression (example for 5K)
  const coefficients = {
    '5K': { a: -0.0002, b: 0.0226, c: -1.083, d: 47.77 },
    '10K': { a: -0.0001, b: 0.0128, c: -0.732, d: 45.12 },
    'Half Marathon': { a: -0.0001, b: 0.0096, c: -0.584, d: 43.45 },
    'Marathon': { a: -0.0001, b: 0.0078, c: -0.492, d: 42.16 },
  };

  const { a, b, c, d } = coefficients[distance] || { a: 0, b: 0, c: 0, d: 0 };
  const vdot = a * Math.pow(time, 3) + b * Math.pow(time, 2) + c * time + d;

  return Math.round(vdot * 100) / 100; // Round to 2 decimal places
}

function calculateTrainingPaces(vdot) {
  const zones = [
    { name: 'Easy (E)', min: 0.59, max: 0.74, description: 'Recovery and long runs.' },
    { name: 'Marathon (M)', min: 0.75, max: 0.84, description: 'Marathon pace training.' },
    { name: 'Threshold (T)', min: 0.83, max: 0.88, description: 'Tempo runs and lactate threshold.' },
    { name: 'Interval (I)', min: 0.95, max: 1.0, description: 'VO2 max and interval training.' },
