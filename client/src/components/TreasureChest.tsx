import { useState, useRef, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface TreasureChestProps {
  position: [number, number, number];
  probability: number;
  onCollect: () => void;
  collected: boolean;
  playerRef?: React.RefObject<THREE.Group>;
  requiresParkour?: boolean;
  onParkourTrigger?: () => void;
}

export default function TreasureChest({ position, probability, onCollect, collected, playerRef, requiresParkour = false, onParkourTrigger }: TreasureChestProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

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

    // Check for player collision using playerRef if available, otherwise fallback to camera
    let playerPosition = state.camera.position;
    if (playerRef?.current) {
      playerPosition = playerRef.current.position;
    }
    
    const distance = meshRef.current.position.distanceTo(playerPosition);
    
    if (distance < 3 && !collected) {
      setHovered(true);
      console.log(`Treasure at distance: ${distance.toFixed(2)}`);
      // Auto-collect when player is close enough
      if (distance < 2.5) {
        console.log(`Collecting treasure! Distance: ${distance.toFixed(2)}`);
        
        if (requiresParkour && onParkourTrigger) {
          onParkourTrigger();
        } else {
          // Roll for treasure collection
          const roll = Math.random();
          console.log(`Treasure Roll ${roll.toFixed(3)} vs ${probability.toFixed(3)} = ${roll < probability ? 'SUCCESS' : 'FAIL'}`);
          
          if (roll < probability) {
            onCollect();
          } else {
            // Try again with a different roll
            const secondRoll = Math.random();
            console.log(`Treasure Second Roll ${secondRoll.toFixed(3)} vs ${probability.toFixed(3)} = ${secondRoll < probability ? 'SUCCESS' : 'FAIL'}`);
            if (secondRoll < probability) {
              onCollect();
            }
          }
        }
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
          color={collected ? "#666666" : requiresParkour ? "#9966FF" : hovered ? "#DAA520" : "#8B4513"} 
          metalness={0.6}
          roughness={0.5}
          emissive={requiresParkour ? "#6633CC" : "#000000"}
          emissiveIntensity={requiresParkour ? 0.2 : 0}
        />
      </mesh>
      
      {/* Treasure chest lid */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.2, 1]} />
        <meshStandardMaterial 
          color={collected ? "#555555" : requiresParkour ? "#BB77FF" : hovered ? "#FFD700" : "#CD853F"} 
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Probability display above chest */}
      <Suspense fallback={null}>
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
            {requiresParkour ? "Parkour Chest - Walk close!" : "Walk close to collect!"}
          </Text>
        )}

        {/* Special parkour indicator */}
        {requiresParkour && (
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.25}
            color="#FFFF99"
            anchorX="center"
            anchorY="middle"
            billboard
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            PARKOUR CHEST
          </Text>
        )}
      </Suspense>

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
