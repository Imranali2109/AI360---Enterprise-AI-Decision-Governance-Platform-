function calculateRiskScore(riskData) {
  const {
    dataSensitivity = 'Internal', // Public, Internal, Confidential, Personal, Sensitive
    dataLeakageRisk = 0, promptInjectionRisk = 0, unauthorizedAccessRisk = 0, excessivePermissionsRisk = 0,
    hallucinationRisk = 0, biasRisk = 0, reliabilityRisk = 0, explainabilityRisk = 0,
    financialImpactRisk = 0, customerImpactRisk = 0, regulatoryImpactRisk = 0,
    humanOversightRequired = true
  } = riskData;

  let privacyScore = 0;
  switch (dataSensitivity) {
    case 'Internal': privacyScore = 5; break;
    case 'Confidential': privacyScore = 15; break;
    case 'Personal': privacyScore = 20; break;
    case 'Sensitive': privacyScore = 25; break;
    default: privacyScore = 0;
  }

  const avgSecurity = (dataLeakageRisk + promptInjectionRisk + unauthorizedAccessRisk + excessivePermissionsRisk) / 4;
  const securityScore = (avgSecurity / 10) * 25;

  const avgModel = (hallucinationRisk + biasRisk + reliabilityRisk + explainabilityRisk) / 4;
  const modelScore = (avgModel / 10) * 25;

  let avgBusiness = (financialImpactRisk + customerImpactRisk + regulatoryImpactRisk) / 3;
  let businessScore = (avgBusiness / 10) * 25;
  if (!humanOversightRequired) businessScore = Math.min(25, businessScore + 5);

  const totalRiskScore = Math.round(privacyScore + securityScore + modelScore + businessScore);
  
  let riskLevel = 'Low';
  if (totalRiskScore > 60) riskLevel = 'High';
  else if (totalRiskScore > 30) riskLevel = 'Medium';

  const recommendations = ['Log AI interactions and monitor outputs'];
  if (privacyScore > 15) recommendations.push('Restrict sensitive data from AI model inputs', 'Implement data anonymization');
  if (securityScore > 15) recommendations.push('Implement prompt injection safeguards', 'Apply principle of least privilege');
  if (hallucinationRisk > 5) recommendations.push('Implement human review for AI outputs');
  if (biasRisk > 5) recommendations.push('Conduct regular bias audits', 'Diversify training data');
  if (riskLevel === 'High') recommendations.push('Human approval required for all AI decisions', 'Obtain legal/compliance sign-off');
  if (regulatoryImpactRisk > 5) recommendations.push('Review applicable regulations (DPDP, GDPR)', 'Engage compliance team');

  return {
    totalRiskScore,
    riskLevel,
    breakdown: {
      privacyScore: Math.round(privacyScore),
      securityScore: Math.round(securityScore),
      modelScore: Math.round(modelScore),
      businessScore: Math.round(businessScore)
    },
    recommendations
  };
}

module.exports = { calculateRiskScore };
