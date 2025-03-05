// Moveable.js
import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import GlobeContext from '../context/GlobeContext.jsx'; // Provides the sphere's radius (and center, if needed)
import moveOnSphere from '../utils/moveOnSphere.js';
import {
    getDownVector,
    getRightVector,
    getLeftVector,
} from '../utils/direction.js';

const Moveable = ({ children }) => {
    const boxRef = useRef(null);
    let { radius, center } = useContext(GlobeContext); // Globe provides the fixed sphere radius

    const deltaAngle = 0.05; // TODO: take this form props

    const handleKeyDown = (event) => {
        if (!boxRef.current) return;

        // Get the current spherical position from the Box
        const currentSpherical = boxRef.current.getSpherical();
        const direction = boxRef.current.getDirection();
        let newPhi = currentSpherical.phi;
        let newTheta = currentSpherical.theta;

        let newSpherical;
        switch (event.key) {
            case 'ArrowUp':
                newSpherical = moveOnSphere(
                    currentSpherical,
                    direction,
                    deltaAngle,
                );
                break;
            case 'ArrowDown':
                // Increase phi (but keep it ≤ PI)
                const downVector = getDownVector(direction);
                newSpherical = moveOnSphere(
                    currentSpherical,
                    downVector,
                    deltaAngle,
                );
                break;
            case 'ArrowLeft':
                // Decrease theta (wrap-around can be handled if needed)
                const leftVector = getLeftVector(currentSpherical, direction);
                newSpherical = moveOnSphere(
                    currentSpherical,
                    leftVector,
                    deltaAngle,
                );
                break;
            case 'ArrowRight':
                // Increase theta
                const rightVector = getRightVector(currentSpherical, direction);
                newSpherical = moveOnSphere(
                    currentSpherical,
                    rightVector,
                    deltaAngle,
                );
                break;
            default:
                break;
        }

        if (newSpherical) {
            newSpherical.radius = radius + 0.2; // COMMENT: making sure that the user is not allowed to go inside the globe
            boxRef.current.updatePosition(newSpherical.makeSafe());
        }

        console.log('newPhi', newPhi);
        console.log('newTheta', newTheta);

        // Update the Box's position
        // Expose the child component's API to the parent using the forwarded ref.
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Attach the ref to the child Box component
    return React.cloneElement(children, { ref: boxRef });
};

export default Moveable;
