import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProbabilityGame } from "../lib/stores/useProbabilityGame";
import { useAudio } from "../lib/stores/useAudio";
import ProbabilityDisplay from "./ProbabilityDisplay";

export default function GameUI() {
  const { 
    currentLevel, 
    score, 
    treasuresFound, 
    gamePhase, 
    weatherEvent,
    powerUpSpawn,
    parkourState,
    mapSize,
    nextLevel,
    restartLevel,
    startTutorial,
    pauseGame,
    resumeGame
  } = useProbabilityGame();
  
  const { isMuted, toggleMute } = useAudio();

  const levelProgress = Math.min((treasuresFound.length / 5) * 100, 100);

  if (gamePhase === 'levelComplete') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-96 bg-green-100 border-green-500">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Level Complete! 🎉</h2>
            <p className="text-green-700 mb-4">
              Congratulations! You've collected all treasures in Level {currentLevel}.
            </p>
            <p className="text-green-700 mb-6">
              Score: {score} points
            </p>
            <div className="flex gap-2">
              {currentLevel < 3 ? (
                <Button onClick={nextLevel} className="flex-1">
                  Next Level
                </Button>
              ) : (
                <Button onClick={startTutorial} className="flex-1">
                  Play Again
                </Button>
              )}
              <Button onClick={restartLevel} variant="outline">
                Replay Level
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gamePhase === 'paused') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-96 bg-white">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Paused</h2>
            <div className="flex gap-2">
              <Button onClick={resumeGame} className="flex-1">
                Resume
              </Button>
              <Button onClick={startTutorial} variant="outline">
                Main Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Top HUD */}
      <div className="fixed top-4 left-4 right-4 z-40 flex justify-between items-start">
        <Card className="bg-white bg-opacity-90 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Level {currentLevel}</p>
                <p className="text-lg font-bold text-blue-600">{score} points</p>
              </div>
              <div className="w-32">
                <p className="text-xs text-gray-500 mb-1">Progress</p>
                <Progress value={levelProgress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{treasuresFound.length}/5 treasures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button onClick={toggleMute} variant="outline" size="sm">
            {isMuted ? "🔇" : "🔊"}
          </Button>
          <Button onClick={pauseGame} variant="outline" size="sm">
            ⏸️ Pause
          </Button>
        </div>
      </div>

      {/* Weather Display */}
      {weatherEvent.active && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
          <Card className="bg-white bg-opacity-90 border-yellow-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {weatherEvent.type === 'rain' ? '🌧️' : 
                   weatherEvent.type === 'sunny' ? '☀️' : '☁️'}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 capitalize">
                    {weatherEvent.type} Weather
                  </p>
                  <p className="text-xs text-gray-600">
                    Probability: {Math.round(weatherEvent.probability * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Power-up Display */}
      {powerUpSpawn.active && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
          <Card className="bg-white bg-opacity-90 border-yellow-400">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-sm font-medium text-yellow-700">
                    Speed Boost Active!
                  </p>
                  <p className="text-xs text-yellow-600">
                    Probability: {Math.round(powerUpSpawn.probability * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls Help */}
      <div className="fixed bottom-4 left-4 z-40">
        <Card className="bg-black bg-opacity-70 border-gray-600">
          <CardContent className="p-3">
            <p className="text-white text-sm font-medium mb-2">Controls:</p>
            <div className="text-xs text-gray-300 space-y-1">
              <p>WASD / Arrow Keys: Move</p>
              <p>Q: Jump</p>
              <p>Walk near treasures to collect</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map size indicator */}
      {mapSize > 30 && (
        <div className="fixed top-4 right-1/4 z-40">
          <Card className="bg-white bg-opacity-90 border-green-200">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🗺️</span>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Expanded Map!
                  </p>
                  <p className="text-xs text-green-600">
                    Size: {mapSize}x{mapSize}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Parkour available indicator */}
      {parkourState.available && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40">
          <Card className="bg-white bg-opacity-90 border-purple-200 animate-pulse">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    Parkour Challenge Required!
                  </p>
                  <p className="text-xs text-purple-600">
                    Complete to advance to next level
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Probability Learning Panel */}
      <ProbabilityDisplay />
    </>
  );
}
