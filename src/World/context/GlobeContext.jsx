import React from 'react';
import * as THREE from 'three';

// Create a context to store globe parameters.
const GlobeContext = React.createContext({
    radius: 5,
    center: new THREE.Vector3(0, 0, 0),
});

export default GlobeContext;
