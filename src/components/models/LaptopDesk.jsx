import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

import { RESUME_PAPER_POSITION } from '../../data/projects';
import { useT } from '../../i18n';
import { pointerState } from '../../interactionState';
import { useViewStore } from '../../viewStore';
import { ResumePaper } from './ResumePaper';

const CLICK_DRAG_THRESHOLD = 6;

const LID_OPEN_ANGLE = -0.35;

const KB_COLS = 11;
const KB_ROWS = 4;
const KEY_W = 0.032;
const KEY_GAP = 0.006;
const KEY_D = 0.022;
const ROW_GAP = 0.006;
const KB_TOTAL_W = KB_COLS * KEY_W + (KB_COLS - 1) * KEY_GAP;
const KB_START_Z = -0.14;
const KEYS = Array.from({ length: KB_ROWS * KB_COLS }, (_, idx) => {
  const row = Math.floor(idx / KB_COLS);
  const col = idx % KB_COLS;
  return {
    x: -KB_TOTAL_W / 2 + col * (KEY_W + KEY_GAP) + KEY_W / 2,
    z: KB_START_Z + row * (KEY_D + ROW_GAP) + KEY_D / 2
  };
});

const worldPos = new THREE.Vector3();
const worldDir = new THREE.Vector3();

export function LaptopDesk({ project, position, rotationY = 0 }) {
  const [hovered, setHovered] = useState(false);
  const sitting = useViewStore((s) => s.sitting);
  const sit = useViewStore((s) => s.sit);
  const setScreenAnchor = useViewStore((s) => s.setScreenAnchor);
  const t = useT();
  const screenRef = useRef();
  const anchorCaptured = useRef(false);

  useFrame(() => {
    if (anchorCaptured.current || !screenRef.current) return;
    anchorCaptured.current = true;
    screenRef.current.getWorldPosition(worldPos);
    screenRef.current.getWorldDirection(worldDir);
    setScreenAnchor({
      position: worldPos.toArray(),
      normal: worldDir.toArray()
    });
  });

  const handlers = {
    onClick: (event) => {
      event.stopPropagation();
      if (pointerState.dragDistance > CLICK_DRAG_THRESHOLD) return;
      sit();
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
      <mesh position={[-0.7, 0.35, -0.35]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#2d2013" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.35, -0.35]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#2d2013" roughness={0.8} />
      </mesh>
      <mesh position={[-0.7, 0.35, 0.35]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#2d2013" roughness={0.8} />
      </mesh>
      <mesh position={[0.7, 0.35, 0.35]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#2d2013" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.06, 0.9]} />
        <meshStandardMaterial color="#6b4a30" roughness={0.55} />
      </mesh>

      <group position={[0, 0.75, -0.05]} scale={hovered ? 1.05 : 1} {...handlers}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.02, 0.34]} />
          <meshStandardMaterial color="#c7cdd6" roughness={0.35} metalness={0.6} />
        </mesh>

        {KEYS.map((k, i) => (
          <mesh key={i} position={[k.x, 0.014, k.z]}>
            <boxGeometry args={[KEY_W, 0.006, KEY_D]} />
            <meshStandardMaterial color="#17181a" roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0.012, 0.06]}>
          <boxGeometry args={[0.16, 0.004, 0.11]} />
          <meshStandardMaterial color="#aab0b9" roughness={0.3} metalness={0.1} />
        </mesh>

        <group position={[0, 0.01, -0.17]} rotation={[LID_OPEN_ANGLE, 0, 0]}>
          <mesh position={[0, 0.14, 0]} castShadow>
            <boxGeometry args={[0.5, 0.28, 0.015]} />
            <meshStandardMaterial color="#c7cdd6" roughness={0.35} metalness={0.6} />
          </mesh>
          <mesh ref={screenRef} position={[0, 0.14, 0.009]}>
            <planeGeometry args={[0.44, 0.24]} />
            <meshStandardMaterial
              color={project.color}
              emissive={project.color}
              emissiveIntensity={hovered ? 1.4 : 0.8}
              toneMapped={false}
            />
          </mesh>

          {sitting && (
            <Html transform position={[0, 0.14, 0.011]} scale={0.02} zIndexRange={[30, 0]}>
              <div className="screen-mockup">
                <div className="screen-chrome">
                  <span className="screen-dot" style={{ background: '#f87171' }} />
                  <span className="screen-dot" style={{ background: '#fbbf24' }} />
                  <span className="screen-dot" style={{ background: '#4ade80' }} />
                  <div className="screen-address">
                    {project.link.replace('https://', '')}
                  </div>
                </div>
                <div className="screen-body">
                  <span
                    className="screen-project-dot"
                    style={{ background: project.color }}
                  />
                  <h2>{project.title}</h2>
                  <p className="screen-tagline">{t('project.tagline')}</p>
                  <p className="screen-desc">{t('project.description')}</p>
                  <div className="screen-tags">
                    {project.tech.map((tech) => (
                      <span key={tech} className="screen-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    className="screen-link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t('screen.openInGithub')}
                  </a>
                </div>
              </div>
            </Html>
          )}
        </group>
      </group>

      <pointLight
        color={project.color}
        intensity={hovered ? 5 : 2}
        distance={3.5}
        position={[0, 1.3, -0.1]}
      />

      <Html position={[0, 1.6, 0]} center distanceFactor={9} occlude zIndexRange={[1, 0]}>
        <div className={`tag ${hovered ? 'tag-active' : ''}`}>{project.title}</div>
      </Html>

      <ResumePaper position={RESUME_PAPER_POSITION} />
    </group>
  );
}
