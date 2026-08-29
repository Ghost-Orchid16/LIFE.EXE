"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Icosahedron, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.08 + pointer.x * 0.4;
    mesh.current.rotation.x = t * 0.05 + pointer.y * 0.3;
  });

  return (
    <Icosahedron ref={mesh} args={[1.6, 6]}>
      <MeshDistortMaterial
        color="#8ea2ff"
        attach="material"
        distort={0.35}
        speed={1.4}
        roughness={0.15}
        metalness={0.4}
        emissive="#6f7dff"
        emissiveIntensity={0.35}
      />
    </Icosahedron>
  );
}

function OrbitNodes() {
  const group = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.6 + (i % 3) * 0.35;
      arr.push([Math.cos(angle) * radius, Math.sin(angle * 1.4) * 1.1, Math.sin(angle) * radius]);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.getElapsedTime() * 0.06;
  });

  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#c9a3ff" : "#8ea2ff"}
            emissive={i % 2 === 0 ? "#c9a3ff" : "#8ea2ff"}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Deterministic pseudo-random hash (avoids impure Math.random during render).
function hash(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function Dust() {
  const positions = useMemo(() => {
    const count = 400;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + hash(i * 3.1) * 6;
      const theta = hash(i * 7.7 + 1) * Math.PI * 2;
      const phi = Math.acos(2 * hash(i * 5.3 + 2) - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#9fb0ff" size={0.02} sizeAttenuation depthWrite={false} opacity={0.5} />
    </Points>
  );
}

export default function LifeCoreScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#8ea2ff" distance={20} />
      <pointLight position={[-4, -2, -3]} intensity={25} color="#c9a3ff" distance={20} />
      <Core />
      <OrbitNodes />
      <Dust />
    </Canvas>
  );
}
