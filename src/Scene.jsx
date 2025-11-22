import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RoomModel from './RoomModel';

export default function Scene() {
  return (
    <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
      <ambientLight intensity={1}/>
      <directionalLight position={[5,5,5]} intensity={1}/>
      <RoomModel />
      <OrbitControls />
    </Canvas>
  );
}
