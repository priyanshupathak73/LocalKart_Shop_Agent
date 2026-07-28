import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const canonicalCwd = fs.realpathSync(process.cwd());
process.chdir(canonicalCwd);

const nextBin = path.resolve(canonicalCwd, 'node_modules/next/dist/bin/next');

const child = spawn(process.execPath, [nextBin, 'dev'], {
  cwd: canonicalCwd,
  stdio: 'inherit',
  env: {
    ...process.env,
    PWD: canonicalCwd,
    INIT_CWD: canonicalCwd,
  }
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
