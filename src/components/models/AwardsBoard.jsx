import { Html } from '@react-three/drei';
import { useState } from 'react';

import { useCertificateStore } from '../../certificateStore';
import { useT } from '../../i18n';
import { pointerState } from '../../interactionState';
import { useLightingStore } from '../../lightingStore';

const CLICK_DRAG_THRESHOLD = 6;

export function AwardsBoard({ position, rotationY = 0 }) {
  const [hovered, setHovered] = useState(false);
  const isNight = useLightingStore((s) => s.isNight);
  const openCertificates = useCertificateStore((s) => s.openCertificates);
  const t = useT();

  const handlers = {
    onClick: (event) => {
      event.stopPropagation();
      if (pointerState.dragDistance > CLICK_DRAG_THRESHOLD) return;
      openCertificates();
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
      <group position={[0, 0, 0.05]} scale={hovered ? 1.04 : 1} {...handlers}>
        <mesh castShadow>
          <boxGeometry args={[0.66, 0.86, 0.04]} />
          <meshStandardMaterial color="#3f4451" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.56, 0.76]} />
          <meshStandardMaterial
            color="#f7f5f0"
            emissive={hovered ? '#38bdf8' : isNight ? '#ff2d88' : '#000000'}
            emissiveIntensity={hovered ? 0.25 : isNight ? 0.12 : 0}
            roughness={0.9}
          />
        </mesh>

        {/* certificate seal */}
        <mesh position={[0, 0.14, 0.03]}>
          <circleGeometry args={[0.14, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.14, 0.035]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial color="#f7f5f0" roughness={0.6} />
        </mesh>
        <mesh position={[-0.06, -0.05, 0.03]} rotation={[0, 0, 0.5]}>
          <planeGeometry args={[0.07, 0.22]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.6} />
        </mesh>
        <mesh position={[0.06, -0.05, 0.03]} rotation={[0, 0, -0.5]}>
          <planeGeometry args={[0.07, 0.22]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.6} />
        </mesh>

        {/* title rule */}
        <mesh position={[0, -0.25, 0.03]}>
          <planeGeometry args={[0.42, 0.02]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.8} />
        </mesh>
      </group>

      <Html
        position={[0, 0.6, 0.05]}
        center
        distanceFactor={9}
        occlude
        zIndexRange={[1, 0]}
      >
        <div className={`tag ${hovered ? 'tag-active' : ''}`}>
          {t('tag.awards')}
        </div>
      </Html>
    </group>
  );
}
