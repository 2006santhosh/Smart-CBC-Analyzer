/**
 * Deterministic AI-like explanation engine.
 */

export function generateExplanation(parsedData, analysis) {
  if (!analysis || !analysis.parameters || analysis.parameters.length === 0) {
    return "Could not generate an explanation due to missing parameters.";
  }

  const explanations = [];

  analysis.parameters.forEach(param => {
    if (param.status !== 'normal') {
      if (param.id === 'hemoglobin') {
        if (param.status === 'low') explanations.push("Hemoglobin is low, which may indicate anemia, leading to fatigue and reduced oxygen-carrying capacity.");
        if (param.status === 'high') explanations.push("Hemoglobin is high, which could indicate dehydration or conditions causing an overproduction of red blood cells.");
      }
      
      if (param.id === 'wbc') {
        if (param.status === 'low') explanations.push("WBC count is low, which might imply a suppressed immune system or viral infection.");
        if (param.status === 'high') explanations.push("Elevated WBC count may indicate an active infection, inflammation, or significant immune response.");
      }
      
      if (param.id === 'platelets') {
        if (param.status === 'low') explanations.push("Low platelet count may increase the risk of bleeding and bruising.");
        if (param.status === 'high') explanations.push("High platelet count is typically a reactive response to infection, iron deficiency, or inflammation.");
      }

      if (param.id === 'rbc') {
         if (param.status === 'low') explanations.push("Red Blood Cell (RBC) count is low, indicating possible anemia or blood loss.");
         if (param.status === 'high') explanations.push("RBC count is high, which can be related to low oxygen levels, kidney disease, or dehydration.");
      }

      if (param.id === 'hematocrit') {
         if (param.status === 'low') explanations.push("Low hematocrit suggests a low proportion of red blood cells in your blood, reinforcing the possibility of anemia.");
         if (param.status === 'high') explanations.push("High hematocrit implies an elevated concentration of red blood cells or lower fluid volume in the blood.");
      }

      if (param.id === 'mcv') {
         if (param.status === 'low') explanations.push("Low MCV means your red blood cells are smaller than normal, frequently seen with iron deficiency.");
         if (param.status === 'high') explanations.push("High MCV indicates larger red blood cells, which can sometimes be caused by vitamin B12 or folate deficiency.");
      }
    }
  });

  if (explanations.length === 0) {
       return "All extracted blood parameters appear to fall within the standard, healthy reference ranges. Your complete blood count seems overall stable.";
  }

  let finalExplanation = explanations.join(" ");

  // Provide closing context
  if (analysis.risk === 'HIGH') {
    finalExplanation += " Due to the critical nature of some abnormal values, swift medical evaluation is strongly advised.";
  } else if (analysis.risk === 'MEDIUM') {
    finalExplanation += " These abnormalities should be correlated clinically with a doctor to determine the appropriate follow-up.";
  }

  return finalExplanation;
}
