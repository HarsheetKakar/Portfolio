// moveOnSphere.js
import * as THREE from 'three';
import { getTangentVectors } from './getTangentVectors.js';

/**
 * Moves a point on the surface of a sphere along a given tangent direction.
 * This function projects the moved position back onto the sphere and applies an offset.
 *
 * @param {THREE.Vector3} currentPosition - The current world position of the object.
 * @param {THREE.Vector3} direction - The desired tangent movement direction (should be nonzero).
 * @param {number} movementSpeed - The distance to move along the tangent direction.
 * @param {number} radius - The sphere’s radius.
 * @param {THREE.Vector3} center - The sphere’s center.
 * @param {number} [offset=0] - An optional offset to add along the outward normal (e.g. half the object's height).
 * @returns {THREE.Vector3} - The new world position on the sphere's surface with offset applied.
 */
export function moveOnSphere(
    currentPosition,
    direction,
    movementSpeed,
    radius,
    center,
    offset = 0,
) {
    // 1. Compute the relative (base) position (without offset) by subtracting the center.
    const relativePos = currentPosition.clone().sub(center);

    // 2. Calculate the radial vector (the surface normal) at the current position.
    const radial = relativePos.clone().normalize();

    // 3. Project the desired movement direction onto the tangent plane by removing any component along radial.
    const tangentDir = direction
        .clone()
        .sub(radial.clone().multiplyScalar(direction.dot(radial)));
    if (tangentDir.lengthSq() === 0) {
        // If the direction is degenerate (parallel to radial), return the original position.
        return currentPosition.clone();
    }
    tangentDir.normalize();

    // 4. Move along the tangent: add tangentDir scaled by movementSpeed to the relative position.
    let newRelative = relativePos.add(tangentDir.multiplyScalar(movementSpeed));

    // 5. Project the new relative position back onto the sphere.
    newRelative.normalize().multiplyScalar(radius);

    // 6. "Re-sync" the spherical coordinates:
    //    Compute spherical angles from the new relative position and re-calc the position.
    if (newRelative.length() > 0.0001) {
        // Compute phi (angle from positive z-axis)
        const newPhi = Math.acos(newRelative.z / radius);
        // Latitude: lat = π/2 - phi (so that lat=0 is at the equator)
        const newLat = Math.PI / 2 - newPhi;
        // Compute longitude: range will be [-π, π] (can be normalized later if needed)
        const newLon = Math.atan2(newRelative.y, newRelative.x);
        // Recompute new relative position from spherical coordinates.
        const phi2 = Math.PI / 2 - newLat; // This is equivalent to newPhi.
        const theta2 = newLon;
        newRelative.set(
            radius * Math.sin(phi2) * Math.cos(theta2),
            radius * Math.sin(phi2) * Math.sin(theta2),
            radius * Math.cos(phi2),
        );
    }

    // 7. Add the center to get the world-space base position.
    const newBasePos = center.clone().add(newRelative);

    // 8. Compute the outward normal at the new base position.
    const newNormal = newBasePos.clone().sub(center).normalize();

    // 9. Apply the offset along the normal.
    const finalPos = newBasePos.clone().add(newNormal.multiplyScalar(offset));

    return finalPos;
}

/**
 * Moves an object forward along the sphere's tangent plane.
 *
 * @param {THREE.Vector3} currentPosition - The current world position of the object.
 * @param {number} movementSpeed - The distance to move.
 * @param {number} radius - The sphere's radius.
 * @param {THREE.Vector3} center - The sphere's center.
 * @returns {THREE.Vector3} - The new position on the sphere's surface.
 */
export function moveForward(currentPosition, movementSpeed, radius, center) {
    const radial = currentPosition.clone().sub(center).normalize();
    const { forward } = getTangentVectors(radial);
    return moveOnSphere(
        currentPosition,
        forward,
        movementSpeed,
        radius,
        center,
    );
}

/**
 * Moves an object backward along the sphere's tangent plane.
 *
 * @param {THREE.Vector3} currentPosition - The current world position of the object.
 * @param {number} movementSpeed - The distance to move.
 * @param {number} radius - The sphere's radius.
 * @param {THREE.Vector3} center - The sphere's center.
 * @returns {THREE.Vector3} - The new position on the sphere's surface.
 */
export function moveBackwards(currentPosition, movementSpeed, radius, center) {
    const radial = currentPosition.clone().sub(center).normalize();
    const { forward } = getTangentVectors(radial);
    return moveOnSphere(
        currentPosition,
        forward.clone().negate(),
        movementSpeed,
        radius,
        center,
    );
}

/**
 * Moves an object to the right along the sphere's tangent plane.
 *
 * @param {THREE.Vector3} currentPosition - The current world position of the object.
 * @param {number} movementSpeed - The distance to move.
 * @param {number} radius - The sphere's radius.
 * @param {THREE.Vector3} center - The sphere's center.
 * @returns {THREE.Vector3} - The new position on the sphere's surface.
 */
export function moveRight(currentPosition, movementSpeed, radius, center) {
    const radial = currentPosition.clone().sub(center).normalize();
    const { right } = getTangentVectors(radial);
    return moveOnSphere(currentPosition, right, movementSpeed, radius, center);
}

/**
 * Moves an object to the left along the sphere's tangent plane.
 *
 * @param {THREE.Vector3} currentPosition - The current world position of the object.
 * @param {number} movementSpeed - The distance to move.
 * @param {number} radius - The sphere's radius.
 * @param {THREE.Vector3} center - The sphere's center.
 * @returns {THREE.Vector3} - The new position on the sphere's surface.
 */
export function moveLeft(currentPosition, movementSpeed, radius, center) {
    const radial = currentPosition.clone().sub(center).normalize();
    const { right } = getTangentVectors(radial);
    return moveOnSphere(
        currentPosition,
        right.clone().negate(),
        movementSpeed,
        radius,
        center,
    );
}

/**
 * Moves an object diagonally forward-left along the sphere's tangent plane.
 *
 * @param {THREE.Vector3} currentPosition - The current world position of the object.
 * @param {number} movementSpeed - The distance to move.
 * @param {number} radius - The sphere's radius.
 * @param {THREE.Vector3} center - The sphere's center.
 * @returns {THREE.Vector3} - The new position on the sphere's surface.
 */
export function moveForwardLeft(
    currentPosition,
    movementSpeed,
    radius,
    center,
) {
    const radial = currentPosition.clone().sub(center).normalize();
    const { forward, right } = getTangentVectors(radial);
    const diag = forward.clone().add(right.clone().negate()).normalize();
    return moveOnSphere(currentPosition, diag, movementSpeed, radius, center);
}

/**
 * Moves an object diagonally forward-right along the sphere's tangent plane.
 *
 * @param {THREE.Vector3} currentPosition - The current world position of the object.
 * @param {number} movementSpeed - The distance to move.
 * @param {number} radius - The sphere's radius.
 * @param {THREE.Vector3} center - The sphere's center.
 * @returns {THREE.Vector3} - The new position on the sphere's surface.
 */
export function moveForwardRight(
    currentPosition,
    movementSpeed,
    radius,
    center,
) {
    const radial = currentPosition.clone().sub(center).normalize();
    const { forward, right } = getTangentVectors(radial);
    const diag = forward.clone().add(right).normalize();
    return moveOnSphere(currentPosition, diag, movementSpeed, radius, center);
}

/**
 * Moves an object diagonally backward-left along the sphere's tangent plane.
 *
 * @param {THREE.Vector3} currentPosition - The current world position of the object.
 * @param {number} movementSpeed - The distance to move.
 * @param {number} radius - The sphere's radius.
 * @param {THREE.Vector3} center - The sphere's center.
 * @returns {THREE.Vector3} - The new position on the sphere's surface.
 */
export function moveBackwardLeft(
    currentPosition,
    movementSpeed,
    radius,
    center,
) {
    const radial = currentPosition.clone().sub(center).normalize();
    const { forward, right } = getTangentVectors(radial);
    const diag = forward
        .clone()
        .negate()
        .add(right.clone().negate())
        .normalize();
    return moveOnSphere(currentPosition, diag, movementSpeed, radius, center);
}

/**
 * Moves an object diagonally backward-right along the sphere's tangent plane.
 *
 * @param {THREE.Vector3} currentPosition - The current world position of the object.
 * @param {number} movementSpeed - The distance to move.
 * @param {number} radius - The sphere's radius.
 * @param {THREE.Vector3} center - The sphere's center.
 * @returns {THREE.Vector3} - The new position on the sphere's surface.
 */
export function moveBackwardRight(
    currentPosition,
    movementSpeed,
    radius,
    center,
) {
    const radial = currentPosition.clone().sub(center).normalize();
    const { forward, right } = getTangentVectors(radial);
    const diag = forward.clone().negate().add(right).normalize();
    return moveOnSphere(currentPosition, diag, movementSpeed, radius, center);
}
