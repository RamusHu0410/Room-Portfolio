import { Html } from '@react-three/drei';
import { useMemo, useState } from 'react';
import * as THREE from 'three';

import { useT } from '../../i18n';
import { pointerState } from '../../interactionState';
import { useLightingStore } from '../../lightingStore';
import { useVideoStore } from '../../videoStore';

const CLICK_DRAG_THRESHOLD = 6;
const LEG_HEIGHT = 0.68;
const BODY_HEIGHT = 0.32;

const KEYBOARD_WIDTH = 1.1;
const WHITE_KEY_COUNT = 52;
const WHITE_KEY_WIDTH = KEYBOARD_WIDTH / WHITE_KEY_COUNT;
const WHITE_KEY_GAP = 0.0015;
const WHITE_KEY_DEPTH = 0.13;
const BLACK_KEY_WIDTH = WHITE_KEY_WIDTH * 0.56;
const BLACK_KEY_DEPTH = 0.08;
const BLACK_KEY_PATTERN = [0, 1, 3, 4, 5];

function usePianoShape() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.62, 0);
    shape.lineTo(0.62, 0);
    shape.quadraticCurveTo(0.72, 0.02, 0.66, 0.22);
    shape.quadraticCurveTo(0.82, 0.5, 0.78, 0.95);
    shape.quadraticCurveTo(0.7, 1.4, 0.28, 1.68);
    shape.quadraticCurveTo(0.08, 1.78, 0, 1.85);
    shape.quadraticCurveTo(-0.08, 1.78, -0.28, 1.68);
    shape.quadraticCurveTo(-0.7, 1.4, -0.78, 0.95);
    shape.quadraticCurveTo(-0.82, 0.5, -0.66, 0.22);
    shape.quadraticCurveTo(-0.72, 0.02, -0.62, 0);
    shape.closePath();
    return shape;
  }, []);
}

function useKeyLayout() {
  return useMemo(() => {
    const white = [];
    for (let i = 0; i < WHITE_KEY_COUNT; i++) {
      white.push(-KEYBOARD_WIDTH / 2 + WHITE_KEY_WIDTH * (i + 0.5));
    }
    const black = [];
    for (let i = 0; i < WHITE_KEY_COUNT - 1; i++) {
      if (BLACK_KEY_PATTERN.includes(i % 7)) {
        black.push(-KEYBOARD_WIDTH / 2 + WHITE_KEY_WIDTH * (i + 1));
      }
    }
    return { white, black };
  }, []);
}

function Leg({ position }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[0.035, 0.05, LEG_HEIGHT, 12]} />
      <meshStandardMaterial color="#161616" roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

export function Piano({ position, rotationY = 0 }) {
  const [hovered, setHovered] = useState(false);
  const isNight = useLightingStore((s) => s.isNight);
  const openVideo = useVideoStore((s) => s.openVideo);
  const shape = usePianoShape();
  const { white, black } = useKeyLayout();
  const t = useT();

  const extrudeSettings = useMemo(
    () => ({
      depth: BODY_HEIGHT,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 6,
      curveSegments: 32
    }),
    []
  );

  const handlers = {
    onClick: (event) => {
      event.stopPropagation();
      if (pointerState.dragDistance > CLICK_DRAG_THRESHOLD) return;
      openVideo();
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
    <group position={position} rotation={[0, rotationY, 0]}>
      <group scale={hovered ? 1.015 : 1} {...handlers}>
        <Leg position={[0.52, LEG_HEIGHT / 2, -0.08]} />
        <Leg position={[-0.52, LEG_HEIGHT / 2, -0.08]} />
        <Leg position={[0, LEG_HEIGHT / 2, -1.05]} />

        <mesh
          position={[0, LEG_HEIGHT, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial
            color="#1c1a17"
            roughness={0.22}
            metalness={0.1}
            emissive={hovered ? '#38bdf8' : '#000000'}
            emissiveIntensity={hovered ? 0.15 : 0}
          />
        </mesh>

        <pointLight
          color="#fff6e0"
          intensity={hovered ? 3.6 : isNight ? 2.6 : 1.4}
          distance={3}
          position={[0.3, LEG_HEIGHT + 1.1, -0.6]}
        />

        {/* keybed */}
        <mesh position={[0, LEG_HEIGHT + 0.008, 0.09]}>
          <boxGeometry args={[KEYBOARD_WIDTH + 0.06, 0.016, WHITE_KEY_DEPTH + 0.03]} />
          <meshStandardMaterial color="#efe9df" roughness={0.4} />
        </mesh>

        {/* 52 white keys */}
        {white.map((x, i) => (
          <mesh key={`w${i}`} position={[x, LEG_HEIGHT + 0.021, 0.095]}>
            <boxGeometry
              args={[WHITE_KEY_WIDTH - WHITE_KEY_GAP, 0.012, WHITE_KEY_DEPTH]}
            />
            <meshStandardMaterial color="#fbfaf6" roughness={0.3} />
          </mesh>
        ))}

        {/* 36 black keys */}
        {black.map((x, i) => (
          <mesh key={`b${i}`} position={[x, LEG_HEIGHT + 0.028, 0.055]}>
            <boxGeometry args={[BLACK_KEY_WIDTH, 0.016, BLACK_KEY_DEPTH]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.25} />
          </mesh>
        ))}
      </group>

      <Html
        position={[0, LEG_HEIGHT + BODY_HEIGHT + 0.9, -0.5]}
        center
        distanceFactor={9}
        occlude
        zIndexRange={[1, 0]}
      >
        <div className={`tag ${hovered ? 'tag-active' : ''}`}>{t('tag.piano')}</div>
      </Html>
    </group>
  );
}
