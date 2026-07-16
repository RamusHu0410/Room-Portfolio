import { useMemo } from 'react';
import * as THREE from 'three';

import {
  DOOR_POSITION,
  ROOM_HALF_X,
  ROOM_HALF_Z,
  WINDOW_POSITION,
  WINDOW_SIZE
} from '../data/projects';
import { Door } from './models/Door';
import { Window, WINDOW_FRAME_MARGIN } from './models/Window';

const WALL_HEIGHT = 2.6;
const WALL_COLOR = '#f5f5f4';

function useWoodFloorTexture(width, depth) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const rows = 8;
    const rowHeight = canvas.height / rows;
    const plankColors = ['#c99760', '#d3a268', '#bd8c52', '#ce9d5f', '#c2905a'];

    for (let r = 0; r < rows; r++) {
      const y = r * rowHeight;
      const segments = 3 + (r % 2);
      const segWidth = canvas.width / segments;
      const offset = (r % 2) * (segWidth / 2);

      for (let s = -1; s < segments + 1; s++) {
        const x = s * segWidth + offset;
        const color = plankColors[(r + s) % plankColors.length];
        ctx.fillStyle = color;
        ctx.fillRect(x, y, segWidth, rowHeight);

        // grain streaks within the plank
        for (let i = 0; i < 5; i++) {
          const gy = y + Math.random() * rowHeight;
          ctx.strokeStyle = `rgba(30, 16, 5, ${0.06 + Math.random() * 0.08})`;
          ctx.lineWidth = 1 + Math.random();
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(
            x + segWidth * 0.3,
            gy + (Math.random() - 0.5) * 4,
            x + segWidth * 0.7,
            gy + (Math.random() - 0.5) * 4,
            x + segWidth,
            gy
          );
          ctx.stroke();
        }

        // plank seam (vertical)
        ctx.strokeStyle = 'rgba(20, 10, 4, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + rowHeight);
        ctx.stroke();
      }

      // row seam (horizontal)
      ctx.strokeStyle = 'rgba(20, 10, 4, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 2.4, depth / 2.4);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [width, depth]);
}

function Wall({ position, rotation, length }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <boxGeometry args={[length, WALL_HEIGHT, 0.3]} />
      <meshStandardMaterial color={WALL_COLOR} roughness={0.85} />
    </mesh>
  );
}

// Wall with a rectangular hole cut out (so embedded doors/windows aren't
// hidden behind the wall's solid body), built from 4 boxes around the opening.
function WallWithOpening({ position, rotation, length, opening }) {
  const { offsetX, bottom, width: ow, height: oh } = opening;
  const halfLen = length / 2;
  const openLeft = offsetX - ow / 2;
  const openRight = offsetX + ow / 2;
  const openTop = bottom + oh;

  const leftWidth = openLeft - -halfLen;
  const rightWidth = halfLen - openRight;
  const leftX = -halfLen + leftWidth / 2;
  const rightX = openRight + rightWidth / 2;
  const topHeight = WALL_HEIGHT - openTop;

  return (
    <group position={position} rotation={rotation}>
      {leftWidth > 0.01 && (
        <mesh position={[leftX, WALL_HEIGHT / 2, 0]} receiveShadow>
          <boxGeometry args={[leftWidth, WALL_HEIGHT, 0.3]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.85} />
        </mesh>
      )}
      {rightWidth > 0.01 && (
        <mesh position={[rightX, WALL_HEIGHT / 2, 0]} receiveShadow>
          <boxGeometry args={[rightWidth, WALL_HEIGHT, 0.3]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.85} />
        </mesh>
      )}
      {bottom > 0.01 && (
        <mesh position={[offsetX, bottom / 2, 0]} receiveShadow>
          <boxGeometry args={[ow, bottom, 0.3]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.85} />
        </mesh>
      )}
      {topHeight > 0.01 && (
        <mesh position={[offsetX, openTop + topHeight / 2, 0]} receiveShadow>
          <boxGeometry args={[ow, topHeight, 0.3]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.85} />
        </mesh>
      )}
    </group>
  );
}

export function Ground() {
  const width = ROOM_HALF_X * 2;
  const depth = ROOM_HALF_Z * 2;
  const woodTexture = useWoodFloorTexture(width, depth);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={woodTexture} roughness={0.55} />
      </mesh>

      <WallWithOpening
        position={[0, 0, -ROOM_HALF_Z]}
        rotation={[0, 0, 0]}
        length={width}
        opening={{
          offsetX: WINDOW_POSITION[0],
          bottom:
            WINDOW_POSITION[1] -
            (WINDOW_SIZE[1] + WINDOW_FRAME_MARGIN + 0.04) / 2,
          width: WINDOW_SIZE[0] + WINDOW_FRAME_MARGIN + 0.04,
          height: WINDOW_SIZE[1] + WINDOW_FRAME_MARGIN + 0.04
        }}
      />
      <Wall
        position={[0, WALL_HEIGHT / 2, ROOM_HALF_Z]}
        rotation={[0, 0, 0]}
        length={width}
      />
      <Wall
        position={[-ROOM_HALF_X, WALL_HEIGHT / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        length={depth}
      />
      <Wall
        position={[ROOM_HALF_X, WALL_HEIGHT / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        length={depth}
      />

      <mesh
        position={[0, WALL_HEIGHT, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f7f7f5" roughness={0.95} />
      </mesh>

      <Door position={DOOR_POSITION} />
      <Window position={WINDOW_POSITION} size={WINDOW_SIZE} />
    </group>
  );
}
