/**
 * This is user component which gives first person controls to the user
 * */

import {
    forwardRef,
    useContext,
    useState,
    useImperativeHandle,
    useEffect,
} from 'react';
import GlobeContext from './context/GlobeContext';
import React from 'react';

import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

const Person = forwardRef(function ({}, ref) {
    const { camera } = useThree();
    const context = useContext(GlobeContext);
    const [spherical, setSpherical] = useState(
        new THREE.Spherical(context.radius, Math.PI / 2, 0).makeSafe(), // COMMENT: puts the person on equater of the sphere
    );
    // New state to store rotation angles (yaw and pitch)
    const [rotation, setRotation] = useState({ yaw: 0, pitch: 0 });
    let direction = new THREE.Vector3(0, 0, 0).normalize();

    useEffect(() => {
        const sensitivity = 0.02; // Adjust this value to change mouse sensitivity

        const handleMouseMove = (event) => {
            // event.movementX and event.movementY give the change in mouse position
            setRotation((prev) => {
                let newYaw = prev.yaw - event.movementX * sensitivity;
                let newPitch = prev.pitch - event.movementY * sensitivity;
                // Clamp the pitch to avoid flipping the view.
                newPitch = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, newPitch),
                );
                return { yaw: newYaw, pitch: newPitch };
            });
        };

        // Optional: If you want to use pointer lock for a first-person feel,
        // you might request pointer lock on the canvas element.
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Each frame update the camera's look direction based on the rotation state.
    useFrame(() => {
        // Calculate the forward direction vector from yaw and pitch.
        direction = new THREE.Vector3(
            Math.cos(rotation.pitch) * Math.sin(rotation.yaw),
            Math.sin(rotation.pitch),
            Math.cos(rotation.pitch) * Math.cos(rotation.yaw),
        ).normalize();
        //console.log('direction', direction);
        // Update the camera's orientation to look in the new direction.
        camera.lookAt(camera.position.clone().add(direction));
        const position = new THREE.Vector3()
            .setFromSpherical(spherical.makeSafe())
            .add(direction);
        camera.position.copy(position);
    });

    useImperativeHandle(
        ref,
        () => ({
            getSpherical: () => spherical.makeSafe(),
            updatePosition: (newSpherical) => {
                setSpherical(newSpherical.makeSafe());
            },
            getDirection: () => direction,
        }),
        [spherical, direction],
    );
    return null;
});

export default Person;
