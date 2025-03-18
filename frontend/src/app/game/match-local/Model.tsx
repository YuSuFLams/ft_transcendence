"use client"

import React, { useRef } from 'react'
import * as THREE from 'three'
import { useGLTF, useAnimations } from '@react-three/drei'

export function Model(props) {
  const group = useRef(null)
  const { nodes, materials, animations } = useGLTF('/pong.glb')
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
        <group name="Sketchfab_Scene">
            <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
                <group name="root">
                    <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
                        {/* Score Left */}
                        <group name="Text003_1" position={[-1.939, 0, -4.895]} scale={1.716}>
                            <mesh name="Object_4" castShadow receiveShadow geometry={(nodes.Object_4 as THREE.Mesh).geometry} material={materials['Material.019']}/>
                        </group>
                        
                        {/* Score Right */}
                        <group name="Text006_2" position={[1.886, 0, -4.895]} scale={1.716}>
                            <mesh name="Object_6" castShadow receiveShadow geometry={(nodes.Object_6 as THREE.Mesh).geometry} material={materials['Material.019']}/>
                        </group>
                        
                        {/* Table  */}
                        <group name="Plane_3" position={[0, -0.2, 0]} scale={1.117}>
                            <mesh name="Object_8" castShadow receiveShadow geometry={(nodes.Object_8 as THREE.Mesh).geometry} material={materials['Material.001']}/>
                        </group>

                        {/* Line Center */}
                        <group name="Cube_4" position={[0, 0, -5.2]} scale={0.2}>
                            <mesh name="Object_10" castShadow receiveShadow geometry={(nodes.Object_10 as THREE.Mesh).geometry} material={materials['Material.002']}/>
                        </group>
              
                        {/* Left Paddle */}
                        <group name="Cube001_5" position={[-8, 0, 0]} scale={0.2}>
                            <mesh name="Object_12" castShadow receiveShadow geometry={(nodes.Object_12 as THREE.Mesh).geometry} material={materials['Material.002']}/>
                        </group>
              
                        {/* Right Paddle */}
                        <group name="Cube002_6" position={[8, 0, 0]} scale={0.2}>
                            <mesh name="Object_14" castShadow receiveShadow geometry={(nodes.Object_14 as THREE.Mesh).geometry} material={materials['Material.002']}/>
                        </group>

                        {/* Ball */}
                        <group name="Cube003_7" scale={0.2}>
                            <mesh name="Object_16" castShadow receiveShadow geometry={(nodes.Object_16  as THREE.Mesh).geometry} material={materials['Material.002']}/>
                        </group>

                        {/* Line Rounded */}
                        <group name="Cube032_8" position={[-9, 0, -6]} scale={0.2}>
                            <mesh name="Object_18" castShadow receiveShadow geometry={(nodes.Object_18  as THREE.Mesh).geometry} material={materials['Material.002']}/>
                        </group>
              
                        {/* Text Pong Title Left Side */}
                        <group name="Text001_10" position={[0.3, -3.495, 9.255]} rotation={[Math.PI / 2, 0, 0]} scale={3.694}>                         
                            <mesh name="Object_22" castShadow receiveShadow geometry={(nodes.Object_22 as THREE.Mesh).geometry} material={materials['Material.012']}/>
                            <mesh name="Object_23" castShadow receiveShadow geometry={(nodes.Object_23 as THREE.Mesh).geometry} material={materials['Material.013']}/>
                            <mesh name="Object_24" castShadow receiveShadow geometry={(nodes.Object_24 as THREE.Mesh).geometry} material={materials['Material.014']}/>
                            <mesh name="Object_25" castShadow receiveShadow geometry={(nodes.Object_25 as THREE.Mesh).geometry} material={materials['Material.015']}/>
                            <mesh name="Object_26" castShadow receiveShadow geometry={(nodes.Object_26 as THREE.Mesh).geometry} material={materials['Material.016']}/>
                        </group>
                        
                        {/* Text Line Right Side */}
                        <group name="Text002_11" position={[0, -3.495, 9.255]} rotation={[Math.PI / 2, 0, 0]} scale={3.694}>
                            <mesh name="Object_28" castShadow receiveShadow geometry={(nodes.Object_28 as THREE.Mesh).geometry} material={materials['Material.009']}/>
                            <mesh name="Object_29" castShadow receiveShadow geometry={(nodes.Object_29 as THREE.Mesh).geometry} material={materials['Material.010']}/>
                            <mesh name="Object_30" castShadow receiveShadow geometry={(nodes.Object_30 as THREE.Mesh).geometry} material={materials['Material.011']}/>
                        </group>

                        {/* Text Line Left Side */}
                        <group name="Text004_12" position={[0.3, -3.495, -9.245]} rotation={[Math.PI / 2, 0, Math.PI]} scale={3.694}>
                            <mesh name="Object_32" castShadow receiveShadow geometry={(nodes.Object_32 as THREE.Mesh).geometry} material={materials.material_0}/>
                        </group>

                        {/* Text Pong Title Right Side */}
                        <group name="Text005_13" position={[0, -3.495, -9.245]} rotation={[Math.PI / 2, 0, Math.PI]} scale={3.694}>
                            <mesh name="Object_34" castShadow receiveShadow geometry={(nodes.Object_34 as THREE.Mesh).geometry} material={materials['Material.012']}/>
                            <mesh name="Object_35" castShadow receiveShadow geometry={(nodes.Object_35 as THREE.Mesh).geometry} material={materials['Material.013']}/>
                            <mesh name="Object_36" castShadow receiveShadow geometry={(nodes.Object_36 as THREE.Mesh).geometry} material={materials['Material.014']}/>
                            <mesh name="Object_37" castShadow receiveShadow geometry={(nodes.Object_37 as THREE.Mesh).geometry} material={materials['Material.015']}/>
                            <mesh name="Object_38" castShadow receiveShadow geometry={(nodes.Object_38 as THREE.Mesh).geometry} material={materials['Material.016']}/>
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
                        
                        {/* Table */}
                        <group name="Cube010_16" position={[0.1, -1.8, 0]}>
                            <mesh name="Object_48" castShadow receiveShadow geometry={(nodes.Object_48 as THREE.Mesh).geometry} material={materials['Material.008']}/>
                        </group>

                        {/* Line Left */}
                        <group name="BezierCurve_17" position={[-6.441, -0.535, 7.097]}>
                            <mesh name="Object_50" castShadow receiveShadow geometry={(nodes.Object_50 as THREE.Mesh).geometry} material={materials['Material.008']}/>
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