import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Text } from "@react-three/drei";
import { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import Player from "./Player";
import Environment from "./Environment";
import TreasureChest from "./TreasureChest";
import ParkourChallenge from "./ParkourChallenge";
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
    mapSize,
    collectTreasure,
    completeLevel,
    weatherEvent,
    powerUpSpawn,
    parkourState,
    checkWeatherEvent,
    checkPowerUpSpawn,
    checkParkourSpawn,
    startParkour,
    completeParkour,
    failParkour
  } = useProbabilityGame();
  
  const { playHit, playSuccess } = useAudio();
  const [subscribe, getState] = useKeyboardControls<Controls>();
  const playerRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.Camera>(null);

  // Weather, power-up, and parkour timers
  const weatherTimer = useRef(0);
  const powerUpTimer = useRef(0);
  const parkourTimer = useRef(0);

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

    // Update parkour timer and check for parkour spawns
    parkourTimer.current += delta;
    if (parkourTimer.current > 7) { // Check every 7 seconds
      checkParkourSpawn();
      parkourTimer.current = 0;
    }

    // Check if level is complete
    if (treasuresFound.length >= treasurePositions.length) {
      completeLevel();
      playSuccess();
    }

    // Check for parkour portal interaction
    if (parkourState.available && playerRef.current) {
      const playerPos = playerRef.current.position;
      const portalDistance = Math.sqrt(
        Math.pow(playerPos.x - 0, 2) + 
        Math.pow(playerPos.z - 18, 2)
      );
      if (portalDistance < 4) {
        startParkour();
      }
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
      <Environment weatherEvent={weatherEvent} mapSize={mapSize} />
      
      {/* Player */}
      <Player ref={playerRef} powerUpActive={powerUpSpawn.active} mapSize={mapSize} />
      
      {/* Treasure Chests */}
      {treasurePositions.map((pos, index) => (
        <TreasureChest
          key={`treasure-${currentLevel}-${index}`}
          position={[pos.x, 0.5, pos.z]}
          probability={pos.probability}
          onCollect={() => handleTreasureCollect(`treasure-${index}`, pos.probability)}
          collected={treasuresFound.includes(`treasure-${index}`)}
          playerRef={playerRef}
        />
      ))}
      
      {/* Power-up indicator */}
      {powerUpSpawn.active && (
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="gold" emissive="orange" emissiveIntensity={0.3} />
        </mesh>
      )}

      {/* Parkour Challenge Portal */}
      {parkourState.available && (
        <Suspense fallback={null}>
          <group>
            {/* Portal */}
            <mesh position={[0, 3, 18]} castShadow>
              <cylinderGeometry args={[3, 3, 6]} />
              <meshStandardMaterial 
                color="#9966FF" 
                transparent 
                opacity={0.7}
                emissive="#6633CC"
                emissiveIntensity={0.3}
              />
            </mesh>
            
            {/* Portal glow effect */}
            <pointLight
              position={[0, 3, 18]}
              intensity={2}
              color="#9966FF"
              distance={10}
            />

            {/* Portal info display */}
            <Text
              position={[0, 6, 18]}
              fontSize={0.6}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              billboard
              outlineWidth={0.03}
              outlineColor="#000000"
            >
              Parkour Challenge {currentLevel}
            </Text>
            
            <Text
              position={[0, 5, 18]}
              fontSize={0.4}
              color="#FFFF99"
              anchorX="center"
              anchorY="middle"
              billboard
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              Required to advance!
            </Text>
            
            <Text
              position={[0, 4, 18]}
              fontSize={0.3}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
              billboard
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              Walk close to enter
            </Text>
          </group>
        </Suspense>
      )}
    </>
  );
}
