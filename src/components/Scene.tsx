import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

const Scene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} />
      <Box>
        <meshStandardMaterial attach="material" color="orange" />
      </Box>
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;