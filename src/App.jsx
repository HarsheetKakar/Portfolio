import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import Globe from './World/Globe';

// Component that moves a box along the surface of a sphere using WASD keys.
function MovableBoxOnGlobe({
    radius = 5,
    initialLat = 0,
    initialLon = 0,
    movementSpeed = 0.01,
    boxSize = 1,
}) {
    const meshRef = useRef({});
    // Store spherical coordinates for the box
    const latRef = useRef(initialLat); // latitude in radians, valid range: [-π/2, π/2]
    const lonRef = useRef(initialLon); // longitude in radians
    const keysRef = useRef({});

    // Set up key listeners to track WASD presses.
    useEffect(() => {
        const handleKeyDown = (e) => {
            keysRef.current[e.code] = true;
        };
        const handleKeyUp = (e) => {
            keysRef.current[e.code] = false;
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Update the box's position every frame based on WASD input.
    useFrame(() => {
        const keys = keysRef.current;
        // Update latitude with W (increase, moves upward on sphere) and S (decrease)
        if (keys['KeyW']) {
            latRef.current += movementSpeed;
        }
        if (keys['KeyS']) {
            latRef.current -= movementSpeed;
        }
        // Update longitude with A (decrease, move left) and D (increase, move right)
        if (keys['KeyA']) {
            lonRef.current -= movementSpeed;
        }
        if (keys['KeyD']) {
            lonRef.current += movementSpeed;
        }

        // Clamp latitude to [-π/2, π/2]
        let lat = Math.max(-Math.PI / 2, Math.min(latRef.current, Math.PI / 2));
        // Normalize longitude to [0, 2π]
        let lon = lonRef.current % (2 * Math.PI);
        if (lon < 0) lon += 2 * Math.PI;

        // Convert spherical coordinates to Cartesian.
        // Define phi = π/2 - latitude so that lat=0 is at the equator.
        const phi = Math.PI / 2 - lat;
        const theta = lon;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        // This is the point on the sphere's surface.
        // Offset the box along the outward normal (which is just (x,y,z) normalized)
        // so that the bottom of the box sits on the sphere.
        const normal = new THREE.Vector3(x, y, z).normalize();
        const offset = normal.clone().multiplyScalar(boxSize / 2);
        const position = new THREE.Vector3(x, y, z).add(offset);

        if (meshRef.current) {
            meshRef.current.position.copy(position);
            // Orient the box so its "bottom" faces the sphere.
            // One simple way is to make the box look at the center of the sphere.
            meshRef.current.lookAt(0, 0, 0);
        }
    });
    // Create an array of 6 materials, one for each face.
    // We'll set the front face (group index 4) to blue, and others to orange.
    const materials = [
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Right
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Left
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Top
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Bottom
        new THREE.MeshStandardMaterial({ color: 'blue' }), // Front (different color)
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Back
    ];

    return (
        <mesh ref={meshRef} material={materials}>
            <boxGeometry args={[boxSize, boxSize, boxSize]} />
        </mesh>
    );
}

function App() {
    return (
        <Canvas
            camera={{ position: [10, 10, 10], fov: 75, near: 0.1, far: 1000 }}
            style={{ width: '100vw', height: '100vh' }}
        >
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Globe />

            {/* Movable box on the sphere (using WASD) */}
            <MovableBoxOnGlobe
                radius={5}
                initialLat={0}
                initialLon={0}
                boxSize={1}
                movementSpeed={0.02}
            />

            {/* PointerLockControls for camera look */}
            <PointerLockControls />
        </Canvas>
    );
}

export default App;
