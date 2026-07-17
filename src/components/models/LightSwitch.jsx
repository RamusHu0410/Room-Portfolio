import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

import { useT } from '../../i18n';
import { pointerState } from '../../interactionState';
import { useLightingStore } from '../../lightingStore';

const CLICK_DRAG_THRESHOLD = 6;
const KNOB_UP_Y = 0.03;
const KNOB_DOWN_Y = -0.03;

export function LightSwitch({ position }) {
  const [hovered, setHovered] = useState(false);
  const isNight = useLightingStore((s) => s.isNight);
  const toggleNight = useLightingStore((s) => s.toggleNight);
  const t = useT();
  const knobRef = useRef();

  useFrame((_, delta) => {
    if (!knobRef.current) return;
    const smoothing = 1 - Math.pow(0.0005, delta);
    const target = isNight ? KNOB_DOWN_Y : KNOB_UP_Y;
    knobRef.current.position.y = THREE.MathUtils.lerp(
      knobRef.current.position.y,
      target,
      smoothing
    );
  });

  const handlers = {
    onClick: (event) => {
      event.stopPropagation();
      if (pointerState.dragDistance > CLICK_DRAG_THRESHOLD) return;
      toggleNight();
    },
    onPointerOver: (event) => {
      event.stopPropagation();
      setHovered(true);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      setHovered(false);
      document.body.style.cursor = 'auto';
    }
  };

  return (
    <group position={position}>
      <group scale={hovered ? 1.12 : 1} {...handlers}>
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.19, 0.02]} />
          <meshStandardMaterial color="#ece7db" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[0.09, 0.15, 0.014]} />
          <meshStandardMaterial color="#c9c3b3" roughness={0.6} />
        </mesh>
        <mesh
          ref={knobRef}
          position={[0, isNight ? KNOB_DOWN_Y : KNOB_UP_Y, 0.021]}
        >
          <boxGeometry args={[0.045, 0.07, 0.018]} />
          <meshStandardMaterial color="#f5f2ea" roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.075, 0.013]}>
          <circleGeometry args={[0.007, 12]} />
          <meshStandardMaterial
            color={isNight ? '#ffb454' : '#3a3a3a'}
            emissive={isNight ? '#ffb454' : '#000000'}
            emissiveIntensity={isNight ? 1.6 : 0}
            toneMapped={false}
          />
        </mesh>
      </group>

      <Html
        position={[0, 0.17, 0]}
        center
        distanceFactor={9}
        occlude
        zIndexRange={[1, 0]}
      >
        <div className={`tag ${hovered ? 'tag-active' : ''}`}>
          {t('tag.lightSwitch')}
        </div>
      </Html>
    </group>
  );
}
