import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

const NODE_VERSION = '24.3.0';
const PROJECT_ROOT = resolve(import.meta.dirname, '..');
const SCRIPTS_DIR = join(PROJECT_ROOT, 'scripts');
const NODE_MODULES = join(PROJECT_ROOT, 'node_modules');
const CACHE_DIR = join(PROJECT_ROOT, '.cache');
const BUILD_DIR = join(PROJECT_ROOT, 'build');
const DIST_DIR = join(BUILD_DIR, 'h2h-iracing');
const CACHED_NODE = join(CACHE_DIR, 'node.exe');

const today = new Date();
const VERSION = `${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}_${today.getHours()}${today.getMinutes()}`;
const ZIP_FILE = join(BUILD_DIR, `h2h-iracing_${VERSION}.zip`);

console.log('\n=== H2H iRacing Packager ===\n');

mkdirSync(CACHE_DIR, { recursive: true });

rmSync(NODE_MODULES, { recursive: true, force: true });
rmSync(join(PROJECT_ROOT, 'dist'), { recursive: true, force: true });
execSync('npm ci', { cwd: PROJECT_ROOT, stdio: 'inherit' });

if (!existsSync(CACHED_NODE)) {
  const url = `https://nodejs.org/dist/v${NODE_VERSION}/win-x64/node.exe`;
  console.log(`Downloading Node.js v${NODE_VERSION}...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download node.exe: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(CACHED_NODE, buffer);
  console.log('Downloaded node.exe');
} else {
  console.log('Using cached node.exe');
}

if (existsSync(BUILD_DIR)) {
  console.log('Cleaning previous build...');
  rmSync(BUILD_DIR, { recursive: true, force: true });
}
mkdirSync(DIST_DIR, { recursive: true });

console.log('Building UI...');
execSync('npm run ui:build', {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
});

console.log('Installing production dependencies...');
execSync('npm ci --omit=dev', { cwd: PROJECT_ROOT, stdio: 'inherit' });

console.log('Assembling distribution...');

cpSync(CACHED_NODE, join(DIST_DIR, 'node.exe'));
cpSync(join(SCRIPTS_DIR, 'h2h.bat'), join(DIST_DIR, 'h2h.bat'));
cpSync(join(PROJECT_ROOT, '.env'), join(DIST_DIR, '.env'));
cpSync(join(PROJECT_ROOT, 'package.json'), join(DIST_DIR, 'package.json'));
cpSync(join(PROJECT_ROOT, 'src/server'), join(DIST_DIR, 'src/server'), {
  recursive: true,
  filter: (src) => !src.endsWith('.test.ts'),
});
cpSync(join(PROJECT_ROOT, 'dist/ui'), join(DIST_DIR, 'dist/ui'), {
  recursive: true,
});

console.log('Copying node_modules (production)...');
cpSync(join(PROJECT_ROOT, 'node_modules'), join(DIST_DIR, 'node_modules'), {
  recursive: true,
});

console.log('Creating zip archive...');
if (existsSync(ZIP_FILE)) rmSync(ZIP_FILE);
execSync(`zip -r -q "${ZIP_FILE}" h2h-iracing`, {
  cwd: BUILD_DIR,
  stdio: 'inherit',
});

const sizeMB = (statSync(ZIP_FILE).size / 1024 / 1024).toFixed(1);

console.log('\n=== Build complete ===');
console.log(`Output: ${ZIP_FILE} (${sizeMB} MB)`);
console.log('Extract the zip, double-click h2h.bat to run.\n');

cpSync(ZIP_FILE, join(PROJECT_ROOT, `h2h-iracing_${VERSION}.zip`));

console.log('Restoring dev dependencies...');
execSync('npm ci', { cwd: PROJECT_ROOT, stdio: 'inherit' });
