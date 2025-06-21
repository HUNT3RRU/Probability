import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import Player from "./Player";
import Environment from "./Environment";
import TreasureChest from "./TreasureChest";
import { useProbabilityGame } from "../lib/stores/useProbabilityGame";
import { useAudio } from "../lib/stores/useAudio";

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  interact = 'interact',
  jump = 'jump'
}

export default function Game() {
  const { 
    currentLevel, 
    score, 
    treasuresFound, 
    gamePhase,
    collectTreasure,
    completeLevel,
    weatherEvent,
    powerUpSpawn,
    checkWeatherEvent,
    checkPowerUpSpawn
  } = useProbabilityGame();
  
  const { playHit, playSuccess } = useAudio();
  const [subscribe, getState] = useKeyboardControls<Controls>();
  const playerRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.Camera>(null);

  // Weather and power-up timers
  const weatherTimer = useRef(0);
  const powerUpTimer = useRef(0);

  // Log controls for debugging
  useEffect(() => {
    const unsubscribe = subscribe(
      (state) => state,
      (controls) => {
        console.log("Controls changed:", controls);
      }
    );
    return unsubscribe;
  }, [subscribe]);

  // Generate treasure positions for current level
  const treasurePositions = [
    { x: 5, z: 5, probability: currentLevel === 1 ? 0.5 : currentLevel === 2 ? 0.33 : 0.25 },
    { x: -5, z: 5, probability: currentLevel === 1 ? 0.75 : currentLevel === 2 ? 0.5 : 0.4 },
    { x: 5, z: -5, probability: currentLevel === 1 ? 0.25 : currentLevel === 2 ? 0.66 : 0.6 },
    { x: -5, z: -5, probability: currentLevel === 1 ? 0.6 : currentLevel === 2 ? 0.2 : 0.15 },
    { x: 0, z: 8, probability: currentLevel === 1 ? 0.8 : currentLevel === 2 ? 0.75 : 0.8 },
  ];

  useFrame((state, delta) => {
    if (gamePhase !== 'playing') return;

    const controls = getState();
    
    // Update weather timer and check for weather events
    weatherTimer.current += delta;
    if (weatherTimer.current > 5) { // Check every 5 seconds
      checkWeatherEvent();
      weatherTimer.current = 0;
    }

    // Update power-up timer and check for power-up spawns
    powerUpTimer.current += delta;
    if (powerUpTimer.current > 3) { // Check every 3 seconds
      checkPowerUpSpawn();
      powerUpTimer.current = 0;
    }

    // Check if level is complete
    if (treasuresFound.length >= treasurePositions.length) {
      completeLevel();
      playSuccess();
    }

    // Camera follow player
    if (playerRef.current && state.camera) {
      const playerPosition = playerRef.current.position;
      const idealPosition = new THREE.Vector3(
        playerPosition.x,
        playerPosition.y + 8,
        playerPosition.z + 12
      );
      
      state.camera.position.lerp(idealPosition, 0.05);
      state.camera.lookAt(playerPosition);
    }
  });

  const handleTreasureCollect = (treasureId: string, probability: number) => {
    collectTreasure(treasureId, probability);
    playHit();
  };

  return (
    <>
      {/* Environment */}
      <Environment weatherEvent={weatherEvent} />
      
      {/* Player */}
      <Player ref={playerRef} powerUpActive={powerUpSpawn.active} />
      
      {/* Treasure Chests */}
      {treasurePositions.map((pos, index) => (
        <TreasureChest
          key={`treasure-${currentLevel}-${index}`}
          position={[pos.x, 0.5, pos.z]}
          probability={pos.probability}
          onCollect={() => handleTreasureCollect(`treasure-${index}`, pos.probability)}
          collected={treasuresFound.includes(`treasure-${index}`)}
        />
      ))}
      
      {/* Power-up indicator */}
      {powerUpSpawn.active && (
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="gold" emissive="orange" emissiveIntensity={0.3} />
        </mesh>
      )}
    </>
  );
}
