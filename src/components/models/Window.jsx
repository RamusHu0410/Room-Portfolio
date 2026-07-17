import { useMemo } from 'react';
import * as THREE from 'three';

import { useLightingStore } from '../../lightingStore';

function useSkyTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#7fb8f5');
    sky.addColorStop(0.55, '#bfe0fb');
    sky.addColorStop(1, '#eef7ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sun = ctx.createRadialGradient(190, 60, 4, 190, 60, 70);
    sun.addColorStop(0, 'rgba(255, 250, 230, 0.95)');
    sun.addColorStop(1, 'rgba(255, 250, 230, 0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawCloud = (x, y, scale) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      [
        [0, 0, 26],
        [22, -6, 20],
        [-22, -4, 18],
        [12, 8, 20],
        [-12, 8, 18]
      ].forEach(([dx, dy, r]) => {
        ctx.beginPath();
        ctx.arc(x + dx * scale, y + dy * scale, r * scale, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    drawCloud(70, 90, 0.9);
    drawCloud(150, 170, 0.7);
    drawCloud(50, 200, 0.55);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function useNightSkyTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
    sky.addColorStop(0, '#050914');
    sky.addColorStop(0.6, '#0c1730');
    sky.addColorStop(1, '#1a2b4a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const moonGlow = ctx.createRadialGradient(180, 55, 4, 180, 55, 55);
    moonGlow.addColorStop(0, 'rgba(230, 238, 255, 0.85)');
    moonGlow.addColorStop(1, 'rgba(230, 238, 255, 0)');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e6eeff';
    ctx.beginPath();
    ctx.arc(180, 55, 16, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 60; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.75;
      const r = Math.random() * 1.1 + 0.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + Math.random() * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

const TRIM_THICKNESS = 0.14;
const TRIM_DEPTH = 0.08;
const TRIM_COLOR = '#3f4451';

// total extra width/height the sill + outer trim add beyond the raw glass size,
// used by Ground.jsx to size the matching hole cut into the wall
export const WINDOW_FRAME_MARGIN = 0.16 + TRIM_THICKNESS * 2;

export function Window({ position, size = [1.6, 1.8] }) {
  const [w, h] = size;
  const isNight = useLightingStore((s) => s.isNight);
  const daySkyTexture = useSkyTexture();
  const nightSkyTexture = useNightSkyTexture();

  const sillW = w + 0.16;
  const sillH = h + 0.16;
  const trimW = sillW + TRIM_THICKNESS * 2;
  const trimZ = 0.06 + TRIM_DEPTH / 2;

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[sillW, sillH, 0.12]} />
        <meshStandardMaterial color="#565c6b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          map={isNight ? nightSkyTexture : daySkyTexture}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[w, 0.05, 0.02]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[0.05, h, 0.02]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* outer casing/trim frame mounted on the wall around the window */}
      <mesh
        position={[0, sillH / 2 + TRIM_THICKNESS / 2, trimZ]}
        castShadow
      >
        <boxGeometry args={[trimW, TRIM_THICKNESS, TRIM_DEPTH]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.7} />
      </mesh>
      <mesh
        position={[0, -(sillH / 2 + TRIM_THICKNESS / 2), trimZ]}
        castShadow
      >
        <boxGeometry args={[trimW, TRIM_THICKNESS, TRIM_DEPTH]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.7} />
      </mesh>
      <mesh
        position={[-(sillW / 2 + TRIM_THICKNESS / 2), 0, trimZ]}
        castShadow
      >
        <boxGeometry args={[TRIM_THICKNESS, sillH, TRIM_DEPTH]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.7} />
      </mesh>
      <mesh
        position={[sillW / 2 + TRIM_THICKNESS / 2, 0, trimZ]}
        castShadow
      >
        <boxGeometry args={[TRIM_THICKNESS, sillH, TRIM_DEPTH]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.7} />
      </mesh>

      <pointLight
        position={[0, 0, 1.2]}
        intensity={isNight ? 0.6 : 5}
        distance={9}
        color={isNight ? '#7fa8e0' : '#fff4e0'}
      />
    </group>
  );
}
