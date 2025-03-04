import * as THREE from 'three';

/**
 * Returns the forward and right tangent vectors on the sphere's surface for a given radial vector.
 * The radial vector should be normalized.
 *
 * @param {THREE.Vector3} radial - The normalized radial vector (from center to surface).
 * @returns {{forward: THREE.Vector3, right: THREE.Vector3}} - The tangent vectors.
 */
export function getTangentVectors(radial) {
    // Start with an arbitrary vector.
    let arbitrary = new THREE.Vector3(0, 0, 1);
    // If the arbitrary vector is too aligned with the radial, switch it.
    if (Math.abs(radial.dot(arbitrary)) > 0.99) {
        arbitrary.set(1, 0, 0);
    }
    // The right vector is perpendicular to both the arbitrary vector and the radial vector.
    console.log('radial vector', radial);
    console.log('arbitrary vector', arbitrary);
    const right = new THREE.Vector3()
        .crossVectors(arbitrary, radial)
        .normalize();
    // The forward vector is the cross product of the radial and the right vector.
    const forward = new THREE.Vector3().crossVectors(radial, right).normalize();

    console.log('Forward', forward);
    console.log('right', right);
    return { forward, right };
}
