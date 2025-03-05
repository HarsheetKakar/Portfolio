// Moveable.js
import React, {
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import * as THREE from 'three';
import GlobeContext from '../context/GlobeContext.jsx'; // Provides the sphere's radius (and center, if needed)
import moveOnSphere from '../utils/moveOnSphere.js';

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
                //const spherical = adjustSphericalByDirection(
                //    currentSpherical,
                //    direction,
                //    deltaAngle,
                //);
                //radius = spherical.radius;
                //newPhi = spherical.phi;
                //newTheta = spherical.theta;
                const newSpherical = moveOnSphere(
                    currentSpherical,
                    direction,
                    deltaAngle,
                );
                newPhi = newSpherical.phi;
                newTheta = newSpherical.theta;
                console.log('current spherical', currentSpherical);
                console.log('newSpherical spherical', newSpherical);
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
