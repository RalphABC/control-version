"use client";

import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Module-level defaults — never mutated, safe to share
const DEFAULT_MOUSE: React.RefObject<{ x: number; y: number }> = { current: { x: 0, y: 0 } };
const DEFAULT_SCROLL: React.RefObject<number> = { current: 0 };
const DEFAULT_STYLE: React.CSSProperties = { width: '100%', height: '100%' };

interface SceneProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  scrollRef: React.RefObject<number>;
  autoRotate: boolean;
  modelScale: number;
}

function ModelScene({ mouseRef, scrollRef, autoRotate, modelScale }: SceneProps) {
  const gltf = useGLTF('/model3D_final.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

  const { scene, offset } = useMemo(() => {
    const s = gltf.scene.clone(true);

    // Disable frustum culling and optimize materials to prevent flickering/popping during rotation
    s.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.frustumCulled = false;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            mat.side = THREE.DoubleSide;
            mat.depthWrite = true;
          });
        }
      }
    });

    const box = new THREE.Box3().setFromObject(s);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) s.scale.setScalar((2 * modelScale) / maxDim);
    const scaledBox = new THREE.Box3().setFromObject(s);
    const center = scaledBox.getCenter(new THREE.Vector3());
    return { scene: s, offset: center };
  }, [gltf.scene, modelScale]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    if (autoRotate) {
      // Use absolute time for rotation to prevent frame rate drops or timing fluctuations from causing stutters
      groupRef.current.rotation.y = t * 0.36;
    } else {
      const targetY = scrollRef.current * Math.PI * 2;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.07;
    }

    groupRef.current.rotation.x += (mouseRef.current.y * 0.25 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.position.y = Math.sin(t * 0.52) * 0.12;
  });

  return (
    <group ref={groupRef}>
      <group position={[-offset.x, -offset.y, -offset.z]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export interface Model3DProps {
  mouseRef?: React.RefObject<{ x: number; y: number }>;
  scrollRef?: React.RefObject<number>;
  autoRotate?: boolean;
  modelScale?: number;
  cameraZ?: number;
  style?: React.CSSProperties;
  accentColor?: string;
  accentColorSecondary?: string;
}

export const Model3D = React.memo(function Model3D({
  mouseRef = DEFAULT_MOUSE,
  scrollRef = DEFAULT_SCROLL,
  autoRotate = true,
  modelScale = 1,
  cameraZ = 4.5,
  style = DEFAULT_STYLE,
  accentColor = "#FACC15",
  accentColorSecondary = "#F59E0B",
}: Model3DProps) {
  // Memoized so Canvas never sees new object references between renders
  const camera = useMemo(
    () => ({ position: [0, 0.3, cameraZ] as [number, number, number], fov: 42, near: 0.1, far: 50 }),
    [cameraZ]
  );
  const gl = useMemo(
    () => ({
      alpha: true as const,
      antialias: true,
      powerPreference: 'high-performance' as const,
      logarithmicDepthBuffer: true, // Solves depth sorting / Z-fighting issues
    }),
    []
  );

  return (
    <Canvas
      camera={camera}
      style={style}
      gl={gl}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.65} />
        <pointLight position={[3, 4, 3]} intensity={9} color={accentColor} />
        <pointLight position={[-4, -1, 3]} intensity={4.5} color={accentColorSecondary} />
        <pointLight position={[0, 4, -4]} intensity={3} color="#ffffff" />
        <pointLight position={[0, -3, 2]} intensity={2} color={accentColor} />
        <ModelScene
          mouseRef={mouseRef}
          scrollRef={scrollRef}
          autoRotate={autoRotate}
          modelScale={modelScale}
        />
      </Suspense>
    </Canvas>
  );
});

useGLTF.preload('/model3D_final.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
