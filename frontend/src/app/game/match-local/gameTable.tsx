import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { handleQuitGame } from "@/components/game/match-local/match";
import { useRouter } from "next/navigation";

// Table Component (includes the ping pong table and its elements)
const Table: React.FC = () => {
  return (
    <>
      {/* Side Walls */}
      <mesh position={[-1.58, 0.15, 0]} castShadow>
        <boxGeometry args={[0.05, 0.3, 6.1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <mesh position={[1.58, 0.15, 0]} castShadow>
        <boxGeometry args={[0.05, 0.3, 6.1]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Table */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[3, 0.02, 6]} />
        <meshStandardMaterial color={"#4CAF50"} /> {/* Adjusted to a more realistic green */}
      </mesh>

      {/* Goal Lines */}
      <mesh position={[0, 0.01, 3.03]} receiveShadow>
        <boxGeometry args={[3, 0.02, 0.05]} />
        <meshStandardMaterial color={"white"} />
      </mesh>
      <mesh position={[0, 0.01, -3.03]} receiveShadow>
        <boxGeometry args={[3, 0.02, 0.05]} />
        <meshStandardMaterial color={"white"} />
      </mesh>

      {/* Center Line */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[3, 0.02, 0.03]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Side Lines (on the table edges) */}
      <mesh position={[-1.525, 0.01, 0]} receiveShadow>
        <boxGeometry args={[0.05, 0.02, 6.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[1.525, 0.01, 0]} receiveShadow>
        <boxGeometry args={[0.05, 0.02, 6.1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Center Circle Outline */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[0.45, 0.5, 64]} />
        <meshStandardMaterial color="white" side={2} />
      </mesh>
    </>
  );
};

// Paddle Component (Player's paddle on the table)
const Paddle = React.forwardRef<THREE.Mesh, { position: [number, number, number]; color: string }>( 
  ({ position, color }, ref) => {
    return (
      <mesh ref={ref} position={position}>
        <boxGeometry args={[0.8, 0.1, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }
);

// Ball Component (Moves the ball around based on its position)
const Ball: React.FC<{
  ballRef: React.RefObject<THREE.Mesh | null>;
  ballPosition: { x: number; y: number; z: number };
}> = ({ ballRef, ballPosition }) => {
  useFrame(() => {
    if (ballRef.current) {
      ballRef.current.position.set(ballPosition.x, ballPosition.y, ballPosition.z);
    }
  });

  return (
    <mesh ref={ballRef}>
      {/* Ball geometry */}
      <sphereGeometry args={[0.1, 32, 32]} />
      {/* Ball material with a texture and shininess */}
      <meshStandardMaterial roughness={0.1} metalness={0.8} color="white" />
    </mesh>
  );
};

interface TableLocalProps {
  playerLeft: string;
  playerRight: string;
  scorePlayerLeft: number;
  scorePlayerRight: number;
  positionPlayerPaddleLeft: number;
  positionPlayerPaddleRight: number;
  ballPosition: { x: number; y: number; z: number };
  ballRef: React.RefObject<THREE.Mesh | null>;
  paddlePlayerRightRef: React.RefObject<THREE.Mesh | null>;
  paddlePlayerLeftRef: React.RefObject<THREE.Mesh | null>;
  socket?: React.RefObject<WebSocket | null>;
  router?: ReturnType<typeof useRouter>;
}

interface DrawTableProps {
  ballRef: React.RefObject<THREE.Mesh | null>;
  ballPosition: { x: number; y: number; z: number };
  positionPlayerPaddleLeft: number;
  positionPlayerPaddleRight: number;
  paddlePlayerRightRef: React.RefObject<THREE.Mesh | null>;
  paddlePlayerLeftRef: React.RefObject<THREE.Mesh | null>;
}

const DrawTable: React.FC<DrawTableProps> = ({
	ballRef,
	ballPosition,
	positionPlayerPaddleLeft,
	positionPlayerPaddleRight,
	paddlePlayerRightRef,
	paddlePlayerLeftRef
  }) => {
	return (
	  <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
		<Canvas className="bg-[#1E2A3A] overflow-hidden" camera={{ position: [0, 12, 20], fov: 20, near: 0.2, far: 1000 }}>
		  <ambientLight intensity={0.5} />
		  <pointLight position={[10, 10, 10]} intensity={1.5} />
		  <Table />
		  <Ball ballRef={ballRef} ballPosition={ballPosition} />
		  <Paddle ref={paddlePlayerRightRef} color="#FFD700" position={[positionPlayerPaddleRight, 0.1, 2.7]} />
		  <Paddle ref={paddlePlayerLeftRef} color="#FF4500" position={[positionPlayerPaddleLeft, 0.1, -2.7]} />
		  <OrbitControls zoom0={100} />
		</Canvas>
	  </div>
	);
  };
  

const TableLocal: React.FC<TableLocalProps> = ({
    playerLeft,
    playerRight,
    scorePlayerLeft,
    scorePlayerRight,
    positionPlayerPaddleLeft,
    positionPlayerPaddleRight,
    ballPosition,
    ballRef,
    paddlePlayerRightRef,
    paddlePlayerLeftRef,
    socket,
    router,
}) => {
  return (
    <div className="w-full h-full bg-neutral-900 absolute flex flex-col justify-center items-center overflow-hidden">
      {/* Scoreboard */}
      <div className="fixed z-10 text-center space-y-4 absolute top-4 left-0 right-0 justify-center">
        <div className="flex justify-around font-[ssb] items-center space-x-8">
          {/* Player Left */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-5xl text-blue-800 font-[Font8] font-extrabold text-white drop-shadow-xl">{playerLeft}</span>
            <span className="text-5xl text-blue-800 font-[Font7] font-extrabold text-white drop-shadow-xl">{scorePlayerLeft}</span>
          </div>

          {/* Divider */}
          <div className="text-4xl text-gray-300 italic flex items-center">
            <span className="px-2 py-1 bg-white bg-opacity-30 rounded-md">VS</span>
          </div>

          {/* Player Right */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-5xl text-blue-800 font-[Font8] font-extrabold text-white drop-shadow-xl">{playerRight}</span>
            <span className="text-5xl text-blue-800 font-[Font7] font-extrabold text-white drop-shadow-xl">{scorePlayerRight}</span>
          </div>
        </div>
      </div>

	  {/* Table */}
	  <div>
      <DrawTable 
        ballRef={ballRef}
        ballPosition={ballPosition}
        positionPlayerPaddleLeft={positionPlayerPaddleLeft}
        positionPlayerPaddleRight={positionPlayerPaddleRight}
        paddlePlayerRightRef={paddlePlayerRightRef}
        paddlePlayerLeftRef={paddlePlayerLeftRef}
		/>
		</div>

      {/* Bottom Controls */}
      {socket && router && <div className="text-center space-x-12 absolute bottom-4 left-0 right-0">
        <button onClick={() => handleQuitGame(socket, router)} className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 
          hover:from-blue-800 hover:to-blue-600 rounded-lg text-white font-bold shadow-lg transform hover:scale-105 transition-all"
        >
          Quit Game
        </button>
      </div>}
    </div>
  );
};

export { Table, Paddle, Ball, TableLocal };
