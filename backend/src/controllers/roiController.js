const { calculateROI } = require('../utils/roiCalculations');

exports.calculate = async (req, res, next) => {
  try {
    const body = req.body;

    // Map frontend field names to calculation function field names
    const inputs = {
      numUsers: body.numUsers || body.employees || 0,
      manualHoursPerMonth: body.manualHoursPerMonth || body.hoursPerMonthPerEmployee || 0,
      hourlyEmployeeCostInr: body.hourlyEmployeeCostInr || body.hourlyCost || 500,
      automationPercent: body.automationPercent || body.automationPercentage || 0,
      implementationCost: body.implementationCost || 0,
      annualOperatingCost: body.annualOperatingCost || body.annualOperatingCost || 0,
    };

    const result = calculateROI(inputs);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

exports.getCalculations = async (req, res, next) => {
  res.json({ success: true, data: [] });
};
