import test from 'node:test';
import assert from 'node:assert/strict';
import { projectionCameraPosition } from '../src/projection.js';

test('AP neutral view points along the anterior axis', () => {
  const p = projectionCameraPosition(0, 0, 4.4, 0.05);
  assert.ok(Math.abs(p.x) < 1e-12);
  assert.equal(p.y, 0.05);
  assert.ok(Math.abs(p.z - 4.4) < 1e-12);
});

test('oblique and cranial/caudal angles move the projection camera consistently', () => {
  const rao = projectionCameraPosition(-30, 0);
  const lao = projectionCameraPosition(30, 0);
  const cranial = projectionCameraPosition(0, 20);
  const caudal = projectionCameraPosition(0, -20);
  assert.ok(rao.x < 0);
  assert.ok(lao.x > 0);
  assert.ok(cranial.y > 0.05);
  assert.ok(caudal.y < 0.05);
});

test('projection camera stays at a fixed radius for every supported angle', () => {
  for (const oblique of [-45, -25, 0, 25, 45]) {
    for (const tilt of [-30, -15, 0, 15, 30]) {
      const { x, y, z } = projectionCameraPosition(oblique, tilt, 4.4, 0.05);
      const distance = Math.hypot(x, y - 0.05, z);
      assert.ok(Number.isFinite(distance));
      assert.ok(Math.abs(distance - 4.4) < 1e-10);
    }
  }
});
