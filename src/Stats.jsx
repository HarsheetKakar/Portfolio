// StatsOverlay.jsx
import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

function StatsOverlay({ targetRef }) {
    const [pos, setPos] = useState([0, 0, 0]);

    // Update position every frame
    useFrame(() => {
        if (targetRef.current) {
            const { x, y, z } = targetRef.current.position;
            setPos([x, y, z]);
        }
    });

    return (
        <Html
            // The 'portal' is rendered as a DOM overlay.
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
            }}
            // Use the prepend prop if you want the overlay to render before other html
            prepend
        >
            <div
                style={{
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    fontFamily: 'monospace',
                }}
            >
                <div>
                    <strong>Box Position</strong>
                </div>
                <div>X: {pos[0].toFixed(2)}</div>
                <div>Y: {pos[1].toFixed(2)}</div>
                <div>Z: {pos[2].toFixed(2)}</div>
            </div>
        </Html>
    );
}

export default StatsOverlay;
