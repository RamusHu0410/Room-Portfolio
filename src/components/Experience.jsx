import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import {
  AWARDS_BOARD_POSITION,
  AWARDS_BOARD_ROTATION_Y,
  CHAIR_POSITION,
  CHAIR_ROTATION_Y,
  DESK_POSITION,
  DESK_ROTATION_Y,
  PIANO_POSITION,
  PIANO_ROTATION_Y,
  PROJECTS
} from '../data/projects';
import { FirstPersonRig } from './FirstPersonRig';
import { Ground } from './Ground';
import { Lighting } from './Lighting';
import { AwardsBoard } from './models/AwardsBoard';
import { Chair } from './models/Chair';
import { LaptopDesk } from './models/LaptopDesk';
import { Piano } from './models/Piano';

export function Experience() {
  return (
    <Canvas shadows camera={{ fov: 50, position: [0, 1.5, 2.0] }}>
      <Lighting />

      <Suspense fallback={null}>
        <Ground />
        <LaptopDesk
          project={PROJECTS[0]}
          position={DESK_POSITION}
          rotationY={DESK_ROTATION_Y}
        />
        <Chair position={CHAIR_POSITION} rotationY={CHAIR_ROTATION_Y} />
        <AwardsBoard
          position={AWARDS_BOARD_POSITION}
          rotationY={AWARDS_BOARD_ROTATION_Y}
        />
        <Piano position={PIANO_POSITION} rotationY={PIANO_ROTATION_Y} />
      </Suspense>

      <FirstPersonRig />
    </Canvas>
  );
}
