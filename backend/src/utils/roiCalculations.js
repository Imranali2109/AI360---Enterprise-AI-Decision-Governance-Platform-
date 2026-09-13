function calculateROI(inputs) {
  const {
    numUsers = 0,
    manualHoursPerMonth = 0,
    automationPercent = 0,
    hourlyEmployeeCostInr = 500,
    implementationCost = 0,
    annualOperatingCost = 0
  } = inputs;

  const annualBenefit = numUsers * manualHoursPerMonth * 12 * (automationPercent / 100) * hourlyEmployeeCostInr;
  const totalAnnualAiCost = (implementationCost / 3) + annualOperatingCost;
  const netAnnualBenefit = annualBenefit - totalAnnualAiCost;
  const roiPercent = totalAnnualAiCost > 0 ? (netAnnualBenefit / totalAnnualAiCost) * 100 : 0;
  const paybackMonths = annualBenefit > 0 ? implementationCost / (annualBenefit / 12) : 0;

  return {
    annualBenefit,
    totalAnnualAiCost,
    netAnnualBenefit,
    roiPercent,
    paybackMonths
  };
}

module.exports = { calculateROI };
