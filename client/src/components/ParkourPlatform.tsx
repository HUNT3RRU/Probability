import { useRef, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface ParkourPlatformProps {
  position: [number, number, number];
  size: [number, number, number];
  isFinish?: boolean;
  isMoving?: boolean;
  moveRange?: number;
  color?: string;
}

export default function ParkourPlatform({ 
  position, 
  size, 
  isFinish = false, 
  isMoving = false, 
  moveRange = 3,
  color = "#8B4513"
}: ParkourPlatformProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [originalX] = useState(position[0]);

  useFrame((state) => {
    if (!meshRef.current || !isMoving) return;
    
    // Moving platform oscillation
    const time = state.clock.elapsedTime;
    const newX = originalX + Math.sin(time * 2) * moveRange;
    meshRef.current.position.x = newX;
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        position={position} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={isFinish ? "#FFD700" : color} 
          metalness={isFinish ? 0.8 : 0.1}
          roughness={isFinish ? 0.2 : 0.8}
          emissive={isFinish ? "#FFA500" : "#000000"}
          emissiveIntensity={isFinish ? 0.3 : 0}
        />
      </mesh>
      
      {isFinish && (
        <>
          <Suspense fallback={null}>
            <Text
              position={[position[0], position[1] + 2, position[2]]}
              fontSize={0.5}
              color="#FFD700"
              anchorX="center"
              anchorY="middle"
              billboard
              outlineWidth={0.03}
              outlineColor="#000000"
            >
              FINISH!
            </Text>
          </Suspense>
          <pointLight
            position={[position[0], position[1] + 1, position[2]]}
            intensity={1}
            color="#FFD700"
            distance={8}
          />
        </>
      )}
    </group>
  );
}