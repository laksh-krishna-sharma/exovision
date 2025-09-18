// src/components/SpaceObjects.tsx
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react"
import * as THREE from "three";;

function FloatingObject({ url, position }: { url: string; position: [number, number, number] }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Object3D>(null!);

  // assign random drift + spin velocities once per object
  const drift = useRef({
    dx: (Math.random() - 0.5) * 0.01, // small drift left/right
    dy: (Math.random() - 0.5) * 0.01, // small drift up/down
    dz: (Math.random() - 0.5) * 0.01, // small drift forward/back
    rx: (Math.random() - 0.5) * 0.005, // slow rotation x
    ry: (Math.random() - 0.5) * 0.005, // slow rotation y
    rz: (Math.random() - 0.5) * 0.005, // slow rotation z
  });

  useFrame(() => {
    if (ref.current) {
      // apply drift
      ref.current.position.x += drift.current.dx;
      ref.current.position.y += drift.current.dy;
      ref.current.position.z += drift.current.dz;

      // apply rotation
      ref.current.rotation.x += drift.current.rx;
      ref.current.rotation.y += drift.current.ry;
      ref.current.rotation.z += drift.current.rz;

      // optional: wrap around if object drifts too far
      const limit = 5; // "space box" size
      ["x", "y", "z"].forEach((axis) => {
        // @ts-ignore
        if (ref.current.position[axis] > limit) ref.current.position[axis] = -limit;
        // @ts-ignore
        if (ref.current.position[axis] < -limit) ref.current.position[axis] = limit;
      });
    }
  });

  return <primitive object={scene} ref={ref} position={position} scale={1.5} />;
}

export default function SpaceObjects() {
  return (
    <div className="absolute inset-0 -z-5 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          {/* Add astronaut & satellite models */}
          <FloatingObject url="/cute_astronaut.glb" position={[-2, 0, 0]} />
            <FloatingObject url="/satelite2.glb" position={[2, 1, 0]} />  
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
