import { useTexture } from "@react-three/drei";
import { WeatherEvent } from "../lib/stores/useProbabilityGame";

interface EnvironmentProps {
  weatherEvent: WeatherEvent;
  mapSize?: number;
}

export default function Environment({ weatherEvent, mapSize = 30 }: EnvironmentProps) {
  const grassTexture = useTexture("/textures/grass.png");
  const halfMap = mapSize / 2;
  
  return (
    <>
      {/* Ground plane */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[mapSize, mapSize]} />
        <meshStandardMaterial 
          map={grassTexture} 
          color={weatherEvent.type === 'rain' ? "#506050" : "#60B060"}
        />
      </mesh>

      {/* Boundary walls */}
      <mesh position={[halfMap, 2.5, 0]} castShadow>
        <boxGeometry args={[0.5, 5, mapSize]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-halfMap, 2.5, 0]} castShadow>
        <boxGeometry args={[0.5, 5, mapSize]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.5, halfMap]} castShadow>
        <boxGeometry args={[mapSize, 5, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.5, -halfMap]} castShadow>
        <boxGeometry args={[mapSize, 5, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Decorative trees */}
      {Array.from({ length: Math.floor(mapSize / 10) }, (_, i) => {
        const spacing = mapSize / Math.floor(mapSize / 10);
        const x = -halfMap + 5 + (i * spacing);
        return (
          <group key={i} position={[x, 0, -halfMap + 3]}>
            {/* Tree trunk */}
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 3]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Tree leaves */}
            <mesh position={[0, 3, 0]} castShadow>
              <sphereGeometry args={[1.5, 8, 8]} />
              <meshStandardMaterial 
                color={weatherEvent.type === 'rain' ? "#228B22" : "#32CD32"} 
              />
            </mesh>
          </group>
        );
      })}

      {/* Weather effects */}
      {weatherEvent.active && weatherEvent.type === 'rain' && (
        <>
          {/* Rain particles */}
          {Array.from({ length: Math.floor(mapSize * 2) }, (_, i) => (
            <mesh 
              key={i} 
              position={[
                (Math.random() - 0.5) * mapSize,
                5 + Math.random() * 5,
                (Math.random() - 0.5) * mapSize
              ]}
            >
              <cylinderGeometry args={[0.01, 0.01, 0.5]} />
              <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
            </mesh>
          ))}
        </>
      )}

      {weatherEvent.active && weatherEvent.type === 'sunny' && (
        <>
          {/* Sun */}
          <mesh position={[10, 15, -10]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFA500" 
              emissiveIntensity={0.5} 
            />
          </mesh>
        </>
      )}

      {weatherEvent.active && weatherEvent.type === 'cloudy' && (
        <>
          {/* Clouds */}
          {[[-5, 12, -5], [5, 10, 5], [0, 11, 8]].map((pos, i) => (
            <mesh key={i} position={pos}>
              <sphereGeometry args={[2, 8, 8]} />
              <meshStandardMaterial 
                color="#D3D3D3" 
                transparent 
                opacity={0.8} 
              />
            </mesh>
          ))}
        </>
      )}
    </>
  );
}
