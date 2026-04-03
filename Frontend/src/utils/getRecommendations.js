/**
 * Returns prioritized actionable recommendations based on analysis.
 */

export function getRecommendations(analysis) {
  const recommendations = [];

  if (!analysis || !analysis.parameters) {
      return [];
  }

  // URGENT rules
  if (analysis.risk === 'HIGH') {
    recommendations.push({
      priority: 'urgent',
      text: 'Seek immediate medical consultation due to critical lab abnormalities',
      icon: '🚨',
    });
  }

  // Medium rules
  if (analysis.risk === 'MEDIUM') {
    recommendations.push({
      priority: 'high',
      text: 'Consult your doctor soon to discuss these abnormal findings',
      icon: '🩺',
    });
  }

  // Specific parameter rules
  analysis.parameters.forEach(param => {
    if (param.id === 'hemoglobin' && param.status === 'low') {
      recommendations.push({
        priority: param.severity === 'high' ? 'urgent' : 'high',
        text: 'Iron studies and anemia evaluation strongly recommended',
        icon: '🔬',
      });
    }
    if (param.id === 'wbc' && param.status === 'high') {
      recommendations.push({
        priority: param.severity === 'high' ? 'high' : 'medium',
        text: 'Assess for potential sources of active infection or inflammation',
        icon: '🧫',
      });
    }
    if (param.id === 'platelets' && param.status === 'low') {
       recommendations.push({
        priority: 'high',
        text: 'Take precautions against bleeding and review with provider',
        icon: '🩸',
      });
    }
  });

  // Base suggestions for all
  if (analysis.abnormalCount > 0) {
    recommendations.push({
      priority: 'medium',
      text: 'Schedule follow-up CBC as advised by your physician to monitor changes',
      icon: '📅',
    });
  } else {
    // Everything normal
    recommendations.push({
       priority: 'low',
       text: 'Maintain healthy lifestyle and routine check-ups',
       icon: '🍏'
    });
    recommendations.push({
       priority: 'low',
       text: 'No immediate action required, values are within standard ranges',
       icon: '🛡️'
    });
  }

  // Filter out duplicates and limit to top 5
  const uniqueRecs = [];
  const textSet = new Set();
  
  for (const rec of recommendations) {
     if (!textSet.has(rec.text)) {
        textSet.add(rec.text);
        uniqueRecs.push(rec);
     }
  }

  return uniqueRecs.slice(0, 5);
}
