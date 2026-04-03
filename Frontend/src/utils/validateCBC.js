/**
 * Robust OCR validation for CBC reports.
 * Designed to handle noisy OCR outputs like "HemogIobin" or "PlateIets".
 */

/**
 * Advanced text cleaning to handle OCR noise
 */
export function cleanText(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    // Replace punctuation and special characters with spaces (keep / for units like g/dL)
    .replace(/[^\w\s/]/g, " ")
    // Normalize spacing
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if text is too short or doesn't look like a medical report
 */
export function isMedicalContext(text, matchedCount, hasNumbers) {
  // Reject if very short text (< 30 characters)
  if (!text || text.length < 30) return false;
  
  // Reject if no medical terms and no numbers
  if (matchedCount === 0 && !hasNumbers) return false;
  
  return true;
}

/**
 * Validates extracted text against CBC characteristics
 */
export function validateCBC(rawText) {
  // Debug Logging
  console.log("OCR RAW TEXT:", rawText);
  
  const cleanedText = cleanText(rawText);
  console.log("CLEANED TEXT:", cleanedText);

  // 1. FUZZY KEYWORD MATCHING (Flexible Regex)
  const keywordRegexes = {
  'Hemoglobin': /hemo|hgb|hb|h[ea]m[oa]p|h[ea]m[oa]l/i,
  'WBC': /w.?b.?c|woc|leuko|white.?blood|wad.?count/i,
  'Platelets': /plate|plt|thrombo|slee.?count/i,
  'RBC': /r.?b.?c|erythro|red.?blood|rac.?count|roc.?count/i,
  'Hematocrit': /hema|pcv|hct|packed.?cell|packed.?coll/i,
  'MCV': /mcv|mean.?corp|m[ea][uv]/i,
  'MCH': /mch|mean.?corp|wer.?wa/i,
  'MCHC': /mchc|mean.?corp|fren/i,
  'RDW': /rdw|distribution|wow/i,
  'Neutrophils': /neutro|polymorph|neut/i,
  'Lymphocytes': /lympho|lymp|soros/i,
  'Eosinophils': /eosino|eon|eo.?napt/i,
  'Monocytes': /mono|monoc/i,
  'Basophils': /baso|aasop/i,
  'ESR': /esr|erythrocyte.?sed/i,
  'CBC':  /complete blood count|cbc/i
  'Hemoglobin': /hemo.?glo.?bin|hgb|haem|hemog[oa][ob]|hb\b/i,
  'WBC': /w.?b.?c|white blood cell|leuco|leuko|woc|wbc|total woc|woc cou/i,
  'Platelets': /plate.?lets|plt|thrombo|pres cou|puter cou|platelet|plat/i,
  'RBC': /r.?b.?c|red blood cell|erythro|sac count|ra count|rbc/i,
  'Hematocrit': /hema.?tocrit|hct|pcv|packed cell|packed coll|hematocrt/i,
  'MCV': /m.?c.?v|mean corp|copal voime|corpuscular/i,
  'CBC':  /complete blood count|cbc/i,  // bonus fallback
};

  const detectedKeywords = [];
  Object.entries(keywordRegexes).forEach(([label, regex]) => {
    if (regex.test(cleanedText)) {
      detectedKeywords.push(label);
    }
  });

  console.log("DETECTED KEYWORDS:", detectedKeywords);

  // 2. NUMERIC DETECTION (Reports always contain numbers)
  const hasNumbers = /\d{2,}/.test(cleanedText);

  // 3. MEDICAL CONTEXT CHECK (Units and Terminology)
  const contextMarkers = [
    /g\/dl|ul|\/mm3|cells|fL|pg/i, // Units
    /count|level|range|ref|normal|result/i, // Terms
    /lab|blood|report|doctor|patient/i // Context
  ];
  let contextHits = 0;
  contextMarkers.forEach(regex => {
    if (regex.test(cleanedText)) contextHits++;
  });

  // 4. VALIDATION THRESHOLD
  const matchedCount = detectedKeywords.length;
  // isValid = (matchedKeywords >= 2) AND hasNumbers
  const isValid = (matchedCount >= 2) && hasNumbers;

  // 5. CONFIDENCE CALCULATION
  let confidence = 0;
  if (isValid) {
    confidence = 50; // Base valid confidence
    confidence += (matchedCount * 7); // +7 per parameter
    confidence += (contextHits * 5); // +5 per medical marker
  } else if (matchedCount > 0) {
    confidence = 20 + (matchedCount * 5); // Low confidence but some hope
  }

  // Cap confidence at 100
  confidence = Math.min(100, confidence);

  // 6. FINAL RESULT
  return {
    isValid: isValid,
    confidence: confidence,
    detectedKeywords: detectedKeywords,
    // Provide a detailed error message for failed validation
    error: isValid ? null : getSimplifiedError(cleanedText, matchedCount, hasNumbers)
  };
}

/**
 * Generates user-friendly errors for various edge cases
 */
function getSimplifiedError(text, count, hasNumbers) {
  if (!text || text.length < 30) return "File is unreadable or contains too little text ❌";
  if (!hasNumbers) return "Uploaded file does not appear to contain lab results ❌";
  if (count < 2) return "Uploaded file is not a valid blood report (Incomplete CBC parameters) ❌";
  return "Uploaded file is not a valid blood report ❌";
}
