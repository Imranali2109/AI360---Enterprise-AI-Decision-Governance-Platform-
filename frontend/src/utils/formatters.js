export function formatCurrencyINR(amount) {
  if (amount == null) return '₹0';
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} Lakh`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPercent(value, decimals = 1) {
  if (value == null) return '0%';
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value) {
  if (value == null) return '0';
  return value.toLocaleString('en-IN');
}

export function getPriorityColor(priority) {
  return { High: 'green', Medium: 'yellow', Low: 'gray' }[priority] || 'gray';
}

export function getRiskColor(risk) {
  return { Low: 'green', Medium: 'yellow', High: 'red' }[risk] || 'gray';
}

export function getStageColor(stage) {
  const map = {
    Idea: 'gray',
    Assessment: 'blue',
    PoC: 'purple',
    Pilot: 'orange',
    Production: 'green',
    Rejected: 'red'
  };
  return map[stage] || 'gray';
}
