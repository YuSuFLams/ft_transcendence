"use client"

import { BallPosition } from '@/components/game/match-local/during-match/socket';
import { handleQuitGame } from '@/components/game/match-local/match';
import { useGLTF, useAnimations } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react'
import * as THREE from 'three'

interface DrawTableProps {
    scorePlayerRight: number;
    scorePlayerLeft:number;
    positionPlayerPaddleLeft: number;
    positionPlayerPaddleRight: number;
    ballPosition: BallPosition;
}

const Model: React.FC<DrawTableProps> = ({
    scorePlayerRight, scorePlayerLeft,
    positionPlayerPaddleLeft,
    positionPlayerPaddleRight,
    ballPosition,
}) =>  {
  const group = useRef(null)
  const { nodes, materials, animations } = useGLTF('/pong.glb')
  const { actions } = useAnimations(animations, group)

  return (
    <group ref={group} dispose={null}>
        <group name="Sketchfab_Scene">
            <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
                <group name="root">
                    <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
                        {/* Table Game */}
                        <group name="Plane_3" position={[0, -0.2, 0]} scale={[1.117, 0.8, 1]}> {/* Proportional scaling */}
                            <mesh name="Object_8" castShadow receiveShadow geometry={(nodes.Object_8 as THREE.Mesh).geometry} material={materials['Material.001']}/>
                        </group>
                        
                        {/* Line Center */}
                        <group name="Cube_4" position={[0, 0, -5.7]} scale={[0.2, 0.07, 0.22]}>
                            <mesh name="Object_10" castShadow receiveShadow geometry={(nodes.Object_10 as THREE.Mesh).geometry} material={materials['Material.002']}/>
                        </group>

                        {/* Line Rounded left */}
                        <group name="Cube032_8" position={[0, -0.2, -6.2]} scale={[0.2, 0.3, 0.2]}>
                            <mesh name="Object_18" castShadow receiveShadow geometry={new THREE.BoxGeometry(100.4, 3, 2)} material={materials['Material.002']}/>
                        </group>
                        
                        {/* Line Rounded right */}
                        <group name="Cube032_8" position={[0, -0.2, 6.2]} scale={[0.2, 0.3, 0.2]}>
                            <mesh name="Object_18" castShadow receiveShadow geometry={new THREE.BoxGeometry(100.4, 3, 2)} material={materials['Material.002']}/>
                        </group>
                        
                        {/* Left Paddle */}
                        <group name="Cube001_5" position={[-9.3, 0, positionPlayerPaddleLeft]} scale={[0.24, 0.24, 0.24]}>
                            <mesh name="Object_12" castShadow receiveShadow geometry={(nodes.Object_12 as THREE.Mesh).geometry} material={materials['Material.002']}/>
                        </group>
              
                        {/* Right Paddle */}
                        <group name="Cube002_6" position={[9.3, 0, positionPlayerPaddleRight]} scale={[0.24, 0.24, 0.24]}>
                            <mesh name="Object_14" castShadow receiveShadow geometry={(nodes.Object_14 as THREE.Mesh).geometry} material={materials['Material.002']}/>
                        </group>

                        {/* Text Pong Title Left Side */}
                        <group name="Text001_10" position={[0.3, -3.495, 9.255]} rotation={[Math.PI / 2, 0, 0]} scale={3.694}>                         
                            <mesh name="Object_22" castShadow receiveShadow geometry={(nodes.Object_22 as THREE.Mesh).geometry} material={materials['Material.012']}/>
                            <mesh name="Object_23" castShadow receiveShadow geometry={(nodes.Object_23 as THREE.Mesh).geometry} material={materials['Material.013']}/>
                            <mesh name="Object_24" castShadow receiveShadow geometry={(nodes.Object_24 as THREE.Mesh).geometry} material={materials['Material.014']}/>
                            <mesh name="Object_25" castShadow receiveShadow geometry={(nodes.Object_25 as THREE.Mesh).geometry} material={materials['Material.015']}/>
                            <mesh name="Object_26" castShadow receiveShadow geometry={(nodes.Object_26 as THREE.Mesh).geometry} material={materials['Material.016']}/>
                        </group>
                        
                        {/* Text Pong Title Right Side */}
                        <group name="Text005_13" position={[0, -3.495, -9.245]} rotation={[Math.PI / 2, 0, Math.PI]} scale={3.694}>
                            <mesh name="Object_34" castShadow receiveShadow geometry={(nodes.Object_34 as THREE.Mesh).geometry} material={materials['Material.012']}/>
                            <mesh name="Object_35" castShadow receiveShadow geometry={(nodes.Object_35 as THREE.Mesh).geometry} material={materials['Material.013']}/>
                            <mesh name="Object_36" castShadow receiveShadow geometry={(nodes.Object_36 as THREE.Mesh).geometry} material={materials['Material.014']}/>
                            <mesh name="Object_37" castShadow receiveShadow geometry={(nodes.Object_37 as THREE.Mesh).geometry} material={materials['Material.015']}/>
                            <mesh name="Object_38" castShadow receiveShadow geometry={(nodes.Object_38 as THREE.Mesh).geometry} material={materials['Material.016']}/>
                        </group>

                        {/* Text Line Right Side */}
                        <group name="Text002_11" position={[0, -3.495, 9.255]} rotation={[Math.PI / 2, 0, 0]} scale={3.694}>
                            <mesh name="Object_28" castShadow receiveShadow geometry={(nodes.Object_28 as THREE.Mesh).geometry} material={materials['Material.009']}/>
                            <mesh name="Object_29" castShadow receiveShadow geometry={(nodes.Object_29 as THREE.Mesh).geometry} material={materials['Material.010']}/>
                            <mesh name="Object_30" castShadow receiveShadow geometry={(nodes.Object_30 as THREE.Mesh).geometry} material={materials['Material.011']}/>
                        </group>

                        {/* Click Left Side */}
                        <group name="Cube017_14" position={[-6.617, -0.8, 8.081]} rotation={[Math.PI, -1.377, Math.PI]}>
                            <mesh name="Object_40" castShadow receiveShadow geometry={(nodes.Object_40 as THREE.Mesh).geometry} material={materials['Material.005']}/>
                            <mesh name="Object_41" castShadow receiveShadow geometry={(nodes.Object_41 as THREE.Mesh).geometry} material={materials['Material.006']}/>
                            <mesh name="Object_42" castShadow receiveShadow geometry={(nodes.Object_42 as THREE.Mesh).geometry} material={materials['Material.007']}/>
                        </group>

                        {/* Click Right Side */}
                        <group name="Cube024_15" position={[5.525, -0.8, 8.123]} rotation={[0, -1.46, 0]}>
                            <mesh name="Object_44" castShadow receiveShadow geometry={(nodes.Object_44 as THREE.Mesh).geometry} material={materials['Material.005']}/>
                            <mesh name="Object_45" castShadow receiveShadow geometry={(nodes.Object_45 as THREE.Mesh).geometry} material={materials['Material.006']}/>
                            <mesh name="Object_46" castShadow receiveShadow geometry={(nodes.Object_46 as THREE.Mesh).geometry} material={materials['Material.007']}/>
                        </group>
                        
                        {/* Line Left */}
                        <group name="BezierCurve_17" position={[-6.441, -0.535, 7.097]}>
                            <mesh name="Object_50" castShadow receiveShadow geometry={(nodes.Object_50 as THREE.Mesh).geometry} material={materials['Material.008']}/>
                        </group>

                        {/* Text Line Left Side */}
                        <group name="Text004_12" position={[0.3, -3.495, -9.245]} rotation={[Math.PI / 2, 0, Math.PI]} scale={3.694}>
                            <mesh name="Object_32" castShadow receiveShadow geometry={(nodes.Object_32 as THREE.Mesh).geometry} material={materials.material_0}/>
                        </group>

                        {/* Table */}
                        <group name="Cube010_16" position={[0.1, -1.8, 0]}>
                            <mesh name="Object_48" castShadow receiveShadow geometry={(nodes.Object_48 as THREE.Mesh).geometry} material={materials['Material.008']}/>
                        </group>






                        
                        

              
                        {/* Score Left */}
                        <group name="Text003_1" position={[-2, -0.05, -4.895]} scale={1.716}>
                            <mesh name="Object_4" castShadow receiveShadow geometry={(nodes.Object_4 as THREE.Mesh).geometry} material={materials['Material.019']}/>
                        </group>
                        
                        {/* Score Right */}
                        <group name="Text006_2" position={[2, -0.05, -4.895]} scale={1.716}>
                            <mesh name="Object_6" castShadow receiveShadow geometry={(nodes.Object_6 as THREE.Mesh).geometry} material={materials['Material.019']}/>
                        </group>

                        

                        {/* Ball */}
                        {/*  */}
                        <group name="Cube003_7"  scale={0.25} position={[ballPosition.x, ballPosition.y, ballPosition.z]}>
                            <mesh name="Object_16" castShadow receiveShadow geometry={(nodes.Object_16  as THREE.Mesh).geometry} material={materials['Material.002']}/>
                        </group>

                        
              
                        


                        
              
                        
                        
                        

                        <group name="BezierCurve001_18" position={[5.433, -0.4, 7.127]}>
                            <mesh name="Object_52" castShadow receiveShadow geometry={(nodes.Object_52 as THREE.Mesh).geometry} material={materials['Material.008']}/>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    </group>
  )
}

useGLTF.preload('/pong.glb')



interface TableLocalProps {
	playerLeft: string;
	playerRight: string;
	scorePlayerLeft: number;
	scorePlayerRight: number;
	positionPlayerPaddleLeft: number;
	positionPlayerPaddleRight: number;
	ballPosition: { x: number; y: number; z: number };
	socket?: React.RefObject<WebSocket | null>;
	router?: ReturnType<typeof useRouter>;
}

const TableLocal: React.FC<TableLocalProps> = ({
    playerLeft, playerRight, scorePlayerLeft, scorePlayerRight, positionPlayerPaddleLeft, positionPlayerPaddleRight, ballPosition, socket, router,
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
			<div style={{ width: '100vw', height: '100vh' }}>
				<Canvas className="bg-red-900 overflow-hidden" camera={{ position: [0, 90, 40], fov: 20, near: 0.8, far: 1000 }}>
					<ambientLight intensity={0.5} />
					<directionalLight position={[10, 10, 5]} intensity={1} />
					<Model scorePlayerRight={scorePlayerRight} scorePlayerLeft={scorePlayerLeft} ballPosition={ballPosition} 
						positionPlayerPaddleLeft={positionPlayerPaddleLeft} positionPlayerPaddleRight={positionPlayerPaddleRight}
					/>
					<OrbitControls  />
				</Canvas>
			</div>
			{/* Bottom Controls */}
			{socket && router && (
				<div className="text-center space-x-12 absolute bottom-4 left-0 right-0">
					<button
						onClick={() => handleQuitGame(socket, router)}
						className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-800 hover:to-blue-600 rounded-lg text-white font-bold shadow-lg transform hover:scale-105 transition-all"
					>
						Quit Game
					</button>
				</div>
			)}
    	</div>
  	);
};

export { TableLocal };