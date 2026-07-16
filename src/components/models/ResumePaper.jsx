import { Html } from '@react-three/drei';
import { useState } from 'react';

import { useT } from '../../i18n';
import { pointerState } from '../../interactionState';
import { useResumeStore } from '../../resumeStore';

const CLICK_DRAG_THRESHOLD = 6;

function Line({ z, width, color = '#94a3b8' }) {
  return (
    <mesh position={[0, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, 0.018]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

export function ResumePaper({ position }) {
  const [hovered, setHovered] = useState(false);
  const openResume = useResumeStore((s) => s.openResume);
  const t = useT();

  const handlers = {
    onClick: (event) => {
      event.stopPropagation();
      if (pointerState.dragDistance > CLICK_DRAG_THRESHOLD) return;
      openResume();
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
    <group
      position={position}
      rotation={[0, 0.12, 0]}
      scale={hovered ? 1.03 : 1}
      {...handlers}
    >
      <mesh position={[0, 0.005, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.01, 0.36]} />
        <meshStandardMaterial
          color="#f7f5f0"
          emissive={hovered ? '#38bdf8' : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
          roughness={0.9}
        />
      </mesh>

      <Line z={-0.13} width={0.16} color="#1e293b" />
      <Line z={-0.08} width={0.2} />
      <Line z={-0.03} width={0.18} />
      <Line z={0.02} width={0.2} />
      <Line z={0.07} width={0.14} />
      <Line z={0.12} width={0.19} />

      <Html
        position={[0, 0.4, 0]}
        center
        distanceFactor={9}
        occlude
        zIndexRange={[1, 0]}
      >
        <div className={`tag ${hovered ? 'tag-active' : ''}`}>{t('tag.resume')}</div>
      </Html>
    </group>
  );
}
