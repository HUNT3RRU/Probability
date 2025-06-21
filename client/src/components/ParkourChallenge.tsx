import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useProbabilityGame } from "../lib/stores/useProbabilityGame";
import ParkourPlatform from "./ParkourPlatform";
import * as THREE from "three";

interface ParkourChallengeProps {
  parkourLevel: number;
  onComplete: () => void;
  onFail: () => void;
}

export default function ParkourChallenge({ parkourLevel, onComplete, onFail }: ParkourChallengeProps) {
  const { currentLevel } = useProbabilityGame();
  const playerDetectionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [playerOnPlatform, setPlayerOnPlatform] = useState(false);
  const [timeOnFinish, setTimeOnFinish] = useState(0);
  const [showHint, setShowHint] = useState(true);

  // Generate platforms based on parkour level difficulty
  const generatePlatforms = () => {
    const platforms = [];
    const baseY = 2;
    
    switch (parkourLevel) {
      case 1: // Easy parkour - straight line with some gaps
        platforms.push(
          { position: [0, baseY, -5] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [0, baseY + 1, -10] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [3, baseY + 2, -15] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [0, baseY + 3, -20] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [0, baseY + 4, -25] as [number, number, number], size: [3, 0.5, 3] as [number, number, number], isFinish: true }
        );
        break;
        
      case 2: // Medium parkour - zigzag with moving platforms
        platforms.push(
          { position: [0, baseY, -5] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [-4, baseY + 1, -10] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [4, baseY + 2, -15] as [number, number, number], size: [2, 0.5, 2] as [number, number, number], isMoving: true, moveRange: 2 },
          { position: [-3, baseY + 3, -20] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
          { position: [0, baseY + 4, -25] as [number, number, number], size: [2, 0.5, 2] as [number, number, number], isMoving: true, moveRange: 1.5 },
          { position: [0, baseY + 5, -30] as [number, number, number], size: [3, 0.5, 3] as [number, number, number], isFinish: true }
        );
        break;
        
      case 3: // Hard parkour - complex path with multiple moving platforms
        platforms.push(
          { position: [0, baseY, -5] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number] },
          { position: [-5, baseY + 1, -10] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number], isMoving: true, moveRange: 3 },
          { position: [5, baseY + 2, -15] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number] },
          { position: [0, baseY + 3, -20] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number], isMoving: true, moveRange: 2 },
          { position: [-6, baseY + 4, -25] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number], isMoving: true, moveRange: 2.5 },
          { position: [6, baseY + 5, -30] as [number, number, number], size: [1.5, 0.5, 1.5] as [number, number, number] },
          { position: [0, baseY + 6, -35] as [number, number, number], size: [3, 0.5, 3] as [number, number, number], isFinish: true }
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
    if (!finishPlatform) return;
    
    // Check if player is near the finish platform
    const camera = state.camera;
    const finishPos = finishPlatform.position;
    const distance = camera.position.distanceTo(new THREE.Vector3(finishPos[0], finishPos[1], finishPos[2]));
    
    if (distance < 3 && camera.position.y > finishPos[1] - 1) {
      if (!playerOnPlatform) {
        setPlayerOnPlatform(true);
        setTimeOnFinish(0);
      } else {
        setTimeOnFinish(prev => prev + 1);
        if (timeOnFinish > 60) { // 1 second at 60fps
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

  const parkourProbability = parkourLevel === 1 ? "1/4 (25%)" : 
                            parkourLevel === 2 ? "1/6 (17%)" : 
                            "1/10 (10%)";

  return (
    <group>
      {/* Parkour entrance portal */}
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

      {/* Info display */}
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
        Parkour Challenge {parkourLevel}
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
        Probability: {parkourProbability}
      </Text>

      {showHint && (
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
          Jump through platforms to reach the finish!
        </Text>
      )}

      {/* Parkour platforms */}
      {platforms.map((platform, index) => (
        <ParkourPlatform
          key={index}
          position={platform.position}
          size={platform.size}
          isFinish={platform.isFinish}
          isMoving={platform.isMoving}
          moveRange={platform.moveRange}
          color={platform.isFinish ? "#FFD700" : "#8B4513"}
        />
      ))}

      {/* Progress indicator on finish platform */}
      {playerOnPlatform && finishPlatform && (
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
      )}

      {/* Boundary walls for parkour area */}
      <mesh position={[0, 5, -40]} castShadow>
        <boxGeometry args={[30, 10, 1]} />
        <meshStandardMaterial color="#654321" transparent opacity={0.8} />
      </mesh>
      <mesh position={[15, 5, -20]} castShadow>
        <boxGeometry args={[1, 10, 40]} />
        <meshStandardMaterial color="#654321" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-15, 5, -20]} castShadow>
        <boxGeometry args={[1, 10, 40]} />
        <meshStandardMaterial color="#654321" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}