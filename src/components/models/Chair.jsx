function Leg({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.06, 0.46, 0.06]} />
      <meshStandardMaterial color="#2d2013" roughness={0.8} />
    </mesh>
  );
}

export function Chair({ position, rotationY = 0 }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Leg position={[-0.28, 0.23, -0.28]} />
      <Leg position={[0.28, 0.23, -0.28]} />
      <Leg position={[-0.28, 0.23, 0.28]} />
      <Leg position={[0.28, 0.23, 0.28]} />

      <mesh position={[0, 0.47, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.06, 0.6]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      <mesh position={[0, 0.78, -0.28]} castShadow>
        <boxGeometry args={[0.58, 0.58, 0.06]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>
    </group>
  );
}
