import { readFileSync } from 'node:fs';

const report = JSON.parse(readFileSync('reports/mutation-weak/mutation.json', 'utf8'));
const counts = {};
for (const file of Object.values(report.files)) {
  for (const m of file.mutants) counts[m.status] = (counts[m.status] || 0) + 1;
}
console.log('weak-test mutant statuses:', counts);

const killed = (counts.Killed || 0) + (counts.Timeout || 0);
const survived = (counts.Survived || 0) + (counts.NoCoverage || 0);
const score = (100 * killed) / (killed + survived);
console.log(`weak-test mutation score: ${score.toFixed(2)}%`);

if (score >= 90 || survived === 0) {
  console.error('The weak tests should score below the 90% gate, so the gate is not proving anything.');
  process.exit(1);
}