import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { FC } from "react";
import { Suspense } from "react";
import PlanetModel from "./planetmodel";

const PlanetScene: FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
          {/* Lights */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          {/* Planet */}
          <PlanetModel scale={1.5} />

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

export default PlanetScene;