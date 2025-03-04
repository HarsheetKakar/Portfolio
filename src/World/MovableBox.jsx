// MovableBoxOnGlobe.jsx
import React, {
    useEffect,
    useRef,
    useContext,
    forwardRef,
    useImperativeHandle,
    useState,
} from 'react';
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

const MovableBoxOnGlobe = forwardRef(function (
    {
        /**@ts-ignore*/
        movementSpeed = 0,
        /**@ts-ignore*/
        boxSize = 1,
        /**@ts-ignore*/
        onClick = () => {}, // TODO: On click add modal
        /**@ts-ignore*/
        initialSpherical,
        /**@ts-ignore*/
        lookingAt,
    },
    ref,
) {
    const [spherical, setSpherical] = useState(new THREE.Spherical(5, 0, 0));

    useImperativeHandle(
        ref,
        () => ({
            getSpherical: () => spherical,
            updatePosition: (newSpherical) => {
                setSpherical(newSpherical);
            },
            getLookingAt: () => lookingAt,
        }),
        [spherical, lookingAt],
    );

    const position = new THREE.Vector3().setFromSpherical(spherical);

    const materials = [
        new THREE.MeshBasicMaterial({ color: 'red' }), // right
        new THREE.MeshBasicMaterial({ color: 'green' }), // left
        new THREE.MeshBasicMaterial({ color: 'blue' }), // top
        new THREE.MeshBasicMaterial({ color: 'yellow' }), // bottom
        new THREE.MeshBasicMaterial({ color: 'orange' }), // front
        new THREE.MeshBasicMaterial({ color: 'purple' }), // back
    ];
    return (
        <mesh
            material={materials}
            ref={ref}
            position={[position.x, position.y, position.z]}
        >
            <boxGeometry args={[boxSize, boxSize, boxSize]} />
        </mesh>
    );
});

export default MovableBoxOnGlobe;
