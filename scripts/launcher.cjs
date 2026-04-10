'use strict';
const { spawn } = require('node:child_process');
const { dirname, join } = require('node:path');

process.title = 'H2H iRacing';

const exeDir = dirname(process.execPath);
const child = spawn(
  join(exeDir, 'node.exe'),
  ['--env-file=.env', 'src/server/server.ts'],
  { cwd: exeDir, stdio: 'inherit' },
);

const kill = () => child.kill();
process.on('SIGINT', kill);
process.on('SIGTERM', kill);
child.on('exit', (code) => process.exit(code ?? 0));
