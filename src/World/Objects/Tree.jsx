import React, {
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import GlobeContext from '../context/GlobeContext';

const Tree = forwardRef(({}, ref) => {
    const meshRef = useRef({});
    const model = useGLTF('/models/pine_tree/scene.gltf');
    const context = useContext(GlobeContext);
    const [spherical, setSpherical] = useState(
        new THREE.Spherical(
            context.radius,
            Math.PI / 4,
            Math.PI / 4,
        ).makeSafe(), // puts tree on the globe
    );

    const [scale, setScale] = useState([0.05, 0.05, 0.05]);

    const [position, setPosition] = useState(
        new THREE.Vector3().setFromSpherical(spherical),
    );
    const [direction, setDirection] = useState(
        position.clone().sub(context.center).normalize(),
    );

    useImperativeHandle(
        ref,
        () => ({
            getSpherical: () => spherical.makeSafe(),
            setSpherical: (newSpherical) => {
                console.log(newSpherical);
                setPosition(new THREE.Vector3().setFromSpherical(newSpherical));
                setSpherical(newSpherical.makeSafe());
            },
            getScale: () => scale,
            setScale: (newScale) => {
                setScale(newScale);
            },
            getDelta: () => {
                return 0.01; // COMMENT: int value which defines the changes debug component can do
            },
            getDirection: () => direction,
            setDirection: (newDirection) => setDirection(newDirection),
        }),
        [spherical, scale],
    );
    return (
        <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
            <primitive object={model.scene} scale={scale}></primitive>
        </mesh>
    );
});

export default Tree;
