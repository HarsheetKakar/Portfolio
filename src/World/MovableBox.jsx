// MovableBoxOnGlobe.jsx
import React, {
    forwardRef,
    useContext,
    useImperativeHandle,
    useState,
} from 'react';
import * as THREE from 'three';
import GlobeContext from './context/GlobeContext';

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
    const context = useContext(GlobeContext);
    const [spherical, setSpherical] = useState(
        new THREE.Spherical(context.radius, 0, 0),
    );

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
