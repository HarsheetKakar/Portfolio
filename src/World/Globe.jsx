import React, { useMemo, useEffect, useState } from 'react';
import GlobeContext from './context/GlobeContext';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

function setScale(prev, factor) {
    console.log('Scale factor', prev * factor);
    return prev * factor;
}

export default function Globe({ radius, children }) {
    const center = new THREE.Vector3(0, 0, 0);
    console.log('Radius of globe', radius);

    // Load the glTF model from the public folder.
    const gltf = useGLTF('/models/kamisama_planet/scene.gltf');

    // Center the model (if not already centered) by computing its bounding box.
    useEffect(() => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const modelCenter = new THREE.Vector3();
        box.getCenter(modelCenter);
        // Adjust the position so that the model is centered at the origin.
        gltf.scene.position.sub(modelCenter);
    }, [gltf]);

    // Compute an initial scale factor to make the model's max dimension equal to the sphere's diameter.
    const scaleFactor = 0.18684; // COMMENT: through hit and trial

    // Create a state to hold the scale factor so that we can update it with key presses.
    return (
        <group>
            {/* The sphere mesh representing the globe */}
            <mesh>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial color="hotpink" wireframe />
            </mesh>

            {/* The GLTF model scaled and centered */}
            <primitive
                object={gltf.scene}
                scale={[scaleFactor, scaleFactor, scaleFactor]}
                position={[0, 0, 0]}
            />

            <GlobeContext.Provider value={{ radius, center }}>
                {children}
            </GlobeContext.Provider>
        </group>
    );
}
