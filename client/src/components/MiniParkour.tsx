import { useRef, useEffect, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useKeyboardControls } from "@react-three/drei";
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

interface MiniParkourProps {
  treasureId: string;
  onComplete: () => void;
  onFail: () => void;
}

export default function MiniParkour({ treasureId, onComplete, onFail }: MiniParkourProps) {
  const playerRef = useRef<THREE.Group>(null);
  const [playerOnFinish, setPlayerOnFinish] = useState(false);
  const [timeOnFinish, setTimeOnFinish] = useState(0);

  // Generate simple mini-parkour platforms (2-3 easy jumps)
  const generateMiniPlatforms = () => {
    const platforms = [
      // Starting platform
      { position: [0, 2, 5] as [number, number, number], size: [3, 0.5, 3] as [number, number, number] },
      // Jump platforms
      { position: [0, 3, 0] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
      { position: [4, 4, -4] as [number, number, number], size: [2, 0.5, 2] as [number, number, number] },
      // Finish platform with treasure
      { position: [0, 5, -8] as [number, number, number], size: [3, 0.5, 3] as [number, number, number], isFinish: true }
    ];
    return platforms;
  };

  const platforms = generateMiniPlatforms();
  const finishPlatform = platforms.find(p => p.isFinish);

  useFrame((state) => {
    if (!finishPlatform || !playerRef.current) return;
    
    const playerPos = playerRef.current.position;
    const finishPos = finishPlatform.position;
    const distance = playerPos.distanceTo(new THREE.Vector3(finishPos[0], finishPos[1], finishPos[2]));
    
    // Camera follow player
    const idealPosition = new THREE.Vector3(
      playerPos.x + 3,
      playerPos.y + 6,
      playerPos.z + 8
    );
    state.camera.position.lerp(idealPosition, 0.1);
    state.camera.lookAt(new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z - 2));
    
    if (distance < 3 && playerPos.y > finishPos[1] - 1) {
      if (!playerOnFinish) {
        setPlayerOnFinish(true);
        setTimeOnFinish(0);
      } else {
        setTimeOnFinish(prev => prev + 1);
        if (timeOnFinish > 30) { // 0.5 second
          onComplete();
        }
      }
    } else {
      setPlayerOnFinish(false);
      setTimeOnFinish(0);
    }
  });

  return (
    <>
      {/* Ground plane */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Player */}
      <Player ref={playerRef} powerUpActive={false} mapSize={20} platforms={platforms} />

      {/* Mini-parkour platforms */}
      {platforms.map((platform, index) => (
        <group key={index}>
          <mesh position={platform.position} castShadow receiveShadow>
            <boxGeometry args={platform.size} />
            <meshStandardMaterial 
              color={platform.isFinish ? "#FFD700" : "#8B4513"} 
              emissive={platform.isFinish ? "#FFA500" : "#000000"}
              emissiveIntensity={platform.isFinish ? 0.3 : 0}
            />
          </mesh>
          
          {platform.isFinish && (
            <Suspense fallback={null}>
              <Text
                position={[platform.position[0], platform.position[1] + 2, platform.position[2]]}
                fontSize={0.5}
                color="#FFD700"
                anchorX="center"
                anchorY="middle"
                billboard
                outlineWidth={0.03}
                outlineColor="#000000"
              >
                TREASURE!
              </Text>
            </Suspense>
          )}
        </group>
      ))}

      {/* Instructions */}
      <Suspense fallback={null}>
        <Text
          position={[0, 8, 0]}
          fontSize={0.6}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          billboard
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          Mini Parkour Challenge
        </Text>
        
        <Text
          position={[0, 7, 0]}
          fontSize={0.4}
          color="#FFFF99"
          anchorX="center"
          anchorY="middle"
          billboard
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Jump to the golden platform for your treasure!
        </Text>
      </Suspense>

      {/* Progress indicator */}
      {playerOnFinish && finishPlatform && (
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
            Collecting... {Math.round((timeOnFinish / 30) * 100)}%
          </Text>
        </Suspense>
      )}

      {/* Exit hint */}
      <Suspense fallback={null}>
        <Text
          position={[0, 1, 10]}
          fontSize={0.3}
          color="#CCCCCC"
          anchorX="center"
          anchorY="middle"
          billboard
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Walk backwards to exit if stuck
        </Text>
      </Suspense>
    </>
  );
}