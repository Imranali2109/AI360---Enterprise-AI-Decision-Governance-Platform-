function calculateOpportunityScore(useCaseData) {
  const {
    businessImpact = 1,
    technicalComplexity = 1,
    dataAvailability = 1,
    adoptionPotential = 1,
    implementationEffort = 1,
    implementationCost = 0,
    operatingCost = 0,
    annualSavings = 0,
    manualHoursPerMonth = 0,
    timeSavingsPercent = 0,
    stage = 'Idea',
    riskLevel = 'Low'
  } = useCaseData;

  const w_businessImpact = 0.30;
  const w_roiScore = 0.25;
  const w_techFeasibility = 0.20;
  const w_dataAvailability = 0.10;
  const w_userAdoption = 0.10;
  const w_implEffort = 0.05;

  let annualBenefit = annualSavings;
  if (!annualBenefit && manualHoursPerMonth && timeSavingsPercent) {
    annualBenefit = manualHoursPerMonth * 12 * (timeSavingsPercent / 100) * 500;
  }

  const totalCost = implementationCost + operatingCost;
  let roi = 0;
  if (totalCost > 0) {
    roi = ((annualBenefit - totalCost) / totalCost) * 100;
  }

  const roiScore = Math.min(100, Math.max(0, roi / 3));
  const normBusinessImpact = (businessImpact / 10) * 100;
  const normTechFeasibility = ((11 - technicalComplexity) / 10) * 100;
  const normDataAvailability = (dataAvailability / 10) * 100;
  const normUserAdoption = (adoptionPotential / 10) * 100;
  const normImplEffort = ((11 - implementationEffort) / 10) * 100;

  const score = (
    normBusinessImpact * w_businessImpact +
    roiScore * w_roiScore +
    normTechFeasibility * w_techFeasibility +
    normDataAvailability * w_dataAvailability +
    normUserAdoption * w_userAdoption +
    normImplEffort * w_implEffort
  );

  let priority = 'Low';
  if (score >= 90) priority = 'High';
  else if (score >= 70) priority = 'Medium';

  let recommendation = 'Assess';
  if (score < 50) recommendation = 'Do Not Proceed';
  else if (riskLevel === 'High') recommendation = 'Reassess after Risk Mitigation';
  else if (score >= 90 && stage === 'PoC') recommendation = 'Proceed to Pilot';
  else if (score >= 85 && riskLevel !== 'High') recommendation = 'Proceed to PoC';

  return {
    score: Math.round(score),
    priority,
    recommendation,
    breakdown: {
      businessImpact: Math.round(normBusinessImpact),
      roiScore: Math.round(roiScore),
      techFeasibility: Math.round(normTechFeasibility),
      dataAvailability: Math.round(normDataAvailability),
      userAdoption: Math.round(normUserAdoption),
      implEffort: Math.round(normImplEffort),
      roiPercent: Math.round(roi),
      annualBenefit,
      totalCost
    }
  };
}

module.exports = { calculateOpportunityScore };
