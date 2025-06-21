export interface ProbabilityFormat {
  fraction: string;
  percentage: string;
  decimal: string;
}

export function formatProbability(probability: number): ProbabilityFormat {
  const percentage = Math.round(probability * 100);
  const decimal = probability.toFixed(2);
  
  // Convert to common fractions
  let fraction = `${Math.round(probability * 100)}/100`;
  
  // Common fraction conversions
  const fractionMap: { [key: number]: string } = {
    0.5: "1/2",
    0.25: "1/4",
    0.75: "3/4",
    0.33: "1/3",
    0.333: "1/3",
    0.67: "2/3",
    0.667: "2/3",
    0.2: "1/5",
    0.4: "2/5",
    0.6: "3/5",
    0.8: "4/5",
    0.1: "1/10",
    0.15: "3/20",
    0.3: "3/10"
  };

  // Check for exact matches first
  if (fractionMap[probability]) {
    fraction = fractionMap[probability];
  } else {
    // Check for approximate matches (within 0.01)
    for (const [decimal, frac] of Object.entries(fractionMap)) {
      if (Math.abs(probability - parseFloat(decimal)) < 0.01) {
        fraction = frac;
        break;
      }
    }
  }

  return {
    fraction,
    percentage: `${percentage}%`,
    decimal
  };
}

export function rollProbability(probability: number): boolean {
  const roll = Math.random();
  const success = roll <= probability;
  
  console.log(`Probability roll: ${roll.toFixed(3)} vs ${probability.toFixed(3)} = ${success ? 'SUCCESS' : 'FAIL'}`);
  
  return success;
}

export function calculateExpectedValue(outcomes: Array<{ value: number; probability: number }>): number {
  return outcomes.reduce((sum, outcome) => sum + (outcome.value * outcome.probability), 0);
}

export function calculateCombinedProbability(probabilities: number[], type: 'and' | 'or'): number {
  if (type === 'and') {
    // P(A and B) = P(A) × P(B) for independent events
    return probabilities.reduce((product, p) => product * p, 1);
  } else {
    // P(A or B) = P(A) + P(B) - P(A and B) for independent events
    // For multiple events: 1 - P(none occur)
    const noneOccur = probabilities.reduce((product, p) => product * (1 - p), 1);
    return 1 - noneOccur;
  }
}

export interface ProbabilityEvent {
  type: string;
  probability: number;
  success: boolean;
  timestamp: number;
}

export function analyzeProbabilityEvents(events: ProbabilityEvent[]): {
  successRate: number;
  expectedSuccessRate: number;
  deviation: number;
  totalEvents: number;
} {
  if (events.length === 0) {
    return {
      successRate: 0,
      expectedSuccessRate: 0,
      deviation: 0,
      totalEvents: 0
    };
  }

  const successfulEvents = events.filter(e => e.success).length;
  const successRate = successfulEvents / events.length;
  
  // Calculate weighted expected success rate
  const expectedSuccessRate = events.reduce((sum, event) => sum + event.probability, 0) / events.length;
  
  const deviation = Math.abs(successRate - expectedSuccessRate);

  return {
    successRate,
    expectedSuccessRate,
    deviation,
    totalEvents: events.length
  };
}

export const DIFFICULTY_SETTINGS = {
  1: {
    name: "Easy",
    treasureProbabilities: [0.5, 0.75, 0.25, 0.6, 0.8],
    powerUpProbability: 0.4,
    weatherChangeFrequency: 8000, // 8 seconds
    description: "Higher probabilities, more frequent power-ups"
  },
  2: {
    name: "Medium", 
    treasureProbabilities: [0.33, 0.5, 0.67, 0.2, 0.75],
    powerUpProbability: 0.25,
    weatherChangeFrequency: 6000, // 6 seconds
    description: "Moderate probabilities, balanced gameplay"
  },
  3: {
    name: "Hard",
    treasureProbabilities: [0.25, 0.4, 0.6, 0.15, 0.8],
    powerUpProbability: 0.15,
    weatherChangeFrequency: 4000, // 4 seconds
    description: "Lower probabilities, rare power-ups, frequent weather changes"
  }
};
