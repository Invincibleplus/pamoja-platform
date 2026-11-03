import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const fixScript = path.join(__dirname, 'windows-fs-fix.cjs').replace(/\\/g, '/');
const nextBin = path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next');

const existingNodeOptions = process.env.NODE_OPTIONS || '';
const env = {
  ...process.env,
  NODE_OPTIONS: `${existingNodeOptions} --require "${fixScript}"`.trim(),
};

const child = spawn(process.execPath, [nextBin, 'build', '--webpack'], {
  cwd: rootDir,
  stdio: 'inherit',
  env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

