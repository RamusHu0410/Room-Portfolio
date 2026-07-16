import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import {
  CHAIR_COLLISION_RADIUS,
  CHAIR_POSITION,
  DESK_COLLISION_RADIUS,
  DESK_POSITION,
  EYE_HEIGHT,
  PIANO_COLLISION_RADIUS,
  PIANO_POSITION,
  ROOM_HALF_X,
  ROOM_HALF_Z,
  SIT_DISTANCE,
  SIT_FOV,
  SPAWN_POSITION,
  WALK_MARGIN
} from '../data/projects';
import { useKeyboard } from '../hooks/useKeyboard';
import { pointerState } from '../interactionState';
import { useSettingsStore } from '../settingsStore';
import { useViewStore } from '../viewStore';

const SPEED = 4.0;
const LOOK_SENSITIVITY = 0.0028;
const ZOOM_SENSITIVITY = 0.04;
const MIN_FOV = 28;
const MAX_FOV = 72;
const MIN_PITCH = -0.8;
const MAX_PITCH = 0.8;
const TRANSITION_SPEED = 0.0025;

const INITIAL_YAW = Math.atan2(
  DESK_POSITION[0] - SPAWN_POSITION[0],
  -(DESK_POSITION[2] - SPAWN_POSITION[2])
);

const scratchNext = new THREE.Vector3();
const scratchForward = new THREE.Vector3();
const targetPos = new THREE.Vector3();
const targetLookAt = new THREE.Vector3();
const anchorPos = new THREE.Vector3();
const anchorNormal = new THREE.Vector3();

export function FirstPersonRig() {
  const { camera, gl } = useThree();
  const keys = useKeyboard();
  const position = useRef(
    new THREE.Vector3(SPAWN_POSITION[0], 0, SPAWN_POSITION[2])
  );
  const yaw = useRef(INITIAL_YAW);
  const pitch = useRef(-0.1);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const smoothPos = useRef(
    new THREE.Vector3(SPAWN_POSITION[0], EYE_HEIGHT, SPAWN_POSITION[2])
  );
  const smoothLookAt = useRef(new THREE.Vector3(0, EYE_HEIGHT, 0));
  const desiredFov = useRef(camera.fov);
  const preSitFov = useRef(camera.fov);
  const wasSitting = useRef(false);

  useEffect(() => {
    const el = gl.domElement;

    const onPointerDown = (event) => {
      if (useViewStore.getState().sitting) return;
      dragging.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      pointerState.dragDistance = 0;
    };
    const onPointerMove = (event) => {
      if (!dragging.current || useViewStore.getState().sitting) return;
      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      pointerState.dragDistance += Math.abs(dx) + Math.abs(dy);
      const { invertX, invertY } = useSettingsStore.getState();
      const yawSign = invertX ? 1 : -1;
      const pitchSign = invertY ? -1 : 1;
      yaw.current += yawSign * dx * LOOK_SENSITIVITY;
      pitch.current = THREE.MathUtils.clamp(
        pitch.current + pitchSign * dy * LOOK_SENSITIVITY,
        MIN_PITCH,
        MAX_PITCH
      );
    };
    const onPointerUp = () => {
      dragging.current = false;
    };
    const onWheel = (event) => {
      if (useViewStore.getState().sitting) return;
      event.preventDefault();
      desiredFov.current = THREE.MathUtils.clamp(
        desiredFov.current + event.deltaY * ZOOM_SENSITIVITY,
        MIN_FOV,
        MAX_FOV
      );
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [camera, gl]);

  useFrame((_, delta) => {
    const { sitting, screenAnchor } = useViewStore.getState();

    if (!sitting) {
      const inputForward = (keys.current.up ? 1 : 0) - (keys.current.down ? 1 : 0);
      const inputRight = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);

      if (inputForward !== 0 || inputRight !== 0) {
        const sin = Math.sin(yaw.current);
        const cos = Math.cos(yaw.current);
        const moveX = inputRight * cos + inputForward * sin;
        const moveZ = inputRight * sin - inputForward * cos;
        const len = Math.hypot(moveX, moveZ) || 1;

        scratchNext.set(
          position.current.x + (moveX / len) * SPEED * delta,
          0,
          position.current.z + (moveZ / len) * SPEED * delta
        );
        scratchNext.x = THREE.MathUtils.clamp(
          scratchNext.x,
          -(ROOM_HALF_X - WALK_MARGIN),
          ROOM_HALF_X - WALK_MARGIN
        );
        scratchNext.z = THREE.MathUtils.clamp(
          scratchNext.z,
          -(ROOM_HALF_Z - WALK_MARGIN),
          ROOM_HALF_Z - WALK_MARGIN
        );

        const distToDesk = Math.hypot(
          scratchNext.x - DESK_POSITION[0],
          scratchNext.z - DESK_POSITION[2]
        );
        const distToChair = Math.hypot(
          scratchNext.x - CHAIR_POSITION[0],
          scratchNext.z - CHAIR_POSITION[2]
        );
        const distToPiano = Math.hypot(
          scratchNext.x - PIANO_POSITION[0],
          scratchNext.z - PIANO_POSITION[2]
        );
        if (
          distToDesk > DESK_COLLISION_RADIUS &&
          distToChair > CHAIR_COLLISION_RADIUS &&
          distToPiano > PIANO_COLLISION_RADIUS
        ) {
          position.current.x = scratchNext.x;
          position.current.z = scratchNext.z;
        }
      }
    }

    if (sitting && !wasSitting.current) {
      preSitFov.current = desiredFov.current;
      desiredFov.current = SIT_FOV;
    } else if (!sitting && wasSitting.current) {
      desiredFov.current = preSitFov.current;
    }
    wasSitting.current = sitting;

    if (sitting && screenAnchor) {
      anchorPos.fromArray(screenAnchor.position);
      anchorNormal.fromArray(screenAnchor.normal);
      targetLookAt.copy(anchorPos);
      targetPos.copy(anchorPos).addScaledVector(anchorNormal, SIT_DISTANCE);
    } else if (!sitting) {
      targetPos.set(position.current.x, EYE_HEIGHT, position.current.z);
      scratchForward.set(
        Math.sin(yaw.current) * Math.cos(pitch.current),
        Math.sin(pitch.current),
        -Math.cos(yaw.current) * Math.cos(pitch.current)
      );
      targetLookAt.copy(targetPos).add(scratchForward);
    }

    const smoothing = 1 - Math.pow(TRANSITION_SPEED, delta);
    smoothPos.current.lerp(targetPos, smoothing);
    smoothLookAt.current.lerp(targetLookAt, smoothing);
    camera.fov = THREE.MathUtils.lerp(camera.fov, desiredFov.current, smoothing);
    camera.updateProjectionMatrix();

    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothLookAt.current);
  });

  return null;
}
