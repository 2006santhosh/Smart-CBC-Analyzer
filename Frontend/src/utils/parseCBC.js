/**
 * Advanced Context-Based Parser for Noisy OCR CBC Reports
 */

export function parseCBC(text) {
  if (!text) {
    return { hemoglobin: null, wbc: null, platelets: null, hematocrit: null };
  }

  console.log("OCR TEXT:", text);

  // 1. CLEAN OCR TEXT (Only remove punctuation, preserve letters for keywords)
  const cleanedText = text
    .toLowerCase()
    // convert letter s attached to a digit into .5 (e.g., 12s -> 12.5)
    .replace(/(\d)s/g, '$1.5')
    // Remove unwanted characters except digits, dots, spaces, and letters
    .replace(/[^\d.\s,a-z]/g, ' ');

  // 2. SPLIT INTO WORDS
  const words = cleanedText.split(/\s+/).filter((w) => w.length > 0);

  // Define patterns and types
  const types = {
    hemoglobin: {
      patterns: [/hemo/i, /hemog/i, /hemo.?g/i, /hgb/i],
      scoreFn: (num) => {
        // Relaxed fallback boundaries
        if (num < 4 || num > 30) return -1;
        let score = 0;
        if (num >= 8 && num <= 20) score += 2; // Primary relaxed range
        if (num >= 10 && num <= 18) score += 2;
        if (num % 1 !== 0) score += 1; // decimal
        if (num >= 13 && num <= 17) score += 1; // near 13-17
        return score;
      },
    },
    wbc: {
      patterns: [/w.?b.?c/i, /woc/i, /w8c/i],
      scoreFn: (num) => {
        // Fallback boundary
        if (num < 1000 || num > 50000) return -1;
        let score = 0;
        if (num >= 3000 && num <= 20000) score += 1; // Basic relaxed range
        if (num >= 4000 && num <= 11000) score += 2;
        if (num >= 8000 && num <= 10000) score += 1;
        return score;
      },
    },
    platelets: {
      patterns: [/plate/i, /plt/i, /p.?late/i],
      scoreFn: (num) => {
        if (num < 50000 || num > 1000000) return -1;
        let score = 0;
        if (num >= 100000 && num <= 500000) score += 1; // Relaxed bound
        if (num >= 150000 && num <= 400000) score += 2;
        return score;
      },
    },
    hematocrit: {
      patterns: [/hema/i, /pcv/i, /hct/i],
      scoreFn: (num) => {
        if (num < 15 || num > 75) return -1;
        let score = 0;
        if (num >= 30 && num <= 70) score += 1; // Relaxed bound
        if (num >= 36 && num <= 54) score += 2;
        if (num >= 40 && num <= 50) score += 1; // near 45
        return score;
      },
    },
  };

  // 3. GENERIC HELPER for parsing
  function extractValue(wordsArray, config, typeName) {
    let bestCandidate = null;
    let highestScore = -1;
    let candidates = [];

    // Find keyword index
    for (let i = 0; i < wordsArray.length; i++) {
      const match = config.patterns.some((pattern) => pattern.test(wordsArray[i]));
      
      if (match) {
        // Collect candidates (look ahead 10 words)
        const end = Math.min(i + 11, wordsArray.length);
        for (let j = i + 1; j < end; j++) {
           const candidateWord = wordsArray[j];
           
           // Specifically fix numbers: i->1, o->0, l->1, s->5 before cleaning
           let potentialNum = candidateWord
             .replace(/i/g, '1')
             .replace(/o/g, '0')
             .replace(/l/g, '1')
             .replace(/s/g, '5');

           if (/\d/.test(potentialNum)) {
             // Clean number (remove non-digits except dot)
             let cleanStr = potentialNum.replace(/[^\d.]/g, '');
             // Prevent multiple dots
             if ((cleanStr.match(/\./g) || []).length > 1) {
               cleanStr = cleanStr.split('.')[0] + '.' + cleanStr.split('.').slice(1).join('');
             }
             
             let num = parseFloat(cleanStr);
             if (!isNaN(num)) {
               // Normalization for WBC & Platelets if defined as 10^3 format
               if (typeName === 'wbc' && num <= 50 && num >= 1) {
                 num = num * 1000;
               } else if (typeName === 'platelets' && num <= 1000 && num >= 10) {
                 num = num * 1000;
               }

               candidates.push(num);
             }
           }
        }
        
        break; // Stop after first matched keyword section
      }
    }

    if (candidates.length > 0) {
      console.log(`${typeName.charAt(0).toUpperCase() + typeName.slice(1)} candidates:`, candidates);
      
      for (const num of candidates) {
         const score = config.scoreFn(num);
         if (score > highestScore) {
            highestScore = score;
            bestCandidate = num;
         }
      }
      
      if (highestScore > -1) {
          console.log(`Selected ${typeName.charAt(0).toUpperCase() + typeName.slice(1)}:`, bestCandidate);
          return bestCandidate;
      }
    }

    return null;
  }

  // A. Find values
  const hemoglobin = extractValue(words, types.hemoglobin, 'hemoglobin');
  const wbc = extractValue(words, types.wbc, 'wbc');
  const platelets = extractValue(words, types.platelets, 'platelets');
  const hematocrit = extractValue(words, types.hematocrit, 'hematocrit');

  const result = {
    hemoglobin,
    wbc,
    platelets,
    hematocrit
  };

  console.log("PARSED VALUES:", result);
  
  if (!hemoglobin && !wbc && !platelets && !hematocrit) {
     console.warn("WARNING: No valid CBC parameters extracted from text. Analysis engine may throw fallback.");
  }

  return result;
}
