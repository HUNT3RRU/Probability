import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProbabilityGame } from "../lib/stores/useProbabilityGame";

export default function Tutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const { startGame, setDifficulty } = useProbabilityGame();

  const tutorialSteps = [
    {
      title: "Welcome to Probability Adventure! 🎮",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Learn probability through exciting 3D gameplay! Explore a magical world 
            where math concepts come to life.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Game Objectives:</h4>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Collect treasures with different probability chances</li>
              <li>• Experience random weather events</li>
              <li>• Find power-ups that appear by chance</li>
              <li>• Learn fractions, percentages, and decimals</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Understanding Probability 📊",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Probability tells us how likely something is to happen. We express it in three ways:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <h4 className="font-semibold text-green-800">Fraction</h4>
              <p className="text-2xl text-green-600">1/2</p>
              <p className="text-sm text-green-700">1 out of 2 chances</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <h4 className="font-semibold text-blue-800">Percentage</h4>
              <p className="text-2xl text-blue-600">50%</p>
              <p className="text-sm text-blue-700">50 out of 100</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <h4 className="font-semibold text-purple-800">Decimal</h4>
              <p className="text-2xl text-purple-600">0.50</p>
              <p className="text-sm text-purple-700">Half chance</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            All three ways show the same thing - a 50% chance of something happening!
          </p>
        </div>
      )
    },
    {
      title: "Game Mechanics 🎯",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">🏆 Treasure Chests</h4>
              <p className="text-sm text-yellow-700">
                Each chest shows its probability of containing valuable treasure. 
                Higher probability = more likely to find good loot!
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🌦️ Weather Events</h4>
              <p className="text-sm text-blue-700">
                Random weather changes with known probabilities. Rain (30%), 
                Sunny (50%), Cloudy (20%) - which will you experience?
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">⚡ Power-ups</h4>
              <p className="text-sm text-purple-700">
                Speed boosts appear randomly! Easy (40%), Medium (25%), 
                Hard (15%) - harder levels = rarer power-ups!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Controls & How to Play 🎮",
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Game Controls:</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="outline">WASD</Badge>
                <span>Move around</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Arrow Keys</Badge>
                <span>Alternative movement</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Q</Badge>
                <span>Jump</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Walk Close</Badge>
                <span>Auto-collect treasures</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">How to Win:</h4>
            <ol className="text-green-700 space-y-1 text-sm">
              <li>1. Walk around the 3D world to explore</li>
              <li>2. Approach treasure chests to collect them automatically</li>
              <li>3. Observe the probability displays above each chest</li>
              <li>4. Collect all 5 treasures to complete the level</li>
              <li>5. Learn from the random events that occur!</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: "Choose Your Difficulty 🎚️",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 text-center">
            Select your difficulty level to begin your probability adventure!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                setDifficulty(1);
                startGame();
              }}
              className="h-24 bg-green-500 hover:bg-green-600 text-white flex flex-col"
            >
              <span className="text-lg font-bold">Easy</span>
              <span className="text-sm">Higher probabilities</span>
              <span className="text-xs">Perfect for beginners!</span>
            </Button>
            <Button
              onClick={() => {
                setDifficulty(2);
                startGame();
              }}
              className="h-24 bg-yellow-500 hover:bg-yellow-600 text-white flex flex-col"
            >
              <span className="text-lg font-bold">Medium</span>
              <span className="text-sm">Moderate probabilities</span>
              <span className="text-xs">Good challenge level</span>
            </Button>
            <Button
              onClick={() => {
                setDifficulty(3);
                startGame();
              }}
              className="h-24 bg-red-500 hover:bg-red-600 text-white flex flex-col"
            >
              <span className="text-lg font-bold">Hard</span>
              <span className="text-sm">Lower probabilities</span>
              <span className="text-xs">For probability experts!</span>
            </Button>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <div className="flex justify-center mt-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 mx-1 rounded-full ${
                  index === currentStep ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {currentStepData.content}
          
          {currentStep < tutorialSteps.length - 1 && (
            <div className="flex justify-between mt-6">
              <Button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                variant="outline"
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
