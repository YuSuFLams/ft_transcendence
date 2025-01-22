import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { handleQuitGame } from "@/app/components/game/match-local/event-prematch-local";

const Table: React.FC = () => {
    // Load textures for a realistic table appearance
    const woodTexture = useLoader(THREE.TextureLoader, '/Image/textures/wood.jpg');
    const metalTexture = useLoader(THREE.TextureLoader, '/Image/textures/metal.jpg');

    return (
        <>
            {/* Table surface */}
            <mesh position={[0, 0.1, 0]} receiveShadow>
                <boxGeometry args={[3, 0.2, 6]} />
                <meshStandardMaterial map={woodTexture} />
            </mesh>

            {/* Center line (spanning the width of the table) */}
            <mesh position={[0, 0.2, 0]} receiveShadow>
                <boxGeometry args={[3, 0.02, 0.05]} /> 
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Table legs */}
            <mesh position={[-1.4, -0.6, 2.8]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 1.2, 32]} />
                <meshStandardMaterial map={metalTexture} />
            </mesh>
            <mesh position={[1.4, -0.6, 2.8]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 1.2, 32]} />
                <meshStandardMaterial map={metalTexture} />
            </mesh>
            <mesh position={[-1.4, -0.6, -2.8]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 1.2, 32]} />
                <meshStandardMaterial map={metalTexture} />
            </mesh>
            <mesh position={[1.4, -0.6, -2.8]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 1.2, 32]} />
                <meshStandardMaterial map={metalTexture} />
            </mesh>
        </>
    );
};


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


const Ball: React.FC<{
    ballRef: React.MutableRefObject<THREE.Mesh | null>;
    ballPosition: { x: number; y: number; z: number };
}> = ({ ballRef, ballPosition }) => {
    // Load ball texture for realism
    const ballTexture = useLoader(THREE.TextureLoader, '/Image/textures/pingpong_ball.jpg');

    // Update ball position on every frame
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
            <meshStandardMaterial
                map={ballTexture}
                roughness={0.1} // Low roughness for shininess
                metalness={0.8} // High metalness for reflection
                color="white"
            />
        </mesh>
    );
};


interface TableLocalProps {
    playerLeft: string,
    playerRight: string,
    scorePlayerLeft: number,
    scorePlayerRight: number,
    positionPlayerPaddleLeft: number,
    positionPlayerPaddleRight: number,
    ballPosition: { x: number; y: number; z: number },
    ballRef: React.MutableRefObject<THREE.Mesh | null>,
    paddlePlayerRightRef: React.MutableRefObject<THREE.Mesh | null>,
    paddlePlayerLeftRef: React.MutableRefObject<THREE.Mesh | null>,
    socket: React.MutableRefObject<WebSocket | null>,
    router: any,
}

const TableLocal: React.FC<TableLocalProps> = (
    {
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
    }
) => {
    return (
        <div className="w-screen h-screen bg-neutral-900 absolute flex flex-col justify-center items-center">
            {/* Scoreboard */}
            <div className="text-center space-y-4 absolute top-4 left-0 right-0 justify-center">
                <div className="flex justify-around font-[ssb] items-center space-x-8">
                    {/* Player Left */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl text-green-400 tracking-wider">{playerLeft}</span>
                        <span className="text-5xl font-extrabold text-white drop-shadow-md">
                            {scorePlayerLeft}
                        </span>
                    </div>
                    {/* Divider */}
                    <div className="text-3xl  text-gray-300 italic">VS</div>
                    {/* Player Right */}
                    <div className="flex flex-col items-center">
                        <span className="text-2xl text-green-400 tracking-wider">{playerRight}</span>
                        <span className="text-5xl font-extrabold text-white drop-shadow-md">
                            {scorePlayerRight}
                        </span>
                    </div>
                </div>
            </div>
            {/* Game Canvas */}
            <Canvas className="w-full h-full" camera={{ position: [-0.1, 8, 0], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Table />
                <Ball ballRef={ballRef} ballPosition={ballPosition} />
                <Paddle ref={paddlePlayerRightRef} color="yellow" position={[positionPlayerPaddleRight, 0.3, 2.7]} />
                <Paddle ref={paddlePlayerLeftRef} color="red" position={[positionPlayerPaddleLeft, 0.3, -2.7]} />
                <OrbitControls />
            </Canvas>
            {/* Bottom Controls */}
            <div className="text-center space-x-12 absolute bottom-4 left-0 right-0">
                <button onClick={() => handleQuitGame(socket, router)} className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-800 rounded text-white">
                    Quit Game
                </button>
            </div>
        </div>
    )
}

export { Table, Paddle, Ball, TableLocal };