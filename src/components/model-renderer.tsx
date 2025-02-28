// components/avatar-renderer.tsx

"use client";

import { Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

import Avatar from "@/Avatars/Avatar";

const ModelRenderer = () => {
  return (
    <div className="w-[1795px] h-[700px] items-end justify-end justify-items-end items-self-end">
      <Suspense
        fallback={
          <div className="w-full flex fixed  h-full font-bold text-[30px] font-mono text-white">
            loading...
          </div>
        }
      >
        <Canvas
          shadows="basic"
          // adjust camera parameters according to your needs
          camera={{
            position: [0, 0, 10],
            fov: 10,
            castShadow: true,
            zoom: 1,
          }}
          className="w-[300px] h-[600px] "
        >
          <OrbitControls />
          <ambientLight intensity={1.5} />
          <Environment preset="sunset" />
          <directionalLight intensity={0.8} />
          <Avatar />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default ModelRenderer;
