import { useRef, useEffect, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useKeyboardControls } from "@react-three/drei";
import { useProbabilityGame } from "../lib/stores/useProbabilityGame";
import ParkourPlatform from "./ParkourPlatform";
import Player from "./Player";
import * as THREE from "three";

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  interact = 'interact',
  jump = 'jump'
}

interface ParkourChallengeProps {
  parkourLevel: number;
  onComplete: () => void;
  onFail: () => void;
}

export default function ParkourChallenge({ parkourLevel, onComplete, onFail }: ParkourChallengeProps) {
  const { currentLevel } = useProbabilityGame();
  const playerRef = useRef<THREE.Group>(null);
  const [playerOnPlatform, setPlayerOnPlatform] = useState(false);
  const [timeOnFinish, setTimeOnFinish] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [subscribe, getState] = useKeyboardControls<Controls>();

  // Generate platforms based on parkour level difficulty
  const generatePlatforms = () => {
    const platforms = [];
    const baseY = 3;
    
    switch (parkourLevel) {
      case 1: // Easy parkour - straight line with some gaps
        platforms.push(
          { position: [0, baseY, 0] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [4, baseY + 1, -4] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [0, baseY + 2, -8] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [-4, baseY + 3, -12] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [0, baseY + 4, -16] as [number, number, number], size: [3, 0.5, 3] as [number, number, number], isFinish: true }
        );
        break;
        
      case 2: // Medium parkour - zigzag with moving platforms
        platforms.push(
          { position: [0, baseY, 0] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [-5, baseY + 1, -5] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [5, baseY + 2, -10] as [number, number, number], size: [2, 0.5, 2] as [number, number, number], isMoving: true, moveRange: 2 },
          { position: [-4, baseY + 3, -15] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [0, baseY + 4, -20] as [number, number, number], size: [2, 0.5, 2] as [number, number, number], isMoving: true, moveRange: 1.5 },
          { position: [0, baseY + 5, -25] as [number, number, number], size: [3, 0.5, 3] as [number, number, number], isFinish: true }
        );
        break;
        
      case 3: // Hard parkour - complex path with multiple moving platforms
        platforms.push(
          { position: [0, baseY, 0] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number] },
          { position: [-6, baseY + 1, -5] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number], isMoving: true, moveRange: 3 },
          { position: [6, baseY + 2, -10] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number] },
          { position: [0, baseY + 3, -15] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number], isMoving: true, moveRange: 2 },
          { position: [-7, baseY + 4, -20] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number], isMoving: true, moveRange: 2.5 },
          { position: [7, baseY + 5, -25] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number] },
          { position: [0, baseY + 6, -30] as [number, number, number], size: [3, 0.5, 3] as [number, number, number], isFinish: true }
        );
        break;
        
      default:
        return [];
    }
    
    return platforms;
  };

  const platforms = generatePlatforms();
  const finishPlatform = platforms.find(p => p.isFinish);

  useFrame((state) => {
    if (!finishPlatform || !playerRef.current) return;
    
    // Check if player is near the finish platform
    const playerPos = playerRef.current.position;
    const finishPos = finishPlatform.position;
    const distance = playerPos.distanceTo(new THREE.Vector3(finishPos[0], finishPos[1], finishPos[2]));
    
    // Camera follow player - better positioning for parkour
    const idealPosition = new THREE.Vector3(
      playerPos.x + 5,
      playerPos.y + 10,
      playerPos.z + 15
    );
    state.camera.position.lerp(idealPosition, 0.1);
    state.camera.lookAt(new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z - 5));
    
    if (distance < 4 && playerPos.y > finishPos[1] - 2) {
      if (!playerOnPlatform) {
        console.log("Player reached finish platform!");
        setPlayerOnPlatform(true);
        setTimeOnFinish(0);
      } else {
        setTimeOnFinish(prev => prev + 1);
        if (timeOnFinish > 30) { // 0.5 second at 60fps
          console.log("Parkour completed!");
          onComplete();
        }
      }
    } else {
      setPlayerOnPlatform(false);
      setTimeOnFinish(0);
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const parkourProbability = "1/1 (100%)";

  return (
    <>
      {/* Ground plane for parkour area */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 60]} />
        <meshStandardMaterial color="#404040" />
      </mesh>

      {/* Player */}
      <Player ref={playerRef} powerUpActive={false} mapSize={50} platforms={platforms} />

      {/* Starting platform */}
      <mesh position={[0, 2, 8]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.5, 4]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>

      {/* Info display */}
      <Suspense fallback={null}>
        <Text
          position={[0, 6, 0]}
          fontSize={0.8}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          billboard
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          Parkour Challenge {parkourLevel}
        </Text>
        
        <Text
          position={[0, 5, 0]}
          fontSize={0.5}
          color="#FFFF99"
          anchorX="center"
          anchorY="middle"
          billboard
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Jump to the golden platform!
        </Text>

        {showHint && (
          <Text
            position={[0, 4, 0]}
            fontSize={0.4}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            billboard
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            Use Q to jump and WASD to move
          </Text>
        )}
      </Suspense>

      {/* Parkour platforms */}
      {platforms.map((platform, index) => (
        <ParkourPlatform
          key={index}
          position={platform.position}
          size={platform.size}
          isFinish={platform.isFinish || false}
          isMoving={platform.isMoving || false}
          moveRange={platform.moveRange || 0}
          color={platform.isFinish ? "#FFD700" : "#8B4513"}
        />
      ))}

      {/* Progress indicator on finish platform */}
      {playerOnPlatform && finishPlatform && (
        <Suspense fallback={null}>
          <Text
            position={[finishPlatform.position[0], finishPlatform.position[1] + 3, finishPlatform.position[2]]}
            fontSize={0.4}
            color="#00FF00"
            anchorX="center"
            anchorY="middle"
            billboard
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            Completing... {Math.round((timeOnFinish / 60) * 100)}%
          </Text>
        </Suspense>
      )}

      {/* Boundary walls for parkour area */}
      <mesh position={[0, 5, -30]} castShadow>
        <boxGeometry args={[50, 10, 1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[25, 5, -15]} castShadow>
        <boxGeometry args={[1, 10, 30]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[-25, 5, -15]} castShadow>
        <boxGeometry args={[1, 10, 30]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow>
        <boxGeometry args={[50, 10, 1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>

      {/* Exit portal when completed */}
      {playerOnPlatform && (
        <group>
          <mesh position={[0, 3, -25]} castShadow>
            <cylinderGeometry args={[2, 2, 4]} />
            <meshStandardMaterial 
              color="#00FF00" 
              transparent 
              opacity={0.7}
              emissive="#00AA00"
              emissiveIntensity={0.3}
            />
          </mesh>
          <pointLight
            position={[0, 3, -25]}
            intensity={1}
            color="#00FF00"
            distance={8}
          />
        </group>
      )}
    </>
  );
}