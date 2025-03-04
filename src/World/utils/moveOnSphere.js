import * as THREE from 'three';

/**
 * Updates a THREE.Spherical instance by adding delta values to latitude and longitude.
 * We define latitude as: lat = π/2 - φ.
 *
 * @param {THREE.Spherical} spherical - The current spherical coordinates.
 * @param {number} deltaLat - Change in latitude (radians). Positive = forward/north.
 * @param {number} deltaLon - Change in longitude (radians). Positive = east.
 * @returns {THREE.Spherical} The same spherical instance updated.
 */
export function updateSpherical(spherical, deltaLat, deltaLon) {
    // Get current latitude from phi.
    let currentLat = Math.PI / 2 - spherical.phi;
    // Update latitude.
    currentLat += deltaLat;
    const epsilon = 0.001;
    // Clamp latitude to avoid singularities at the poles.
    currentLat = Math.max(
        -Math.PI / 2 + epsilon,
        Math.min(Math.PI / 2 - epsilon, currentLat),
    );
    // Update spherical.phi from latitude.
    spherical.phi = Math.PI / 2 - currentLat;
    // Update theta by adding deltaLon.
    spherical.theta += deltaLon;
    return spherical;
}

// Movement functions operate directly on a THREE.Spherical instance.
export function moveForwardSpherical(spherical, movementSpeed) {
    return updateSpherical(spherical, movementSpeed, 0);
}

export function moveBackwardsSpherical(spherical, movementSpeed) {
    return updateSpherical(spherical, -movementSpeed, 0);
}

export function moveRightSpherical(spherical, movementSpeed) {
    return updateSpherical(spherical, 0, movementSpeed);
}

export function moveLeftSpherical(spherical, movementSpeed) {
    return updateSpherical(spherical, 0, -movementSpeed);
}

export function moveForwardLeftSpherical(spherical, movementSpeed) {
    const diag = movementSpeed / Math.sqrt(2);
    return updateSpherical(spherical, diag, -diag);
}

export function moveForwardRightSpherical(spherical, movementSpeed) {
    const diag = movementSpeed / Math.sqrt(2);
    return updateSpherical(spherical, diag, diag);
}

export function moveBackwardLeftSpherical(spherical, movementSpeed) {
    const diag = movementSpeed / Math.sqrt(2);
    return updateSpherical(spherical, -diag, -diag);
}

export function moveBackwardRightSpherical(spherical, movementSpeed) {
    const diag = movementSpeed / Math.sqrt(2);
    return updateSpherical(spherical, -diag, diag);
}
