/** Return a camera position for the simplified educational C-arm view. */
export function projectionCameraPosition(obliqueDegrees, cranialDegrees, radius = 4.4, targetY = 0.05) {
  const oblique = obliqueDegrees * Math.PI / 180;
  const tilt = cranialDegrees * Math.PI / 180;
  return {
    x: radius * Math.sin(oblique) * Math.cos(tilt),
    y: targetY + radius * Math.sin(tilt),
    z: radius * Math.cos(oblique) * Math.cos(tilt)
  };
}
