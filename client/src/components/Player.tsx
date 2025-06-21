import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { forwardRef, useRef } from "react";
import * as THREE from "three";

enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  interact = 'interact',
  jump = 'jump'
}

interface PlayerProps {
  powerUpActive?: boolean;
  mapSize?: number;
}

const Player = forwardRef<THREE.Group, PlayerProps>(({ powerUpActive = false, mapSize = 30 }, ref) => {
  const [subscribe, getState] = useKeyboardControls<Controls>();
  const velocity = useRef(new THREE.Vector3());
  const isJumping = useRef(false);
  const jumpVelocity = useRef(0);

  useFrame((state, delta) => {
    const controls = getState();
    const player = ref as React.MutableRefObject<THREE.Group>;
    
    if (!player.current) return;

    // Movement speed (increased if power-up is active)
    const speed = powerUpActive ? 8 : 5;
    
    // Reset velocity
    velocity.current.set(0, 0, 0);
    
    // Handle movement controls
    if (controls.forward) {
      velocity.current.z -= speed;
      console.log("Moving forward");
    }
    if (controls.back) {
      velocity.current.z += speed;
      console.log("Moving backward");
    }
    if (controls.left) {
      velocity.current.x -= speed;
      console.log("Moving left");
    }
    if (controls.right) {
      velocity.current.x += speed;
      console.log("Moving right");
    }

    // Handle jumping
    if (controls.jump && !isJumping.current) {
      jumpVelocity.current = 10;
      isJumping.current = true;
      console.log("Jumping");
    }

    // Apply gravity and jumping
    if (isJumping.current) {
      jumpVelocity.current -= 30 * delta; // Gravity
      player.current.position.y += jumpVelocity.current * delta;
      
      // Land on ground
      if (player.current.position.y <= 1) {
        player.current.position.y = 1;
        isJumping.current = false;
        jumpVelocity.current = 0;
      }
    }

    // Apply movement
    player.current.position.x += velocity.current.x * delta;
    player.current.position.z += velocity.current.z * delta;

    // Keep player within dynamic bounds based on map size  
    const bounds = mapSize / 2;
    player.current.position.x = Math.max(-bounds, Math.min(bounds, player.current.position.x));
    player.current.position.z = Math.max(-bounds, Math.min(bounds, player.current.position.z));
  });

  return (
    <group ref={ref} position={[0, 1, 0]}>
      {/* Player body */}
      <mesh castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial 
          color={powerUpActive ? "#FFD700" : "#4A90E2"} 
          emissive={powerUpActive ? "#FFA500" : "#000000"}
          emissiveIntensity={powerUpActive ? 0.2 : 0}
        />
      </mesh>
      
      {/* Player head */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color={powerUpActive ? "#FFD700" : "#E6B800"} 
          emissive={powerUpActive ? "#FFA500" : "#000000"}
          emissiveIntensity={powerUpActive ? 0.2 : 0}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[0.2, 1.6, 0.4]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.2, 1.6, 0.4]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
});

Player.displayName = "Player";

export default Player;
