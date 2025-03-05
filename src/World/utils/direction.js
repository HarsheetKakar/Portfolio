import * as THREE from 'three';

/**
 * Computes the "right" vector tangent to the sphere relative to a given forward direction.
 *
 * This function assumes the position is on the sphere. The sphere's normal at that position
 * is simply the normalized position vector. The "right" vector is calculated using the cross
 * product between the forward vector and the sphere's normal. This operation yields a vector
 * perpendicular to both, which will lie in the tangent plane of the sphere.
 *
 * @param {THREE.Spherical} position - The current position in Cartesian coordinates (assumed to be on the sphere).
 * @param {THREE.Vector3} forward - The forward direction vector (assumed to be tangent to the sphere).
 * @returns {THREE.Vector3} The normalized "right" vector tangent to the sphere.
 */
export function getRightVector(position, forward) {
    // Compute the sphere's normal (up vector) at the current position.
    const positionVector = new THREE.Vector3().setFromSpherical(
        position.clone(),
    );
    const up = positionVector.normalize();

    // Compute the right vector as the cross product of the forward vector and the up vector.
    // According to the right-hand rule, this gives a vector pointing to the right.
    const right = new THREE.Vector3();
    right.crossVectors(forward, up).normalize();

    return right;
}

/**
 * Computes the "left" vector tangent to the sphere relative to a given forward direction.
 *
 * This function leverages the getRightVector function by taking its negative.
 * It assumes that the forward vector is tangent to the sphere and that the position is on the sphere.
 *
 * @param {THREE.Spherical} position - The current position in Cartesian coordinates (assumed to be on the sphere).
 * @param {THREE.Vector3} forward - The forward direction vector (assumed to be tangent to the sphere).
 * @returns {THREE.Vector3} The normalized "left" vector tangent to the sphere.
 */
export function getLeftVector(position, forward) {
    // Get the right vector from the previously defined function.
    const right = getRightVector(position, forward);
    // The left vector is simply the negative of the right vector.
    return right.clone().negate();
}

/**
 * Computes the "down" vector tangent to the sphere relative to a given forward direction.
 *
 * In this context, "down" is defined as the opposite of the forward direction.
 * Since the forward vector is tangent to the sphere, its negative is also a valid tangent vector.
 *
 * @param {THREE.Vector3} forward - The forward direction vector (assumed to be tangent to the sphere).
 * @returns {THREE.Vector3} The normalized "down" vector tangent to the sphere.
 */
export function getDownVector(forward) {
    // Simply return the opposite of the forward vector.
    return forward.clone().negate().normalize();
}
