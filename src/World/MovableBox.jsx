import React, {
    useEffect,
    useRef,
    useContext,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import GlobeContext from './context/GlobeContext';
import {
    moveForwardSpherical,
    moveBackwardsSpherical,
    moveLeftSpherical,
    moveRightSpherical,
    moveForwardLeftSpherical,
    moveForwardRightSpherical,
    moveBackwardLeftSpherical,
    moveBackwardRightSpherical,
} from './utils/moveOnSphere';

/**
 * MovableBoxOnGlobe
 *
 * Props:
 * - initialLat: initial latitude in radians (0 = equator; positive = north)
 * - initialLon: initial longitude in radians
 * - movementSpeed: angular change per frame (radians)
 * - boxSize: size of the box (used for offset)
 * - onClick: click handler
 */
const MovableBoxOnGlobe = forwardRef(
    (
        {
            initialLat = 0,
            initialLon = 0,
            movementSpeed = 0.02,
            boxSize = 1,
            onClick = () => {},
        },
        ref,
    ) => {
        const { radius, center } = useContext(GlobeContext);
        const boxRef = useRef();
        // sphericalRef will hold the current position as a THREE.Spherical instance.
        const sphericalRef = useRef(null);
        useImperativeHandle(ref, () => boxRef.current);
        const keysRef = useRef({});

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

        // Initialize the spherical coordinate on mount.
        useEffect(() => {
            if (!boxRef.current) return;
            // In our system: latitude = π/2 - φ, so φ = π/2 - initialLat.
            const phi = Math.PI / 2 - initialLat;
            const theta = initialLon;
            sphericalRef.current = new THREE.Spherical(radius, phi, theta);
            // Compute the base Cartesian position.
            const base = new THREE.Vector3().setFromSpherical(
                sphericalRef.current,
            );
            // Compute outward normal and apply offset.
            const normal = base.clone().normalize();
            const offset = normal.multiplyScalar(boxSize / 2);
            const initialPos = base.add(offset).add(center);
            boxRef.current.position.copy(initialPos);
            boxRef.current.lookAt(center);
        }, [initialLat, initialLon, radius, boxSize, center]);

        // Update the spherical coordinate and position on each frame.
        useFrame(() => {
            if (!boxRef.current || !sphericalRef.current) return;
            const keys = keysRef.current;

            // Update the spherical coordinate based on key input.
            if (keys['KeyW'] && keys['KeyA']) {
                moveForwardLeftSpherical(sphericalRef.current, movementSpeed);
            } else if (keys['KeyW'] && keys['KeyD']) {
                moveForwardRightSpherical(sphericalRef.current, movementSpeed);
            } else if (keys['KeyS'] && keys['KeyA']) {
                moveBackwardLeftSpherical(sphericalRef.current, movementSpeed);
            } else if (keys['KeyS'] && keys['KeyD']) {
                moveBackwardRightSpherical(sphericalRef.current, movementSpeed);
            } else if (keys['KeyW']) {
                moveForwardSpherical(sphericalRef.current, movementSpeed);
            } else if (keys['KeyS']) {
                moveBackwardsSpherical(sphericalRef.current, movementSpeed);
            } else if (keys['KeyA']) {
                moveLeftSpherical(sphericalRef.current, movementSpeed);
            } else if (keys['KeyD']) {
                moveRightSpherical(sphericalRef.current, movementSpeed);
            }

            // Convert the updated spherical coordinate to Cartesian.
            const base = new THREE.Vector3().setFromSpherical(
                sphericalRef.current,
            );
            const normal = base.clone().normalize();
            const offset = normal.multiplyScalar(boxSize / 2);
            const finalPos = base.add(offset).add(center);
            boxRef.current.position.copy(finalPos);
            boxRef.current.lookAt(center);
        });

        // Materials for the six faces of the box.
        const materials = [
            new THREE.MeshStandardMaterial({ color: 'orange' }),
            new THREE.MeshStandardMaterial({ color: 'orange' }),
            new THREE.MeshStandardMaterial({ color: 'orange' }),
            new THREE.MeshStandardMaterial({ color: 'orange' }),
            new THREE.MeshStandardMaterial({ color: 'blue' }),
            new THREE.MeshStandardMaterial({ color: 'orange' }),
        ];

        return (
            <mesh ref={boxRef} material={materials} onClick={onClick}>
                <boxGeometry args={[boxSize, boxSize, boxSize]} />
            </mesh>
        );
    },
);

export default MovableBoxOnGlobe;
