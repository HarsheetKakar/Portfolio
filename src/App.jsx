import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Globe from './World/Globe';
import Moveable from './World/hoc/Moveable.hoc.jsx';
import Person from './World/Person';
import { Environment } from '@react-three/drei';

// Component that moves a box along the surface of a sphere using WASD keys.

function App() {
    const moveAbleRef = useRef({}); // TODO: use it to see the stats in realtime
    return (
        <Canvas
            camera={{ position: [10, 10, 10], fov: 75, near: 0.1, far: 1000 }}
            style={{ width: '100vw', height: '100vh' }}
        >
            {/* Lighting */}
            <ambientLight intensity={0.8} />
            <directionalLight intensity={1} position={[10, 10, 5]} />
            <Environment preset="sunset" />
            <Globe radius={10}>
                <Moveable>
                    {/*TODO: Make changes on poles so that it can cross the pole*/}
                    <Person />
                </Moveable>
            </Globe>
        </Canvas>
    );
}

export default App;
