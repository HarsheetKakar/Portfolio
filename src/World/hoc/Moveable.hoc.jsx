// Moveable.js
import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import GlobeContext from '../context/GlobeContext.jsx'; // Provides the sphere's radius (and center, if needed)

/**
 * Adjusts a given spherical coordinate by adding angular offsets derived
 * from a direction vector.
 *
 * @param {THREE.Spherical} currentSpherical - The current spherical coordinate (radius, phi, theta).
 * @param {THREE.Vector3} direction - The forward direction vector (should be normalized).
 * @param {number} speed - A multiplier to scale the angular change.
 * @returns {THREE.Spherical} - A new spherical coordinate updated by the direction.
 */
function adjustSphericalByDirection(currentSpherical, direction, speed = 0.05) {
    // Convert the direction vector to spherical angles.
    const offsetSpherical = new THREE.Spherical().setFromVector3(direction);
    // The spherical angles from a direction vector are used as increments.
    // Note: Depending on your coordinate system and what you consider "forward,"
    // you may want to invert one of these values.
    const newPhi = currentSpherical.phi + offsetSpherical.phi * speed;
    const newTheta = currentSpherical.theta + offsetSpherical.theta * speed;

    // Optionally, clamp newPhi to a valid range [0, Math.PI] to avoid flipping.
    const clampedPhi = Math.max(0, Math.min(Math.PI, newPhi));

    return new THREE.Spherical(currentSpherical.radius, clampedPhi, newTheta);
}

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

        switch (event.key) {
            case 'ArrowUp':
                // Decrease phi (but keep it ≥ 0)
                const spherical = adjustSphericalByDirection(
                    currentSpherical,
                    direction,
                    deltaAngle,
                );
                radius = spherical.radius;
                newPhi = spherical.phi;
                newTheta = spherical.theta;
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
