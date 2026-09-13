const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Inline scoring to avoid path issues when run from prisma dir
function calculateOpportunityScore(uc) {
  const {
    businessImpact = 5,
    technicalComplexity = 5,
    dataAvailability = 5,
    adoptionPotential = 5,
    implementationEffort = 5,
    implementationCost = 0,
    operatingCost = 0,
    annualSavings = 0,
  } = uc;

  const totalCost = implementationCost + operatingCost;
  let roi = 0;
  if (totalCost > 0) roi = ((annualSavings - totalCost) / totalCost) * 100;
  const roiScore = Math.min(100, Math.max(0, roi / 3));

  const normBusinessImpact = (businessImpact / 10) * 100;
  const normTechFeasibility = ((11 - technicalComplexity) / 10) * 100;
  const normDataAvailability = (dataAvailability / 10) * 100;
  const normUserAdoption = (adoptionPotential / 10) * 100;
  const normImplEffort = ((11 - implementationEffort) / 10) * 100;

  const score =
    normBusinessImpact * 0.30 +
    roiScore * 0.25 +
    normTechFeasibility * 0.20 +
    normDataAvailability * 0.10 +
    normUserAdoption * 0.10 +
    normImplEffort * 0.05;

  let priority = 'Low';
  if (score >= 90) priority = 'High';
  else if (score >= 70) priority = 'Medium';

  let recommendation = 'Assess';
  if (score < 50) recommendation = 'Do Not Proceed';
  else if (score >= 85) recommendation = 'Proceed to PoC';

  return { score: Math.round(score), priority, recommendation };
}

function calculateRiskScore(riskData) {
  const {
    dataSensitivity = 'Internal',
    dataLeakageRisk = 0, promptInjectionRisk = 0, unauthorizedAccessRisk = 0, excessivePermissionsRisk = 0,
    hallucinationRisk = 0, biasRisk = 0, reliabilityRisk = 0, explainabilityRisk = 0,
    financialImpactRisk = 0, customerImpactRisk = 0, regulatoryImpactRisk = 0,
    humanOversightRequired = true
  } = riskData;

  let privacyScore = 0;
  if (dataSensitivity === 'Internal') privacyScore = 5;
  else if (dataSensitivity === 'Confidential') privacyScore = 15;
  else if (dataSensitivity === 'Personal') privacyScore = 20;
  else if (dataSensitivity === 'Sensitive') privacyScore = 25;

  const securityScore = ((dataLeakageRisk + promptInjectionRisk + unauthorizedAccessRisk + excessivePermissionsRisk) / 4 / 10) * 25;
  const modelScore = ((hallucinationRisk + biasRisk + reliabilityRisk + explainabilityRisk) / 4 / 10) * 25;
  let businessScore = ((financialImpactRisk + customerImpactRisk + regulatoryImpactRisk) / 3 / 10) * 25;
  if (!humanOversightRequired) businessScore = Math.min(25, businessScore + 5);

  const totalRiskScore = Math.round(privacyScore + securityScore + modelScore + businessScore);
  let riskLevel = 'Low';
  if (totalRiskScore > 60) riskLevel = 'High';
  else if (totalRiskScore > 30) riskLevel = 'Medium';

  const recommendations = ['Log AI interactions and monitor outputs'];
  if (privacyScore > 15) recommendations.push('Restrict sensitive data from AI model inputs', 'Implement data anonymization');
  if (securityScore > 15) recommendations.push('Implement prompt injection safeguards', 'Apply principle of least privilege');
  if (hallucinationRisk > 5) recommendations.push('Implement human review for AI outputs');
  if (biasRisk > 5) recommendations.push('Conduct regular bias audits');
  if (riskLevel === 'High') recommendations.push('Human approval required for all AI decisions', 'Obtain legal/compliance sign-off');
  if (regulatoryImpactRisk > 5) recommendations.push('Review applicable regulations (DPDP, GDPR)', 'Engage compliance team');

  return {
    totalRiskScore,
    riskLevel,
    breakdown: { privacyScore: Math.round(privacyScore), securityScore: Math.round(securityScore), modelScore: Math.round(modelScore), businessScore: Math.round(businessScore) },
    recommendations
  };
}

async function main() {
  console.log('🌱 Seeding AI360 database...');

  // Create users
  const adminPassword = await bcrypt.hash('Demo@1234', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ai360.demo' },
    update: {},
    create: { name: 'Admin User', email: 'admin@ai360.demo', password: adminPassword, role: 'admin' }
  });

  await prisma.user.upsert({
    where: { email: 'priya@ai360.demo' },
    update: {},
    create: { name: 'Priya Sharma', email: 'priya@ai360.demo', password: adminPassword, role: 'user' }
  });

  console.log('✅ Users created');

  // 10 realistic AI use cases
  const rawUseCases = [
    {
      name: 'HR Knowledge Assistant',
      department: 'HR',
      problem: 'Employees spend an average of 15% of their working time searching HR policies, leave rules, and benefits information. This results in approximately 1,200 manual hours lost per month across the organisation.',
      solution: 'A RAG-based AI assistant trained on all HR documents that can answer employee queries instantly with cited sources.',
      stage: 'PoC',
      numUsers: 450,
      businessImpact: 7, technicalComplexity: 4, dataAvailability: 8, adoptionPotential: 8, implementationEffort: 5,
      implementationCost: 500000, operatingCost: 180000, annualSavings: 960000,
      manualHoursPerMonth: 1200, timeSavingsPercent: 70,
      dataSensitivity: 'Internal', humanOversightRequired: false,
    },
    {
      name: 'Customer Support Copilot',
      department: 'Customer Service',
      problem: 'Average ticket resolution time is 24 hours. CSAT score is 68%. Agents spend 60% of time searching knowledge bases.',
      solution: 'AI copilot that suggests responses, auto-classifies tickets, and surfaces relevant knowledge base articles in real-time.',
      stage: 'Assessment',
      numUsers: 120,
      businessImpact: 9, technicalComplexity: 6, dataAvailability: 7, adoptionPotential: 7, implementationEffort: 7,
      implementationCost: 1200000, operatingCost: 360000, annualSavings: 3600000,
      manualHoursPerMonth: 2400, timeSavingsPercent: 50,
      dataSensitivity: 'Confidential', humanOversightRequired: true,
    },
    {
      name: 'Invoice Data Extraction',
      department: 'Finance',
      problem: 'Manual invoice processing requires 4 FTEs and has an 8% error rate. Processing time averages 3 days per invoice batch.',
      solution: 'AI-powered OCR and data extraction to automatically process invoices, validate data, and populate ERP system.',
      stage: 'Pilot',
      numUsers: 30,
      businessImpact: 8, technicalComplexity: 3, dataAvailability: 9, adoptionPotential: 8, implementationEffort: 4,
      implementationCost: 800000, operatingCost: 240000, annualSavings: 2400000,
      manualHoursPerMonth: 800, timeSavingsPercent: 80,
      dataSensitivity: 'Confidential', humanOversightRequired: true,
    },
    {
      name: 'Sales Email Assistant',
      department: 'Sales',
      problem: 'Sales representatives spend 40% of their time drafting personalised outreach emails, follow-ups, and proposals.',
      solution: 'AI writing assistant that generates personalised sales emails based on CRM data, prospect profile, and previous interactions.',
      stage: 'Idea',
      numUsers: 200,
      businessImpact: 6, technicalComplexity: 3, dataAvailability: 6, adoptionPotential: 7, implementationEffort: 3,
      implementationCost: 300000, operatingCost: 120000, annualSavings: 900000,
      manualHoursPerMonth: 1600, timeSavingsPercent: 35,
      dataSensitivity: 'Internal', humanOversightRequired: false,
    },
    {
      name: 'IT Helpdesk Assistant',
      department: 'IT',
      problem: 'IT helpdesk receives 200+ tickets per day. Average resolution time is 3 hours. 60% of tickets are repetitive L1 issues.',
      solution: 'AI chatbot that auto-resolves L1 tickets, guides users through troubleshooting, and escalates only complex issues to human agents.',
      stage: 'PoC',
      numUsers: 5000,
      businessImpact: 7, technicalComplexity: 5, dataAvailability: 8, adoptionPotential: 7, implementationEffort: 5,
      implementationCost: 600000, operatingCost: 200000, annualSavings: 1500000,
      manualHoursPerMonth: 1800, timeSavingsPercent: 60,
      dataSensitivity: 'Internal', humanOversightRequired: false,
    },
    {
      name: 'Meeting Summarization',
      department: 'Operations',
      problem: 'Managers spend an average of 6 hours per week manually documenting meeting minutes, action items, and decisions.',
      solution: 'AI tool that transcribes meetings and automatically generates structured summaries with action items and decisions.',
      stage: 'Assessment',
      numUsers: 800,
      businessImpact: 5, technicalComplexity: 2, dataAvailability: 6, adoptionPotential: 9, implementationEffort: 2,
      implementationCost: 150000, operatingCost: 60000, annualSavings: 600000,
      manualHoursPerMonth: 1920, timeSavingsPercent: 65,
      dataSensitivity: 'Internal', humanOversightRequired: false,
    },
    {
      name: 'Contract Analysis Assistant',
      department: 'Legal',
      problem: 'Legal team review takes 3 weeks per contract. With 50+ contracts per month, this creates significant bottlenecks.',
      solution: 'AI contract review tool that identifies risks, flags non-standard clauses, and summarises key terms for lawyer review.',
      stage: 'Assessment',
      numUsers: 20,
      businessImpact: 9, technicalComplexity: 7, dataAvailability: 5, adoptionPotential: 6, implementationEffort: 8,
      implementationCost: 2000000, operatingCost: 600000, annualSavings: 6000000,
      manualHoursPerMonth: 600, timeSavingsPercent: 40,
      dataSensitivity: 'Sensitive', humanOversightRequired: true,
    },
    {
      name: 'Marketing Content Assistant',
      department: 'Marketing',
      problem: 'Content creation is a bottleneck with 2-week average delays. Team cannot produce enough personalised content at scale.',
      solution: 'AI content generation assistant for blog posts, social media, email campaigns with brand voice and tone guidelines.',
      stage: 'Idea',
      numUsers: 50,
      businessImpact: 6, technicalComplexity: 3, dataAvailability: 7, adoptionPotential: 8, implementationEffort: 3,
      implementationCost: 250000, operatingCost: 90000, annualSavings: 750000,
      manualHoursPerMonth: 400, timeSavingsPercent: 50,
      dataSensitivity: 'Internal', humanOversightRequired: false,
    },
    {
      name: 'Internal Document Search',
      department: 'IT',
      problem: 'Employees cannot find relevant documents across SharePoint, Confluence, and email. Average search time is 20 minutes per query.',
      solution: 'Semantic search engine using AI embeddings to search across all document repositories with natural language queries.',
      stage: 'PoC',
      numUsers: 1200,
      businessImpact: 5, technicalComplexity: 4, dataAvailability: 9, adoptionPotential: 8, implementationEffort: 4,
      implementationCost: 400000, operatingCost: 150000, annualSavings: 1200000,
      manualHoursPerMonth: 2400, timeSavingsPercent: 55,
      dataSensitivity: 'Confidential', humanOversightRequired: false,
    },
    {
      name: 'Developer Code Assistant',
      department: 'Engineering',
      problem: 'Developers spend 30% of their time writing boilerplate code, unit tests, and documentation, reducing time for complex features.',
      solution: 'AI coding assistant integrated into IDE to generate boilerplate, suggest completions, write unit tests, and document code.',
      stage: 'Pilot',
      numUsers: 350,
      businessImpact: 8, technicalComplexity: 4, dataAvailability: 7, adoptionPotential: 9, implementationEffort: 4,
      implementationCost: 700000, operatingCost: 240000, annualSavings: 2400000,
      manualHoursPerMonth: 2800, timeSavingsPercent: 30,
      dataSensitivity: 'Confidential', humanOversightRequired: false,
    },
  ];

  for (const uc of rawUseCases) {
    const oppScore = calculateOpportunityScore(uc);

    const existing = await prisma.useCase.findFirst({ where: { name: uc.name } });
    if (existing) {
      console.log(`  ⏭  Skipping existing: ${uc.name}`);
      continue;
    }

    const createdUc = await prisma.useCase.create({
      data: {
        ...uc,
        priorityScore: oppScore.score,
        priority: oppScore.priority,
        recommendation: oppScore.recommendation,
      }
    });

    console.log(`  ✅ Created: ${uc.name} (score: ${oppScore.score}, priority: ${oppScore.priority})`);

    // Create risk assessments for 5 use cases
    const riskDefaults = {
      'Contract Analysis Assistant': {
        dataSensitivity: 'Sensitive', dataLeakageRisk: 8, promptInjectionRisk: 6, unauthorizedAccessRisk: 7, excessivePermissionsRisk: 5,
        hallucinationRisk: 8, biasRisk: 4, reliabilityRisk: 7, explainabilityRisk: 8,
        financialImpactRisk: 9, customerImpactRisk: 3, regulatoryImpactRisk: 9, humanOversightRequired: true
      },
      'Customer Support Copilot': {
        dataSensitivity: 'Confidential', dataLeakageRisk: 6, promptInjectionRisk: 7, unauthorizedAccessRisk: 5, excessivePermissionsRisk: 4,
        hallucinationRisk: 7, biasRisk: 5, reliabilityRisk: 6, explainabilityRisk: 5,
        financialImpactRisk: 7, customerImpactRisk: 9, regulatoryImpactRisk: 4, humanOversightRequired: true
      },
      'Invoice Data Extraction': {
        dataSensitivity: 'Confidential', dataLeakageRisk: 5, promptInjectionRisk: 3, unauthorizedAccessRisk: 6, excessivePermissionsRisk: 4,
        hallucinationRisk: 6, biasRisk: 2, reliabilityRisk: 5, explainabilityRisk: 6,
        financialImpactRisk: 8, customerImpactRisk: 2, regulatoryImpactRisk: 5, humanOversightRequired: true
      },
      'HR Knowledge Assistant': {
        dataSensitivity: 'Internal', dataLeakageRisk: 3, promptInjectionRisk: 4, unauthorizedAccessRisk: 4, excessivePermissionsRisk: 3,
        hallucinationRisk: 5, biasRisk: 3, reliabilityRisk: 4, explainabilityRisk: 4,
        financialImpactRisk: 3, customerImpactRisk: 2, regulatoryImpactRisk: 2, humanOversightRequired: false
      },
      'Developer Code Assistant': {
        dataSensitivity: 'Confidential', dataLeakageRisk: 6, promptInjectionRisk: 4, unauthorizedAccessRisk: 5, excessivePermissionsRisk: 4,
        hallucinationRisk: 6, biasRisk: 2, reliabilityRisk: 5, explainabilityRisk: 4,
        financialImpactRisk: 4, customerImpactRisk: 2, regulatoryImpactRisk: 3, humanOversightRequired: false
      }
    };

    if (riskDefaults[uc.name]) {
      const rd = riskDefaults[uc.name];
      const riskScore = calculateRiskScore(rd);
      await prisma.riskAssessment.create({
        data: {
          useCaseId: createdUc.id,
          ...rd,
          ...riskScore.breakdown,
          totalRiskScore: riskScore.totalRiskScore,
          riskLevel: riskScore.riskLevel,
          recommendations: riskScore.recommendations,
        }
      });
      console.log(`    🛡  Risk assessed: ${uc.name} → ${riskScore.riskLevel} (${riskScore.totalRiskScore})`);
    }
  }

  // Seed sample documents (metadata only — no actual files needed for demo)
  const sampleDocs = [
    { name: 'HR Policy.pdf', originalName: 'HR Policy.pdf', filePath: '/uploads/demo-hr-policy.pdf', fileSize: 524288, status: 'Ready', chunkCount: 42, pageCount: 18 },
    { name: 'Leave Policy.pdf', originalName: 'Leave Policy.pdf', filePath: '/uploads/demo-leave-policy.pdf', fileSize: 196608, status: 'Ready', chunkCount: 18, pageCount: 8 },
    { name: 'IT Security Policy.pdf', originalName: 'IT Security Policy.pdf', filePath: '/uploads/demo-it-security.pdf', fileSize: 393216, status: 'Ready', chunkCount: 31, pageCount: 14 },
  ];

  for (const doc of sampleDocs) {
    const existingDoc = await prisma.document.findFirst({ where: { name: doc.name } });
    if (!existingDoc) {
      await prisma.document.create({ data: doc });
      console.log(`  📄 Document seeded: ${doc.name}`);
    }
  }

  console.log('\n🎉 Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo credentials:');
  console.log('  Admin: admin@ai360.demo / Demo@1234');
  console.log('  User:  priya@ai360.demo / Demo@1234');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
