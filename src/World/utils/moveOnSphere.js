import * as THREE from 'three';
/**
 * Moves a position in spherical coordinates along a given direction vector.
 *
 * @param {THREE.Spherical} posSpherical - The current position in spherical coordinates.
 * @param {THREE.Vector3} direction - The direction vector indicating where to move.
 * @param {number} delta - The distance to move in the direction (speed).
 * @returns {THREE.Spherical} The updated position in spherical coordinates.
 */
export default function moveOnSphere(posSpherical, direction, delta) {
    // Convert spherical to Cartesian coordinates.
    const posCartesian = new THREE.Vector3();
    posCartesian.setFromSpherical(posSpherical);

    // Compute the displacement: normalize the direction and scale it by delta.
    const displacement = direction.clone().normalize().multiplyScalar(delta);

    // Update the Cartesian position by adding the displacement.
    posCartesian.add(displacement);

    // Convert the updated Cartesian position back to spherical coordinates.
    posSpherical.setFromVector3(posCartesian);

    return posSpherical;
}
