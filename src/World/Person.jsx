/**
 * This is a user component which gives first person controls to the user.
 */
import React, {
    forwardRef,
    useContext,
    useState,
    useImperativeHandle,
    useEffect,
    useRef,
} from 'react';
import GlobeContext from './context/GlobeContext';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

const Person = forwardRef(function ({}, ref) {
    const { camera, gl } = useThree();
    const context = useContext(GlobeContext);
    const [spherical, setSpherical] = useState(
        new THREE.Spherical(context.radius + 0.2, Math.PI / 2, 0).makeSafe(), // puts the person on the equator of the sphere
    );
    // Create a ref for the PointerLockControls instance.
    const controlsRef = useRef({});

    useEffect(() => {
        // Instantiate PointerLockControls with the camera and the canvas (gl.domElement)
        controlsRef.current = new PointerLockControls(camera, gl.domElement);

        // On click, request pointer lock so that the user has a first-person feel.
        const handleClick = () => {
            controlsRef.current.lock();
        };
        gl.domElement.addEventListener('click', handleClick);

        // Optionally, log pointer lock events.
        const onLock = () => {
            console.log('Pointer locked');
        };
        const onUnlock = () => {
            console.log('Pointer unlocked');
        };
        controlsRef.current.addEventListener('lock', onLock);
        controlsRef.current.addEventListener('unlock', onUnlock);

        return () => {
            gl.domElement.removeEventListener('click', handleClick);
            controlsRef.current.removeEventListener('lock', onLock);
            controlsRef.current.removeEventListener('unlock', onUnlock);
            controlsRef.current.unlock();
        };
    }, [camera, gl.domElement]);

    // Each frame update the camera's position based on the spherical state.
    // The PointerLockControls automatically handle the camera's rotation.
    useFrame(() => {
        // Update camera position from spherical coordinates
        const pos = new THREE.Vector3().setFromSpherical(spherical.makeSafe());
        camera.position.copy(pos);

        // Compute the new up vector as the normal from the sphere's center
        const newUp = pos.clone().sub(context.center).normalize();
        camera.up.copy(newUp);

        // Get the current forward direction from the controls.
        const forward = new THREE.Vector3();
        controlsRef.current.getDirection(forward);
        // Remove any vertical component so that the forward vector becomes tangent.
        const tangentForward = forward
            .sub(newUp.clone().multiplyScalar(forward.dot(newUp)))
            .normalize();

        // Reorient the camera to look along the corrected tangent direction.
        camera.lookAt(camera.position.clone().add(tangentForward));
    });

    useImperativeHandle(
        ref,
        () => ({
            getSpherical: () => spherical.makeSafe(),
            updatePosition: (newSpherical) => {
                setSpherical(newSpherical.makeSafe());
            },
            getDirection: () => {
                if (controlsRef.current) {
                    const direction = new THREE.Vector3();
                    controlsRef.current.getDirection(direction);
                    console.log('direction:', direction);
                    return direction;
                }
                return new THREE.Vector3();
            },
        }),
        [spherical],
    );

    return null;
});

export default Person;
