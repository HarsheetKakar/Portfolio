// MovableBoxOnGlobe.jsx
import React, { useEffect, useRef, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GlobeContext from './context/GlobeContext'; // Adjust the import path as needed
import {
    moveForward,
    moveBackwardLeft,
    moveBackwardRight,
    moveBackwards,
    moveRight,
    moveLeft,
    moveForwardLeft,
    moveForwardRight,
} from './utils/moveOnSphere';

function MovableBoxOnGlobe({
    initialLat = 0,
    initialLon = 0,
    movementSpeed = 0.02,
    boxSize = 1,
    onClick = () => {},
}) {
    // Get globe parameters from context.
    const { radius, center } = useContext(GlobeContext);
    const boxRef = useRef();

    // Store spherical coordinates for the box.
    const latRef = useRef(initialLat); // latitude in radians (valid range: [-π/2, π/2])
    const lonRef = useRef(initialLon); // longitude in radians
    const keysRef = useRef({});

    // Set up key listeners for WASD input.
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

    let once = false;

    // Set initial position on mount.
    useEffect(() => {
        if (boxRef.current && !once) {
            once = true;
            // Use initial lat/lon to compute the position.
            let lat = Math.max(-Math.PI / 2, Math.min(initialLat, Math.PI / 2));
            let lon = initialLon % (2 * Math.PI);
            if (lon < 0) lon += 2 * Math.PI;
            const phi = Math.PI / 2 - lat;
            const theta = lon;
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            const normal = new THREE.Vector3(x, y, z).normalize();
            const offset = normal.clone().multiplyScalar(boxSize / 2);
            const initialPosition = new THREE.Vector3(x, y, z)
                .add(offset)
                .add(center);
            boxRef.current.position.copy(initialPosition);
            boxRef.current.lookAt(center);
        }
    }, [initialLat, initialLon, radius, boxSize, center]);

    // Update box position every frame.
    useFrame(() => {
        if (!boxRef.current) return;
        const keys = keysRef.current;
        // Get the current position of the box.
        const currentPos = boxRef.current.position.clone();
        // Project the current position onto the sphere (i.e. remove the offset)
        // This gives us the "base" position on the sphere's surface.
        const currentBase = currentPos
            .sub(center)
            .normalize()
            .multiplyScalar(radius)
            .add(center);

        let newBasePos = currentBase.clone();

        // Check for diagonal movement first.
        if (keys['KeyW'] && keys['KeyA']) {
            newBasePos = moveForwardLeft(
                currentPos,
                movementSpeed,
                radius,
                center,
            );
        } else if (keys['KeyW'] && keys['KeyD']) {
            newBasePos = moveForwardRight(
                currentPos,
                movementSpeed,
                radius,
                center,
            );
        } else if (keys['KeyS'] && keys['KeyA']) {
            newBasePos = moveBackwardLeft(
                currentPos,
                movementSpeed,
                radius,
                center,
            );
        } else if (keys['KeyS'] && keys['KeyD']) {
            newBasePos = moveBackwardRight(
                currentPos,
                movementSpeed,
                radius,
                center,
            );
        } else if (keys['KeyW']) {
            newBasePos = moveForward(currentPos, movementSpeed, radius, center);
        } else if (keys['KeyS']) {
            newBasePos = moveBackwards(
                currentPos,
                movementSpeed,
                radius,
                center,
            );
        } else if (keys['KeyA']) {
            newBasePos = moveLeft(currentPos, movementSpeed, radius, center);
        } else if (keys['KeyD']) {
            newBasePos = moveRight(currentPos, movementSpeed, radius, center);
        }

        // Compute the outward normal from the sphere center to the new base position.
        const normal = newBasePos.clone().sub(center).normalize();
        // Add the offset (half the box size) exactly once.
        const finalPos = newBasePos
            .clone()
            .add(normal.clone().multiplyScalar(boxSize / 2));

        // Update the box position and orientation.
        boxRef.current.position.copy(finalPos);
        boxRef.current.lookAt(center);
    });

    // Create an array of 6 materials for the 6 faces of the box.
    // BoxGeometry groups faces in the order: [right, left, top, bottom, front, back].
    const materials = [
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Right
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Left
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Top
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Bottom
        new THREE.MeshStandardMaterial({ color: 'blue' }), // Front (different color)
        new THREE.MeshStandardMaterial({ color: 'orange' }), // Back
    ];

    return (
        <mesh ref={boxRef} material={materials} onClick={onClick}>
            <boxGeometry args={[boxSize, boxSize, boxSize]} />
        </mesh>
    );
}

export default MovableBoxOnGlobe;
