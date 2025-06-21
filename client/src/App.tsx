import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/inter";
import Game from "./components/Game";
import GameUI from "./components/GameUI";
import Tutorial from "./components/Tutorial";
import { useProbabilityGame } from "./lib/stores/useProbabilityGame";
import { useAudio } from "./lib/stores/useAudio";

// Define control keys for the game
enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  interact = 'interact',
  jump = 'jump'
}

const controlMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.back, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.interact, keys: ['KeyE', 'Space'] },
  { name: Controls.jump, keys: ['KeyQ'] },
];

const queryClient = new QueryClient();

function App() {
  const { gamePhase } = useProbabilityGame();

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <KeyboardControls map={controlMap}>
          {gamePhase === 'tutorial' && <Tutorial />}
          
          {(gamePhase === 'playing' || gamePhase === 'paused' || gamePhase === 'levelComplete') && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [0, 8, 12],
                  fov: 45,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "default"
                }}
              >
                <color attach="background" args={["#87CEEB"]} />
                
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight
                  position={[10, 10, 5]}
                  intensity={1}
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                  shadow-camera-far={50}
                  shadow-camera-left={-10}
                  shadow-camera-right={10}
                  shadow-camera-top={10}
                  shadow-camera-bottom={-10}
                />

                <Suspense fallback={null}>
                  <Game />
                </Suspense>
              </Canvas>
              <GameUI />
            </>
          )}
        </KeyboardControls>
      </div>
    </QueryClientProvider>
  );
}

export default App;
