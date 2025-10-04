// PlanetScene.tsx
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { FC } from "react";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import PlanetModelearth from "./planetmodelearth";

const CameraAnimation = () => {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera; // ✅ cast
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (progress.current < 1) {
      progress.current += delta * 0.3; // control zoom speed
      const t = THREE.MathUtils.smoothstep(progress.current, 0, 1);

      // starting position (far away)
      const start = new THREE.Vector3(0, 0, 50);
      // target position (closer to planet)
      const end = new THREE.Vector3(0, 1.5, 4.5);

      perspectiveCamera.position.lerpVectors(start, end, t);

      // zoom effect
      perspectiveCamera.fov = THREE.MathUtils.lerp(75, 45, t);
      perspectiveCamera.updateProjectionMatrix();
    }
  });

  return null;
};

const PlanetSceneearth: FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75 }} // start far away
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
          {/* Lights */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          {/* Camera Animation */}
          <CameraAnimation />

          {/* Planet */}
          <PlanetModelearth scale={1.5} />

          {/* Stars */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={5}
            saturation={0}
            fade
            speed={1}
          />

          {/* Orbit controls */}
          <OrbitControls enableZoom zoomSpeed={0.6} rotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PlanetSceneearth;
