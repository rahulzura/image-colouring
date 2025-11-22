// RoomModel.jsx
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function RoomModel() {
  const { scene } = useGLTF("/room.glb");

  // Persist map across renders
  const overlayMapRef = useRef(new Map());

  // Mark selectable meshes (done once)
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.userData.selectable = true;
      }
    });
  }, [scene]);

  const addOverlay = (mesh) => {
    const overlayMap = overlayMapRef.current;
    if (overlayMap.has(mesh)) return; // already has overlay

    const overlayMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00, // yellow
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });

    // Use original geometry (no clone required unless you want independence)
    const overlay = new THREE.Mesh(mesh.geometry, overlayMat);

    // Parent inside same group so transforms match
    mesh.parent.add(overlay);

    // copy local transform to overlay so its matrix relative to parent matches
    overlay.position.copy(mesh.position);
    overlay.rotation.copy(mesh.rotation);
    overlay.scale.copy(mesh.scale);

    overlay.renderOrder = 999;
    overlay.material.depthTest = false;

    overlayMap.set(mesh, overlay);
  };

  const removeOverlay = (mesh) => {
    const overlayMap = overlayMapRef.current;
    const overlay = overlayMap.get(mesh);
    if (!overlay) return;

    // remove and dispose
    if (overlay.parent) overlay.parent.remove(overlay);
    if (overlay.geometry) overlay.geometry.dispose();
    if (overlay.material) overlay.material.dispose();

    overlayMap.delete(mesh);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (!mesh || !mesh.userData.selectable) return;
    addOverlay(mesh);
    console.log("Single click → added overlay:", mesh.name);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    const mesh = e.object;
    if (!mesh || !mesh.userData.selectable) return;
    removeOverlay(mesh);
    console.log("Double click → removed overlay:", mesh.name);
  };

  return (
    <primitive
      object={scene}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  );
}
