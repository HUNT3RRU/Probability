import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface TreasureChestProps {
  position: [number, number, number];
  probability: number;
  onCollect: () => void;
  collected: boolean;
}

export default function TreasureChest({ position, probability, onCollect, collected }: TreasureChestProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const playerDetectionRef = useRef<THREE.Mesh>(null);

  // Convert probability to different formats for display
  const probabilityPercent = Math.round(probability * 100);
  const probabilityFraction = probability === 0.5 ? "1/2" : 
                             probability === 0.33 ? "1/3" :
                             probability === 0.25 ? "1/4" :
                             probability === 0.75 ? "3/4" :
                             probability === 0.66 ? "2/3" :
                             probability === 0.6 ? "3/5" :
                             probability === 0.2 ? "1/5" :
                             probability === 0.15 ? "3/20" :
                             probability === 0.4 ? "2/5" :
                             probability === 0.8 ? "4/5" :
                             `${Math.round(probability * 100)}/100`;

  useFrame((state) => {
    if (!meshRef.current || collected) return;

    // Gentle floating animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    
    // Gentle rotation
    meshRef.current.rotation.y += 0.01;

    // Check for player collision
    const camera = state.camera;
    const distance = meshRef.current.position.distanceTo(camera.position);
    
    if (distance < 3 && !collected) {
      setHovered(true);
      // Auto-collect when player is close enough
      if (distance < 2) {
        onCollect();
      }
    } else {
      setHovered(false);
    }
  });

  if (collected) return null;

  return (
    <group ref={meshRef} position={position}>
      {/* Treasure chest base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial 
          color={hovered ? "#DAA520" : "#8B4513"} 
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Treasure chest lid */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.2, 1]} />
        <meshStandardMaterial 
          color={hovered ? "#FFD700" : "#CD853F"} 
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Probability display above chest */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color={hovered ? "#FFD700" : "#FFFFFF"}
        anchorX="center"
        anchorY="middle"
        billboard
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {probabilityFraction}
      </Text>
      
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color={hovered ? "#FFD700" : "#FFFFFF"}
        anchorX="center"
        anchorY="middle"
        billboard
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {probabilityPercent}% | {probability.toFixed(2)}
      </Text>

      {/* Interaction hint */}
      {hovered && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.3}
          color="#00FF00"
          anchorX="center"
          anchorY="middle"
          billboard
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Walk close to collect!
        </Text>
      )}

      {/* Glowing effect when hovered */}
      {hovered && (
        <pointLight
          position={[0, 1, 0]}
          intensity={0.5}
          color="#FFD700"
          distance={5}
        />
      )}
    </group>
  );
}
