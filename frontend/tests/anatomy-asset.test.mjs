import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const modelPath = new URL('../public/models/bodyparts3d-heart.glb', import.meta.url);
const model = readFileSync(modelPath);
const jsonLength = model.readUInt32LE(12);
const gltf = JSON.parse(model.subarray(20, 20 + jsonLength).toString('utf8'));

test('reference model contains separate left and right coronary tree meshes', () => {
  const sceneNodes = gltf.scenes[gltf.scene ?? 0].nodes.map(index => gltf.nodes[index]);
  for (const name of ['left-coronary', 'right-coronary']) {
    const node = sceneNodes.find(candidate => candidate.name === name);
    assert.ok(node, `missing ${name} scene node`);
    assert.notEqual(node.mesh, undefined, `${name} has no mesh`);
    const primitives = gltf.meshes[node.mesh].primitives;
    assert.ok(primitives.length > 0, `${name} has no geometry`);
    const positionAccessor = primitives[0].attributes.POSITION;
    assert.ok(positionAccessor !== undefined, `${name} has no vertex positions`);
    assert.ok(gltf.accessors[positionAccessor].count > 100, `${name} geometry is unexpectedly small`);
  }
});

test('reference model embeds its attribution and local attribution record exists', () => {
  assert.match(gltf.asset.copyright, /BodyParts3D.*CC Attribution 4\.0/i);
  const attributionPath = fileURLToPath(new URL('../public/models/BODY_PARTS3D_ATTRIBUTION.txt', import.meta.url));
  const attribution = readFileSync(attributionPath, 'utf8');
  assert.match(attribution, /CC BY 4\.0/);
  assert.match(attribution, /qualified anatomical review is pending/i);
});
