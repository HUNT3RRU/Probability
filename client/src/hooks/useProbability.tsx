import { useState, useCallback } from "react";

export interface ProbabilityEvent {
  id: string;
  type: string;
  probability: number;
  occurred: boolean;
  timestamp?: number;
}

export function useProbability() {
  const [events, setEvents] = useState<ProbabilityEvent[]>([]);

  // Calculate probability and determine if event occurs
  const rollProbability = useCallback((probability: number): boolean => {
    const roll = Math.random();
    const success = roll <= probability;
    
    console.log(`Probability roll: ${roll.toFixed(3)} vs ${probability.toFixed(3)} = ${success ? 'SUCCESS' : 'FAIL'}`);
    
    return success;
  }, []);

  // Create a probability event with tracking
  const createEvent = useCallback((type: string, probability: number): ProbabilityEvent => {
    const event: ProbabilityEvent = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      probability,
      occurred: rollProbability(probability),
      timestamp: Date.now()
    };

    setEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events
    return event;
  }, [rollProbability]);

  // Get probability in different formats
  const formatProbability = useCallback((probability: number) => {
    const percentage = Math.round(probability * 100);
    const decimal = probability.toFixed(2);
    
    // Convert to common fractions
    let fraction = `${Math.round(probability * 100)}/100`;
    
    if (probability === 0.5) fraction = "1/2";
    else if (probability === 0.25) fraction = "1/4";
    else if (probability === 0.75) fraction = "3/4";
    else if (probability === 0.33 || probability === 0.333) fraction = "1/3";
    else if (probability === 0.67 || probability === 0.667) fraction = "2/3";
    else if (probability === 0.2) fraction = "1/5";
    else if (probability === 0.4) fraction = "2/5";
    else if (probability === 0.6) fraction = "3/5";
    else if (probability === 0.8) fraction = "4/5";
    else if (probability === 0.1) fraction = "1/10";
    else if (probability === 0.15) fraction = "3/20";
    else if (probability === 0.3) fraction = "3/10";

    return {
      fraction,
      percentage: `${percentage}%`,
      decimal
    };
  }, []);

  // Get statistics about recent events
  const getEventStats = useCallback(() => {
    const recentEvents = events.slice(-10);
    const successful = recentEvents.filter(e => e.occurred).length;
    const total = recentEvents.length;
    
    return {
      successRate: total > 0 ? successful / total : 0,
      totalEvents: total,
      successfulEvents: successful,
      recentEvents
    };
  }, [events]);

  return {
    rollProbability,
    createEvent,
    formatProbability,
    getEventStats,
    events
  };
}
