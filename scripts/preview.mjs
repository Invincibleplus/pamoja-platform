import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const prerenderManifestPath = path.join(rootDir, '.next', 'prerender-manifest.json');
const fixScript = path.join(__dirname, 'windows-fs-fix.cjs').replace(/\\/g, '/');
const nextBin = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');

const existingNodeOptions = process.env.NODE_OPTIONS || '';
const env = {
  ...process.env,
  NODE_OPTIONS: `${existingNodeOptions} --require "${fixScript}"`.trim(),
};

function runNext(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [nextBin, ...args], {
      cwd: rootDir,
      stdio: 'inherit',
      env,
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`next ${args.join(' ')} exited with code ${code}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(prerenderManifestPath)) {
    console.log('⚙ Production build manifest (.next/prerender-manifest.json) not found. Running build first...');
    await runNext(['build', '--webpack']);
  }
  await runNext(['start']);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
