// moveOnSphere.js
import * as THREE from 'three';

/**
 * Moves a point on the surface of a sphere.
 *
 * @param {THREE.Vector3} currentPosition - Current position on the sphere (world coordinates).
 * @param {THREE.Vector3} direction - Desired movement direction (can be arbitrary).
 * @param {number} movementSpeed - How far to move along the tangent plane.
 * @param {number} radius - Radius of the sphere.
 * @param {THREE.Vector3} center - Center of the sphere.
 * @returns {THREE.Vector3} - New position on the sphere's surface.
 */
export function moveOnSphere(currentPosition, direction, movementSpeed, radius, center) {
    // Get the radial (normal) vector from the center to the current position.
    const radial = currentPosition.clone().sub(center).normalize();

    // Project the movement direction onto the tangent plane:
    // Remove the component along the radial direction.
    const tangentDir = direction.clone().sub(radial.clone().multiplyScalar(direction.dot(radial)));

    // If the direction was parallel to the radial vector, do nothing.
    if (tangentDir.lengthSq() === 0) {
        return currentPosition.clone();
    }

    // Normalize the tangent direction.
    tangentDir.normalize();

    // Compute a new vector: start from the current relative position and add the tangent movement.
    const newVec = currentPosition.clone().sub(center).add(tangentDir.multiplyScalar(movementSpeed));

    // Project the new vector back onto the sphere by normalizing and multiplying by the radius.
    newVec.normalize().multiplyScalar(radius);

    // Return the new position in world coordinates.
    return center.clone().add(newVec);
}
