import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "tutorial" | "playing" | "paused" | "levelComplete" | "gameOver";

export interface WeatherEvent {
  active: boolean;
  type: "rain" | "sunny" | "cloudy";
  probability: number;
  duration: number;
}

export interface PowerUpSpawn {
  active: boolean;
  type: "speed" | "score" | "luck";
  probability: number;
  duration: number;
}

interface GameState {
  // Game state
  gamePhase: GamePhase;
  currentLevel: number;
  score: number;
  treasuresFound: string[];
  
  // Probability events
  weatherEvent: WeatherEvent;
  powerUpSpawn: PowerUpSpawn;
  
  // Statistics
  totalTreasuresCollected: number;
  probabilityEvents: Array<{
    type: string;
    probability: number;
    success: boolean;
    timestamp: number;
  }>;
  
  // Actions
  startGame: () => void;
  startTutorial: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  collectTreasure: (treasureId: string, probability: number) => void;
  nextLevel: () => void;
  restartLevel: () => void;
  completeLevel: () => void;
  setDifficulty: (level: number) => void;
  
  // Probability events
  checkWeatherEvent: () => void;
  checkPowerUpSpawn: () => void;
}

export const useProbabilityGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gamePhase: "tutorial",
    currentLevel: 1,
    score: 0,
    treasuresFound: [],
    
    weatherEvent: {
      active: false,
      type: "sunny",
      probability: 0,
      duration: 0
    },
    
    powerUpSpawn: {
      active: false,
      type: "speed",
      probability: 0,
      duration: 0
    },
    
    totalTreasuresCollected: 0,
    probabilityEvents: [],
    
    // Actions
    startGame: () => {
      console.log("Starting game");
      set({ 
        gamePhase: "playing",
        score: 0,
        treasuresFound: [],
        totalTreasuresCollected: 0,
        probabilityEvents: []
      });
    },
    
    startTutorial: () => {
      console.log("Starting tutorial");
      set({ 
        gamePhase: "tutorial",
        currentLevel: 1,
        score: 0,
        treasuresFound: [],
        totalTreasuresCollected: 0
      });
    },
    
    pauseGame: () => {
      const { gamePhase } = get();
      if (gamePhase === "playing") {
        set({ gamePhase: "paused" });
      }
    },
    
    resumeGame: () => {
      const { gamePhase } = get();
      if (gamePhase === "paused") {
        set({ gamePhase: "playing" });
      }
    },
    
    collectTreasure: (treasureId: string, probability: number) => {
      const { treasuresFound, score, probabilityEvents } = get();
      
      if (treasuresFound.includes(treasureId)) return;
      
      // Roll for treasure success
      const roll = Math.random();
      const success = roll <= probability;
      
      console.log(`Treasure ${treasureId}: Roll ${roll.toFixed(3)} vs ${probability.toFixed(3)} = ${success ? 'SUCCESS' : 'FAIL'}`);
      
      if (success) {
        const points = Math.round(100 / probability); // Rarer treasures worth more points
        
        set({
          treasuresFound: [...treasuresFound, treasureId],
          score: score + points,
          totalTreasuresCollected: get().totalTreasuresCollected + 1,
          probabilityEvents: [...probabilityEvents, {
            type: `treasure_${treasureId}`,
            probability,
            success: true,
            timestamp: Date.now()
          }]
        });
      } else {
        // Still track the failed attempt
        set({
          probabilityEvents: [...probabilityEvents, {
            type: `treasure_${treasureId}`,
            probability,
            success: false,
            timestamp: Date.now()
          }]
        });
      }
    },
    
    nextLevel: () => {
      const { currentLevel } = get();
      if (currentLevel < 3) {
        set({
          currentLevel: currentLevel + 1,
          treasuresFound: [],
          gamePhase: "playing"
        });
      }
    },
    
    restartLevel: () => {
      set({
        treasuresFound: [],
        gamePhase: "playing"
      });
    },
    
    completeLevel: () => {
      set({ gamePhase: "levelComplete" });
    },
    
    setDifficulty: (level: number) => {
      set({ currentLevel: level });
    },
    
    checkWeatherEvent: () => {
      const { weatherEvent } = get();
      
      // Don't check if weather is already active
      if (weatherEvent.active) return;
      
      // Weather probabilities
      const weatherTypes = [
        { type: "rain" as const, probability: 0.3 },
        { type: "sunny" as const, probability: 0.5 },
        { type: "cloudy" as const, probability: 0.2 }
      ];
      
      const roll = Math.random();
      let cumulativeProbability = 0;
      
      for (const weather of weatherTypes) {
        cumulativeProbability += weather.probability;
        if (roll <= cumulativeProbability) {
          console.log(`Weather event: ${weather.type} (${weather.probability * 100}%)`);
          
          set({
            weatherEvent: {
              active: true,
              type: weather.type,
              probability: weather.probability,
              duration: 5000 // 5 seconds
            },
            probabilityEvents: [...get().probabilityEvents, {
              type: `weather_${weather.type}`,
              probability: weather.probability,
              success: true,
              timestamp: Date.now()
            }]
          });
          
          // Clear weather after duration
          setTimeout(() => {
            set({
              weatherEvent: {
                active: false,
                type: "sunny",
                probability: 0,
                duration: 0
              }
            });
          }, 5000);
          
          break;
        }
      }
    },
    
    checkPowerUpSpawn: () => {
      const { powerUpSpawn, currentLevel } = get();
      
      // Don't check if power-up is already active
      if (powerUpSpawn.active) return;
      
      // Power-up probabilities based on difficulty level
      const powerUpProbabilities = {
        1: 0.4, // Easy: 40%
        2: 0.25, // Medium: 25%
        3: 0.15  // Hard: 15%
      };
      
      const probability = powerUpProbabilities[currentLevel as keyof typeof powerUpProbabilities] || 0.25;
      const roll = Math.random();
      
      if (roll <= probability) {
        console.log(`Power-up spawned! (${probability * 100}%)`);
        
        set({
          powerUpSpawn: {
            active: true,
            type: "speed",
            probability,
            duration: 8000 // 8 seconds
          },
          probabilityEvents: [...get().probabilityEvents, {
            type: "powerup_speed",
            probability,
            success: true,
            timestamp: Date.now()
          }]
        });
        
        // Clear power-up after duration
        setTimeout(() => {
          set({
            powerUpSpawn: {
              active: false,
              type: "speed",
              probability: 0,
              duration: 0
            }
          });
        }, 8000);
      }
    }
  }))
);
