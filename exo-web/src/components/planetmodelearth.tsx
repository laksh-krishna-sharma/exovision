import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface PlanetModelProps {
  scale?: number;
  position?: [number, number, number];
}

export default function PlanetModelearth({ scale = 1, position = [0, 0, 0] }: PlanetModelProps) {
  // Let TypeScript infer the type
  const gltf = useGLTF("/alien_planet.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.003;
    }
  });

  return <primitive ref={ref} object={gltf.scene} scale={scale} position={position} />;
}

// Preload model
useGLTF.preload("/alien_planet.glb");