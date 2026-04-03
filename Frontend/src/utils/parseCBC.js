/**
 * Advanced Structural Parser for Noisy OCR CBC Reports
 * Advanced Context-Based Parser for Noisy OCR CBC Reports
 */

export function parseCBC(text) {
  if (!text) {
    return { hemoglobin: null, wbc: null, platelets: null, hematocrit: null };
  }

  console.log("OCR TEXT (RAW):", text);

  // 1. SPLIT INTO LINES for Strategy 1
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  // 2. FLAT WORDS for Fallback
  // Clean slightly but preserve word boundaries
  const cleanedFlat = text
    .toLowerCase()
    .replace(/(\d)s\b/g, '$1.5')
    .replace(/[^\d.\s,a-z\n]/g, ' ');
  const words = cleanedFlat.split(/\s+/).filter((w) => w.length > 0);
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
      patterns: [/hemo/i, /hgb/i, /^hb$/i, /h[ea]m[oa]p/i, /h[ea]m[oa]l/i],
      scoreFn: (num) => {
        if (num < 4 || num > 30) return -1;
        let score = 0; if (num >= 8 && num <= 20) score += 2; if (num % 1 !== 0) score += 1;
        return score;
      },
    },
    rbc: {
      patterns: [/^rbc$/i, /total.?rbc/i, /erythro/i, /red.?blood/i, /rac.?count/i, /roc.?count/i, /r\.b\.c/i],
      scoreFn: (num) => {
        if (num < 1 || num > 10) return -1;
        let score = 0; if (num >= 3.5 && num <= 6.5) score += 2; if (num % 1 !== 0) score += 1;
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
      patterns: [/w.?b.?c/i, /woc/i, /^wbc$/i, /leuko/i, /white.?blood/i, /wad.?count/i, /total.?wad/i],
      scoreFn: (num) => {
        if (num < 1000 || num > 50000) return -1;
        let score = 0; if (num >= 3000 && num <= 20000) score += 1;
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
      patterns: [/plate/i, /plt/i, /platelet/i, /thrombo/i, /slee.?count/i],
      scoreFn: (num) => {
        if (num < 10000 || num > 2000000) return -1;
        let score = 0; if (num >= 100000 && num <= 500000) score += 1;
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
      patterns: [/hema/i, /^pcv$/i, /hct/i, /packed.?cell/i, /packed.?coll/i, /pcv/i],
      scoreFn: (num) => {
        if (num < 15 || num > 75) return -1;
        let score = 0; if (num >= 30 && num <= 70) score += 1; if (num % 1 !== 0) score += 1;
        return score;
      },
    },
    mcv: {
      patterns: [/^mcv$/i, /mean.?corpuscular.?volume/i, /m[ea][uv]/i, /m\.c\.v/i],
      scoreFn: (num) => {
        if (num < 50 || num > 150) return -1;
        let score = 0; if (num >= 83 && num <= 101) score += 2;
        return score;
      },
    },
    mch: {
      patterns: [/^mch$/i, /mean.?corpuscular.?hemoglobin$/i, /m\.c\.h\b/i, /wer.?wa/i],
      scoreFn: (num) => {
        if (num < 15 || num > 50) return -1;
        let score = 0; if (num >= 27 && num <= 32) score += 2;
        return score;
      },
    },
    mchc: {
      patterns: [/^mchc$/i, /mean.?corpuscular.?h.*.?concentration/i, /m\.c\.h\.c/i, /fren/i],
      scoreFn: (num) => {
        if (num < 20 || num > 50) return -1;
        let score = 0; if (num >= 32.5 && num <= 34.5) score += 2;
        return score;
      },
    },
    rdw: {
      patterns: [/^rdw/i, /red.?cell.?distribution/i, /wow/i],
      scoreFn: (num) => {
        if (num < 5 || num > 40) return -1;
        let score = 0; if (num >= 11.6 && num <= 14.0) score += 2;
        return score;
      },
    },
    neutrophils: {
      patterns: [/neutro/i, /polymorphonuclear/i, /^n$/i, /neut/i],
      scoreFn: (num) => {
        if (num < 0 || num > 100) return -1;
        return (num >= 40 && num <= 80) ? 2 : 1;
      },
    },
    lymphocytes: {
      patterns: [/lympho/i, /^l$/i, /lymp/i, /soros/i],
      scoreFn: (num) => {
        if (num < 0 || num > 100) return -1;
        return (num >= 20 && num <= 40) ? 2 : 1;
      },
    },
    eosinophils: {
      patterns: [/eosino/i, /^e$/i, /eon/i, /eo.?napt/i],
      scoreFn: (num) => {
        if (num < 0 || num > 100) return -1;
        return (num >= 0 && num <= 6) ? 2 : 1;
      },
    },
    monocytes: {
      patterns: [/mono/i, /^m$/i, /monoc/i],
      scoreFn: (num) => {
        if (num < 0 || num > 100) return -1;
        return (num >= 0 && num <= 10) ? 2 : 1;
      },
    },
    basophils: {
      patterns: [/baso/i, /^b$/i, /aasop/i],
      scoreFn: (num) => {
        if (num < 0 || num > 100) return -1;
        return (num >= 0 && num <= 2) ? 2 : 1;
      },
    },
    esr: {
      patterns: [/esr/i, /^en$/i, /erythrocyte.?sed/i],
      scoreFn: (num) => {
        if (num < 0 || num > 150) return -1;
        return (num >= 0 && num <= 15) ? 2 : 1;
      },
    }
  };

  function repairNum(candidate, typeName) {
    let potentialNum = candidate.toLowerCase()
      .replace(/i/g, '1').replace(/o/g, '0').replace(/l/g, '1')
      .replace(/s/g, '5').replace(/a/g, '9');
    
    if (!/\d/.test(potentialNum)) return null;

    let cleanStr = potentialNum.replace(/[^\d.]/g, '');
    if (candidate.startsWith('s') && candidate.length > 1 && !cleanStr.includes('.')) {
        if (typeName === 'rbc' && cleanStr.length === 2) {
            cleanStr = cleanStr[0] + '.' + cleanStr[1];
        }
    }
    if ((cleanStr.match(/\./g) || []).length > 1) {
      cleanStr = cleanStr.split('.')[0] + '.' + cleanStr.split('.').slice(1).join('');
    }

    let num = parseFloat(cleanStr);
    if (isNaN(num)) return null;

    // Repairs
    if (typeName === 'mcv' && num > 150 && num < 15000) num /= 100;
    else if ((typeName === 'mch' || typeName === 'mchc' || typeName === 'hemoglobin') && num > 30 && num < 500) num /= 10;
    
    // Normalization
    if (typeName === 'wbc' && num <= 50 && num >= 1) num *= 1000;
    else if (typeName === 'platelets' && num <= 1000 && num >= 10) num *= 1000;

    return num;
  }

  function extractValue(config, typeName) {
    // STRATEGY 1: LINE-BASED SCAN (Highly Accurate)
    for (let line of lines) {
      const lineWords = line.toLowerCase().split(/\s+/);
      for (let i = 0; i < lineWords.length; i++) {
        const snippet = lineWords.slice(i, i + 4).join(" ");
        if (config.patterns.some(p => p.test(snippet))) {
          // Found parameter! Look for BEST valid number in this line
          let bestLineV = null; let bestLineS = -1;
          for (let j = i + 1; j < Math.min(i + 10, lineWords.length); j++) {
            const val = repairNum(lineWords[j], typeName);
            if (val !== null) {
              const s = config.scoreFn(val);
              if (s > bestLineS) { bestLineS = s; bestLineV = val; }
            }
          }
          if (bestLineV !== null && bestLineS > 0) return bestLineV;
        }
      }
    }

    // STRATEGY 2: SMALL WINDOW FALLBACK (14 words)
    for (let i = 0; i < words.length; i++) {
      const snippet = words.slice(i, i + 4).join(" ");
      if (config.patterns.some(p => p.test(snippet))) {
        let bestV = null; let bestS = -1;
        const end = Math.min(i + 14, words.length);
        for (let j = i + 1; j < end; j++) {
          const val = repairNum(words[j], typeName);
          if (val !== null) {
            const s = config.scoreFn(val);
            const dist = j - i;
            const finalScore = s + (1.0 - dist * 0.05);
            if (finalScore > bestS) { bestS = finalScore; bestV = val; }
          }
        }
        if (bestV !== null && bestS > 0) return bestV;
      }
    }

    // STRATEGY 3: VERTICAL FALLBACK (60 words)
    for (let i = 0; i < words.length; i++) {
        const snippet = words.slice(i, i + 4).join(" ");
        if (config.patterns.some(p => p.test(snippet))) {
          const end = Math.min(i + 61, words.length);
          for (let j = i + 1; j < end; j++) {
            const val = repairNum(words[j], typeName);
            if (val !== null && config.scoreFn(val) > 1) return val;
          }
        }
    }
    return null;
  }

  const result = {};
  Object.keys(types).forEach(key => {
    const val = extractValue(types[key], key);
    if (val !== null) result[key] = val;
  });

  console.log("FINAL PARSED VALUES:", result);
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
