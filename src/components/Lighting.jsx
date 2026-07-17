import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

import { useLightingStore } from '../lightingStore';

const DAY_BACKGROUND = new THREE.Color('#bfe0fb');
const NIGHT_BACKGROUND = new THREE.Color('#05070d');
const DAY_FOG = new THREE.Color('#cfe6fb');
const NIGHT_FOG = new THREE.Color('#05070d');
const DAY_SUN = new THREE.Color('#fff4e0');
const NIGHT_MOON = new THREE.Color('#5c7bb8');
const DAY_AMBIENT = new THREE.Color('#ffffff');
const NIGHT_AMBIENT = new THREE.Color('#3a4a7a');

const scratchColor = new THREE.Color();

// Real-time equivalent of the original project's baked day/night lightmap
// switch: everything here is interpolated by a single 0..1 mix driven by
// lightingStore, instead of blending two baked textures in a shader.
export function Lighting() {
  const { scene } = useThree();
  const ambientRef = useRef();
  const directionalRef = useRef();
  const mix = useRef(useLightingStore.getState().isNight ? 1 : 0);

  useFrame((_, delta) => {
    const target = useLightingStore.getState().isNight ? 1 : 0;
    const smoothing = 1 - Math.pow(0.001, delta);
    mix.current = THREE.MathUtils.lerp(mix.current, target, smoothing);
    const m = mix.current;

    if (scene.background) {
      scene.background.copy(
        scratchColor.copy(DAY_BACKGROUND).lerp(NIGHT_BACKGROUND, m)
      );
    }
    if (scene.fog) {
      scene.fog.color.copy(scratchColor.copy(DAY_FOG).lerp(NIGHT_FOG, m));
      scene.fog.near = THREE.MathUtils.lerp(16, 13, m);
      scene.fog.far = THREE.MathUtils.lerp(32, 22, m);
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(0.75, 0.18, m);
      ambientRef.current.color.copy(
        scratchColor.copy(DAY_AMBIENT).lerp(NIGHT_AMBIENT, m)
      );
    }
    if (directionalRef.current) {
      directionalRef.current.intensity = THREE.MathUtils.lerp(1.2, 0.2, m);
      directionalRef.current.color.copy(
        scratchColor.copy(DAY_SUN).lerp(NIGHT_MOON, m)
      );
    }
  });

  const initialNight = useLightingStore.getState().isNight;

  return (
    <>
      <color
        attach="background"
        args={[initialNight ? '#05070d' : '#bfe0fb']}
      />
      <fog
        attach="fog"
        args={initialNight ? ['#05070d', 13, 22] : ['#cfe6fb', 16, 32]}
      />
      <ambientLight
        ref={ambientRef}
        intensity={initialNight ? 0.18 : 0.75}
        color={initialNight ? '#3a4a7a' : '#ffffff'}
      />
      <directionalLight
        ref={directionalRef}
        position={[6, 10, 4]}
        intensity={initialNight ? 0.2 : 1.2}
        color={initialNight ? '#5c7bb8' : '#fff4e0'}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
    </>
  );
}
