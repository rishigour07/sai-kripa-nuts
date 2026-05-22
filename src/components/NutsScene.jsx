import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const nutBodies = [
  { kind: 'almond', color: '#a57641', position: [-3.1, 1.6, -1], speed: 0.36, scale: 0.62 },
  { kind: 'cashew', color: '#d3bc8f', position: [2.7, 0.9, -0.4], speed: 0.29, scale: 0.7 },
  { kind: 'walnut', color: '#7b5336', position: [1.4, -1.8, -1.8], speed: 0.25, scale: 0.58 },
  { kind: 'pistachio', color: '#b9b280', position: [-1.8, -1.5, -0.25], speed: 0.34, scale: 0.66 },
  { kind: 'almond', color: '#986436', position: [0.25, 2.2, -2.4], speed: 0.22, scale: 0.5 },
];

const NutMesh = ({ kind, color, position, scale, speed }) => {
  const meshRef = useRef(null);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const t = clock.getElapsedTime() * speed;
    mesh.rotation.y = t;
    mesh.rotation.x = t * 0.7;
    mesh.position.y = position[1] + Math.sin(t * 1.2) * 0.2;
  });

  let geometry;
  if (kind === 'cashew') {
    geometry = <torusGeometry args={[0.48, 0.16, 24, 48, Math.PI * 1.3]} />;
  } else if (kind === 'walnut') {
    geometry = <icosahedronGeometry args={[0.45, 1]} />;
  } else if (kind === 'pistachio') {
    geometry = <sphereGeometry args={[0.42, 32, 28]} />;
  } else {
    geometry = <sphereGeometry args={[0.45, 32, 28]} />;
  }

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.55}>
      <mesh ref={meshRef} position={position} scale={scale} castShadow>
        {geometry}
        <meshStandardMaterial
          color={color}
          metalness={0.18}
          roughness={0.46}
          envMapIntensity={1.2}
        />
      </mesh>
    </Float>
  );
};

const NutsScene = () => (
  <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }} dpr={[1, 1.5]}>
    <color attach="background" args={['#081a14']} />
    <fog attach="fog" args={['#081a14', 4.8, 13]} />
    <ambientLight intensity={0.7} />
    <directionalLight position={[2, 5, 4]} intensity={1.6} color="#f2dfb2" />
    <pointLight position={[-3, 1.5, 3]} intensity={1} color="#ffe1a5" />
    <pointLight position={[3, -2, 1]} intensity={0.7} color="#4aa084" />
    <Suspense fallback={null}>
      {nutBodies.map((nut) => (
        <NutMesh key={`${nut.kind}-${nut.position.join('-')}`} {...nut} />
      ))}
    </Suspense>
  </Canvas>
);

export default NutsScene;
