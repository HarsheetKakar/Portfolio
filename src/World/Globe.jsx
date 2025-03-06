import React, { useMemo, useEffect, useState } from 'react';
import GlobeContext from './context/GlobeContext';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

export default function Globe({ radius, children }) {
    const center = new THREE.Vector3(0, 0, 0);
    console.log('Radius of globe', radius);

    const colorMap = useLoader(
        THREE.TextureLoader,
        '/textures/Rock003_1K-JPG_Color.jpg',
    );
    const aoMap = useLoader(
        THREE.TextureLoader,
        '/textures/Rock003_1K-JPG_AmbientOcclusion.jpg',
    );
    const roughnessMap = useLoader(
        THREE.TextureLoader,
        '/textures/Rock003_1K-JPG_Roughness.jpg',
    );
    const normalMap = useLoader(
        THREE.TextureLoader,
        '/textures/Rock003_1K-JPG_NormalDX.jpg',
    );
    const displacementMap = useLoader(
        THREE.TextureLoader,
        '/textures/Rock003_1K-JPG_Displacement.jpg',
    );
    // Create a state to hold the scale factor so that we can update it with key presses.
    return (
        <group>
            {/* The sphere mesh representing the globe */}
            <mesh>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial
                    map={colorMap}
                    aoMap={aoMap}
                    roughnessMap={roughnessMap}
                    normalMap={normalMap}
                    displacementMap={displacementMap}
                    displacementScale={0.5}
                />
            </mesh>

            <GlobeContext.Provider value={{ radius, center }}>
                {children}
            </GlobeContext.Provider>
        </group>
    );
}
