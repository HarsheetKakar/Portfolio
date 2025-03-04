// Moveable.js
import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import GlobeContext from './context/GlobeContext.jsx'; // Provides the sphere's radius (and center, if needed)

const Moveable = ({ children }) => {
    const boxRef = useRef(null);
    const { radius, center } = useContext(GlobeContext); // Globe provides the fixed sphere radius

    const deltaAngle = 0.05; // TODO: take this form props

    const handleKeyDown = (event) => {
        if (!boxRef.current) return;

        // Get the current spherical position from the Box
        const currentSpherical = boxRef.current.getSpherical();
        let newPhi = currentSpherical.phi;
        let newTheta = currentSpherical.theta;

        switch (event.key) {
            case 'ArrowUp':
                // Decrease phi (but keep it ≥ 0)
                newPhi = Math.max(currentSpherical.phi - deltaAngle, 0);
                break;
            case 'ArrowDown':
                // Increase phi (but keep it ≤ PI)
                newPhi = Math.min(currentSpherical.phi + deltaAngle, Math.PI);
                break;
            case 'ArrowLeft':
                // Decrease theta (wrap-around can be handled if needed)
                newTheta = currentSpherical.theta - deltaAngle;
                break;
            case 'ArrowRight':
                // Increase theta
                newTheta = currentSpherical.theta + deltaAngle;
                break;
            default:
                break;
        }

        console.log('newPhi', newPhi);
        console.log('newTheta', newTheta);

        // Construct a new spherical coordinate with the globe's radius
        const newSpherical = new THREE.Spherical(radius, newPhi, newTheta);
        // Update the Box's position
        boxRef.current.updatePosition(newSpherical);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Attach the ref to the child Box component
    return React.cloneElement(children, { ref: boxRef });
};

export default Moveable;
