import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from './World/Globe';
import MovableBoxOnGlobe from './World/MovableBox.jsx';
import Stats from './Stats.jsx';

// Component that moves a box along the surface of a sphere using WASD keys.

function App() {
    const boxRef = useRef({});
    return (
        <Canvas
            camera={{
                position: [10, 10, 10],
                fov: 75,
                near: 0.1,
                far: 1000,
            }}
            style={{ width: '100vw', height: '100vh' }}
        >
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Globe radius={10}>
                {/* Movable box on the sphere (using WASD) */}
                <MovableBoxOnGlobe ref={boxRef} movementSpeed={1} boxSize={1} />
            </Globe>
            <OrbitControls />
            <Stats targetRef={boxRef} />
        </Canvas>
    );
}

export default App;
