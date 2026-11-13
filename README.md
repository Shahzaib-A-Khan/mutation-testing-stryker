# Mutation Testing with Stryker

![Mutation Testing](https://github.com/Shahzaib-A-Khan/mutation-testing-stryker/actions/workflows/mutation.yml/badge.svg)

Measures how good a test suite really is by injecting bugs into the code and checking whether the tests notice. Uses Stryker with Vitest on a small pricing module, and shows a test suite going from a 61% to a 100% mutation score.

## The story
| | First draft | Second draft |

| Tests | 8 | 14 |
| Line, branch and function coverage (first draft) | 100% | not re-measured |
| Mutation score | 61.22% | 100% |
| Mutants killed and survived | 30 and 19 | 49 and 0 |

Code coverage said the first draft was complete, yet 19 of 49 injected bugs went unnoticed.

## Why the first draft missed bugs
| Kind of survivor | Example | Why the tests missed it |
| --- | --- | --- |
| Boundary changes | >= changed to > | No test sat exactly on 50, 100, 1 kg or 5 kg |
| Conditions forced true or false | if (code === 'SAVE10') changed to if (true) | No test used an unknown promo code or a case where the condition should be false |
| Arithmetic in the order total | 1 - rate changed to 1 + rate, rounding division changed to a multiplication | The only check was greater than 0 |

## The gate
Stryker has a break threshold of 90%, so it exits with an error below that score.
- The strong tests pass the gate with 100%.
- The first-draft tests are kept in tests-weak/ and must fail the gate. A CI job runs Stryker on them and requires a non-zero exit code and a score below 90%, so the gate is proven able to fail.

## Run it
npm ci
npm run test
npm run coverage
npm run mutation
npm run mutation:weak

The HTML report is written to reports/mutation/index.html.

## Notes
- A perfect score on 49 mutants in one small file does not mean the tests are perfect. It means they caught every bug Stryker's standard mutations could inject here.
- Some mutants are equivalent: they change the code without changing its behavior, so no test can kill them. None showed up in this module.
- Mutation testing is slow on large codebases, so it is best aimed at business-critical logic.

## Project structure
- src/pricing.ts: the code under test
- tests/: the strong tests
- tests-weak/: the first-draft tests, kept as evidence
- stryker.config.json and stryker.weak.config.json: Stryker settings
- scripts/verify-weak.mjs: checks the weak run's score and survivors
- .github/workflows/mutation.yml: CI workflow