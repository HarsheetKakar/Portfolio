import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

/**
 * MovableStats is an HTML overlay that displays the spherical position
 * (radius, phi, theta) of a movable component.
 *
 * @param {Object} props
 * @param {React.RefObject} props.movableRef - The ref of the movable component.
 */
const MovableStats = ({ movableRef }) => {
    const [spherical, setSpherical] = useState(null);

    // Use useFrame to update stats on each frame.
    useFrame(() => {
        if (movableRef.current && movableRef.current.getSpherical) {
            const sph = movableRef.current.getSpherical();
            setSpherical(sph);
        }
    });

    return (
        <Html
            // Disable transform so that the overlay is fixed relative to the viewport.
            transform={false}
            // Use portal to body (or set your own container) to avoid 3D scene interference.
            style={{
                position: 'fixed',
                top: '10px',
                right: '10px',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontFamily: 'sans-serif',
                fontSize: '14px',
                pointerEvents: 'none',
            }}
        >
            <div>
                <strong>Movable Stats</strong>
                {spherical ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li>Radius: {spherical.radius.toFixed(2)}</li>
                        <li>Phi: {spherical.phi.toFixed(2)}</li>
                        <li>Theta: {spherical.theta.toFixed(2)}</li>
                    </ul>
                ) : (
                    <div>No data</div>
                )}
            </div>
        </Html>
    );
};

export default MovableStats;
