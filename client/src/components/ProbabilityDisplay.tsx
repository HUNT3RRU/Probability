import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProbabilityGame } from "../lib/stores/useProbabilityGame";

export default function ProbabilityDisplay() {
  const { currentLevel, weatherEvent, powerUpSpawn } = useProbabilityGame();

  const levelProbabilities = {
    1: [
      { type: "Treasure Chest A", fraction: "1/2", percent: "50%", decimal: "0.50" },
      { type: "Treasure Chest B", fraction: "3/4", percent: "75%", decimal: "0.75" },
      { type: "Treasure Chest C", fraction: "1/4", percent: "25%", decimal: "0.25" },
      { type: "Speed Power-up", fraction: "2/5", percent: "40%", decimal: "0.40" },
    ],
    2: [
      { type: "Treasure Chest A", fraction: "1/3", percent: "33%", decimal: "0.33" },
      { type: "Treasure Chest B", fraction: "1/2", percent: "50%", decimal: "0.50" },
      { type: "Treasure Chest C", fraction: "2/3", percent: "67%", decimal: "0.67" },
      { type: "Speed Power-up", fraction: "1/4", percent: "25%", decimal: "0.25" },
    ],
    3: [
      { type: "Treasure Chest A", fraction: "1/4", percent: "25%", decimal: "0.25" },
      { type: "Treasure Chest B", fraction: "2/5", percent: "40%", decimal: "0.40" },
      { type: "Treasure Chest C", fraction: "3/5", percent: "60%", decimal: "0.60" },
      { type: "Speed Power-up", fraction: "3/20", percent: "15%", decimal: "0.15" },
    ]
  };

  const weatherProbabilities = [
    { type: "Rain", fraction: "3/10", percent: "30%", decimal: "0.30" },
    { type: "Sunny", fraction: "1/2", percent: "50%", decimal: "0.50" },
    { type: "Cloudy", fraction: "1/5", percent: "20%", decimal: "0.20" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <Card className="bg-white bg-opacity-95 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-purple-800">
            📊 Probability Reference
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Level Probabilities */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Level {currentLevel} Probabilities:</h4>
            <div className="space-y-1">
              {levelProbabilities[currentLevel as keyof typeof levelProbabilities]?.map((item, index) => (
                <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                  <div className="font-medium text-gray-700">{item.type}</div>
                  <div className="flex gap-2 text-gray-600">
                    <span>{item.fraction}</span>
                    <span>|</span>
                    <span>{item.percent}</span>
                    <span>|</span>
                    <span>{item.decimal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Probabilities */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Weather Events:</h4>
            <div className="space-y-1">
              {weatherProbabilities.map((weather, index) => (
                <div 
                  key={index} 
                  className={`text-xs p-2 rounded ${
                    weatherEvent.active && weatherEvent.type.toLowerCase() === weather.type.toLowerCase()
                      ? 'bg-yellow-100 border border-yellow-300'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-700">
                    {weather.type}
                    {weatherEvent.active && weatherEvent.type.toLowerCase() === weather.type.toLowerCase() && " ✨"}
                  </div>
                  <div className="flex gap-2 text-gray-600">
                    <span>{weather.fraction}</span>
                    <span>|</span>
                    <span>{weather.percent}</span>
                    <span>|</span>
                    <span>{weather.decimal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Note */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Remember:</strong> All three formats (fraction, percentage, decimal) 
              represent the same probability - just expressed differently!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
