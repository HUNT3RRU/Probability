import { useTexture } from "@react-three/drei";
import { WeatherEvent } from "../lib/stores/useProbabilityGame";

interface EnvironmentProps {
  weatherEvent: WeatherEvent;
}

export default function Environment({ weatherEvent }: EnvironmentProps) {
  const grassTexture = useTexture("/textures/grass.png");
  
  return (
    <>
      {/* Ground plane */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial 
          map={grassTexture} 
          color={weatherEvent.type === 'rain' ? "#506050" : "#60B060"}
        />
      </mesh>

      {/* Boundary walls */}
      <mesh position={[15, 2.5, 0]} castShadow>
        <boxGeometry args={[0.5, 5, 30]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-15, 2.5, 0]} castShadow>
        <boxGeometry args={[0.5, 5, 30]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.5, 15]} castShadow>
        <boxGeometry args={[30, 5, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.5, -15]} castShadow>
        <boxGeometry args={[30, 5, 0.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Decorative trees */}
      {[-10, -5, 5, 10].map((x, i) => (
        <group key={i} position={[x, 0, -12]}>
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
      ))}

      {/* Weather effects */}
      {weatherEvent.active && weatherEvent.type === 'rain' && (
        <>
          {/* Rain particles */}
          {Array.from({ length: 50 }, (_, i) => (
            <mesh 
              key={i} 
              position={[
                (Math.random() - 0.5) * 30,
                5 + Math.random() * 5,
                (Math.random() - 0.5) * 30
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
