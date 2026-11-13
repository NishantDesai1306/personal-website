const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { spawnSync } = require('node:child_process');

const root = resolve(__dirname, '..');
const assets = require('../src/offline-assets.json');
const revision = createHash('sha256');
for (const asset of assets) {
  revision.update(asset);
  revision.update(readFileSync(resolve(root, 'public', asset.slice(1))));
}

// CRA does not include arbitrary public files in Workbox's generated manifest.
// Version them from their contents so a changed resume invalidates its cache.
const result = spawnSync(process.execPath, [require.resolve('react-scripts/scripts/build')], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, REACT_APP_OFFLINE_ASSET_REVISION: revision.digest('hex') },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
