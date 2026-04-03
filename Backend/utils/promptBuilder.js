/**
 * Builds a structured, simple prompt for the LLM based onCBC data
 */
export const buildPrompt = (data) => {
  const { hemoglobin, wbc, platelets, hematocrit, risk } = data;

  return `Explain the following Complete Blood Count (CBC) report in simple terms for a patient:

Hemoglobin: ${hemoglobin !== undefined && hemoglobin !== null ? hemoglobin : 'Not provided'} g/dL
WBC: ${wbc !== undefined && wbc !== null ? wbc : 'Not provided'}
Platelets: ${platelets !== undefined && platelets !== null ? platelets : 'Not provided'}
Hematocrit: ${hematocrit !== undefined && hematocrit !== null ? hematocrit + '%' : 'Not provided'}
Risk Level: ${risk !== undefined ? risk : 'UNKNOWN'}

Explain:
* What these values mean
* If anything is abnormal
* What the patient should do next

Keep the explanation simple, short, and easy to understand. Do not use overly complex medical terminology without explaining it.`;
};
