/**
 * Deterministic analysis engine based on normal reference ranges.
 */

const REFERENCE_RANGES = {
  hemoglobin: { min: 12.0, max: 17.5, unit: 'g/dL', name: 'Hemoglobin' },
  wbc: { min: 4000, max: 11000, unit: '/µL', name: 'WBC' },
  platelets: { min: 150000, max: 450000, unit: '/µL', name: 'Platelets' },
  rbc: { min: 4.5, max: 5.5, unit: 'million/µL', name: 'RBC' },
  hematocrit: { min: 36, max: 54, unit: '%', name: 'Hematocrit' },
  mcv: { min: 80, max: 100, unit: 'fL', name: 'MCV' }
};

export function analyzeCBC(parsedData) {
  const parameters = [];
  let abnormalCount = 0;
  let criticalCount = 0;
  let overallRisk = "LOW";

  const analyzeParam = (key, val) => {
    if (val === null || val === undefined) return;
    
    // Some OCR values might be in thousands e.g. WBC 13.0 instead of 13000
    // Try to normalize WBC and Platelets if they appear as short forms
    let normalizedVal = val;
    if (key === 'wbc' && val < 50 && val > 0.1) {
      normalizedVal = val * 1000;
    }
    if (key === 'platelets' && val < 1000 && val > 10) {
       // Values like 150 meaning 150,000
       normalizedVal = val * 1000;
    }

    const { min, max, unit, name } = REFERENCE_RANGES[key];
    
    let status = 'normal';
    let severity = 'low';

    if (normalizedVal < min) {
      status = 'low';
      abnormalCount++;
      
      // Critical check for lows
      if (key === 'hemoglobin' && normalizedVal < 10) severity = 'high';
      else if (key === 'wbc' && normalizedVal < 2000) severity = 'high';
      else if (key === 'platelets' && normalizedVal < 100000) severity = 'medium';
      else severity = 'medium';
      
    } else if (normalizedVal > max) {
      status = 'high';
      abnormalCount++;
      
      // Critical checks for highs
      if (key === 'wbc' && normalizedVal > 12000) severity = 'medium';
      if (key === 'wbc' && normalizedVal > 20000) severity = 'high';
      else if (key === 'platelets' && normalizedVal > 600000) severity = 'medium';
      else severity = 'medium';
    }

    if (severity === 'high') criticalCount++;

    parameters.push({
      id: key,
      name,
      value: normalizedVal,
      unit,
      normalRange: `${min} – ${max}`,
      status,
      severity
    });
  };

  Object.entries(parsedData).forEach(([k, v]) => analyzeParam(k, v));

  // If no parameters were parsed, return an error state
  if (parameters.length === 0) {
      return {
          parameters: [],
          risk: "UNKNOWN",
          abnormalCount: 0,
          criticalCount: 0,
          error: "Could not detect any numeric CBC parameters from the text."
      };
  }

  if (criticalCount > 0) {
    overallRisk = "HIGH";
  } else if (abnormalCount > 0) {
    overallRisk = "MEDIUM";
  } // Else LOW

  return {
    parameters,
    risk: overallRisk,
    abnormalCount,
    criticalCount
  };
}
