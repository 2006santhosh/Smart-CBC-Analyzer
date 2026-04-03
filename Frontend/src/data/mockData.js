// CBC reference ranges for validation and analysis
export const CBC_REFERENCE_RANGES = {
  hemoglobin: {
    name: 'Hemoglobin',
    unit: 'g/dL',
    low: 12.0,
    high: 17.5,
    criticalLow: 7.0,
    criticalHigh: 20.0,
  },
  wbc: {
    name: 'WBC (White Blood Cells)',
    unit: '/µL',
    low: 4500,
    high: 11000,
    criticalLow: 2000,
    criticalHigh: 30000,
  },
  platelets: {
    name: 'Platelets',
    unit: '/µL',
    low: 150000,
    high: 400000,
    criticalLow: 50000,
    criticalHigh: 1000000,
  },
  rbc: {
    name: 'RBC (Red Blood Cells)',
    unit: 'million/µL',
    low: 4.5,
    high: 5.5,
    criticalLow: 2.5,
    criticalHigh: 8.0,
  },
  hematocrit: {
    name: 'Hematocrit',
    unit: '%',
    low: 36,
    high: 54,
    criticalLow: 20,
    criticalHigh: 65,
  },
  mcv: {
    name: 'MCV',
    unit: 'fL',
    low: 80,
    high: 100,
    criticalLow: 60,
    criticalHigh: 120,
  },
};

// Keywords that indicate a CBC blood report
export const CBC_KEYWORDS = [
  'hemoglobin', 'hgb', 'haemoglobin',
  'wbc', 'white blood cell', 'leucocyte', 'leukocyte',
  'rbc', 'red blood cell', 'erythrocyte',
  'platelet', 'plt', 'thrombocyte',
  'hematocrit', 'hct', 'pcv',
  'mcv', 'mch', 'mchc',
  'complete blood count', 'cbc', 'blood report',
  'differential count', 'neutrophil', 'lymphocyte',
  'basophil', 'eosinophil', 'monocyte',
];

// Mock results data
export const MOCK_RESULTS = {
  parameters: [
    {
      id: 'hemoglobin',
      name: 'Hemoglobin',
      value: 8,
      unit: 'g/dL',
      normalRange: '12.0 – 17.5',
      status: 'low',
      severity: 'high',
    },
    {
      id: 'wbc',
      name: 'WBC',
      value: 13000,
      unit: '/µL',
      normalRange: '4,500 – 11,000',
      status: 'high',
      severity: 'medium',
    },
    {
      id: 'platelets',
      name: 'Platelets',
      value: 150000,
      unit: '/µL',
      normalRange: '150,000 – 400,000',
      status: 'normal',
      severity: 'low',
    },
    {
      id: 'rbc',
      name: 'RBC',
      value: 3.8,
      unit: 'million/µL',
      normalRange: '4.5 – 5.5',
      status: 'low',
      severity: 'medium',
    },
    {
      id: 'hematocrit',
      name: 'Hematocrit',
      value: 28,
      unit: '%',
      normalRange: '36 – 54',
      status: 'low',
      severity: 'high',
    },
    {
      id: 'mcv',
      name: 'MCV',
      value: 88,
      unit: 'fL',
      normalRange: '80 – 100',
      status: 'normal',
      severity: 'low',
    },
  ],
  overallRisk: 'HIGH',
  aiExplanation:
    'The blood report reveals critically low hemoglobin (8 g/dL), indicating moderate to severe anemia. ' +
    'The elevated WBC count (13,000/µL) suggests an active immune response, potentially due to infection or inflammation. ' +
    'Low RBC count and hematocrit further support the diagnosis of anemia. ' +
    'Platelet count and MCV are within normal limits, ruling out thrombocytopenia and macrocytic/microcytic anemia respectively. ' +
    'The combination of severe anemia with elevated WBC warrants prompt medical evaluation.',
  recommendations: [
    {
      priority: 'urgent',
      text: 'Seek immediate medical consultation for severe anemia evaluation',
      icon: '🚨',
    },
    {
      priority: 'high',
      text: 'Complete iron studies and reticulocyte count recommended',
      icon: '🔬',
    },
    {
      priority: 'high',
      text: 'Blood culture and infection workup advised for elevated WBC',
      icon: '🧫',
    },
    {
      priority: 'medium',
      text: 'Follow up with complete metabolic panel (CMP)',
      icon: '📋',
    },
    {
      priority: 'low',
      text: 'Schedule follow-up CBC in 1 week to monitor trends',
      icon: '📅',
    },
  ],
  emergencyAlert: true,
};

// Simulate file validation
export function validateCBCReport(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate keyword detection from file name
      const fileName = file.name.toLowerCase();
      const isBloodReport =
        CBC_KEYWORDS.some((kw) => fileName.includes(kw)) ||
        // For demo, accept any PDF/image as valid
        file.type === 'application/pdf' ||
        file.type.startsWith('image/');

      resolve({
        isValid: isBloodReport,
        confidence: isBloodReport ? 0.94 : 0.12,
        detectedKeywords: isBloodReport
          ? ['CBC', 'Hemoglobin', 'WBC', 'Platelets', 'RBC']
          : [],
      });
    }, 1500);
  });
}

// Simulate analysis
export function analyzeReport() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_RESULTS);
    }, 3000);
  });
}
