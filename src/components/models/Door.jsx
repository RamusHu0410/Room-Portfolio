export function Door({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.15, -0.02]}>
        <boxGeometry args={[1.05, 2.3, 0.1]} />
        <meshStandardMaterial color="#1c1410" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.025, -0.09]}>
        <boxGeometry args={[0.9, 2.05, 0.06]} />
        <meshStandardMaterial color="#6b4a30" roughness={0.5} />
      </mesh>
      <mesh position={[0.32, 1.0, -0.14]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}
