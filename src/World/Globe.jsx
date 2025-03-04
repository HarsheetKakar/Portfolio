import React from 'react';
import GlobeContext from './context/GlobeContext';
import * as Three from 'three';

export default function Globe({ radius, children }) {
    const center = new Three.Vector3(0, 0, 0);
    return (
        <group>
            <mesh>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial color="hotpink" wireframe />
            </mesh>
            <GlobeContext.Provider value={{ radius, center }}>
                {children}
            </GlobeContext.Provider>
        </group>
    );
}
