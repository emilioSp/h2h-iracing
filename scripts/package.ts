import { execSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  globSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { Data, NtExecutable, NtExecutableResource, Resource } from 'resedit';

const NODE_VERSION = '24.14.1';
const PROJECT_ROOT = resolve(import.meta.dirname, '..');
const SCRIPTS_DIR = join(PROJECT_ROOT, 'scripts');
const NODE_MODULES = join(PROJECT_ROOT, 'node_modules');
const CACHE_DIR = join(PROJECT_ROOT, '.cache');
const BUILD_DIR = join(PROJECT_ROOT, 'build');
const DIST_DIR = join(BUILD_DIR, 'h2h-iracing');
const CACHED_NODE = join(CACHE_DIR, 'node.exe');
const CACHED_NODE_VERSION = join(CACHE_DIR, 'node.exe.version');
const SIMHUB_DASHIES_DIR = join(PROJECT_ROOT, 'simhub_dashies');
const VERSION = process.env.npm_package_version;

const ZIP_FILE = join(BUILD_DIR, `h2h-iracing-${VERSION}.zip`);

console.log('\n=== H2H iRacing Packager ===\n');

mkdirSync(CACHE_DIR, { recursive: true });

rmSync(NODE_MODULES, { recursive: true, force: true });
rmSync(join(PROJECT_ROOT, 'dist'), { recursive: true, force: true });
execSync('npm ci', { cwd: PROJECT_ROOT, stdio: 'inherit' });

const cachedVersion =
  existsSync(CACHED_NODE_VERSION) ?
    readFileSync(CACHED_NODE_VERSION, 'utf-8').trim()
  : null;

if (existsSync(CACHED_NODE) && cachedVersion === NODE_VERSION) {
  console.log(`Using cached node.exe (v${NODE_VERSION})`);
} else {
  console.log(`Downloading Node.js v${NODE_VERSION}...`);
  const url = `https://nodejs.org/dist/v${NODE_VERSION}/win-x64/node.exe`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download node.exe: ${res.status}`);
  writeFileSync(CACHED_NODE, Buffer.from(await res.arrayBuffer()));
  writeFileSync(CACHED_NODE_VERSION, NODE_VERSION);
  console.log('Downloaded node.exe');
}

if (existsSync(BUILD_DIR)) {
  console.log('Cleaning previous build...');
  rmSync(BUILD_DIR, { recursive: true, force: true });
}
mkdirSync(DIST_DIR, { recursive: true });

console.log('Building dashboards...');

execSync('npm run h2h:build', {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
});

execSync('npm run weather:build', {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
});

execSync('npm run car:build', {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
});

console.log('Building launcher exe...');
execSync(
  `node_modules/.bin/pkg scripts/launcher.cjs --targets node24-win-x64 --output ${join(BUILD_DIR, 'h2h-iracing.exe')}`,
  { cwd: PROJECT_ROOT, stdio: 'inherit' },
);

const icoPath = join(SCRIPTS_DIR, 'h2h.ico');
if (existsSync(icoPath)) {
  console.log('Embedding icon and version info...');
  const exePath = join(BUILD_DIR, 'h2h-iracing.exe');
  const exe = NtExecutable.from(readFileSync(exePath), { ignoreCert: true });
  const res = NtExecutableResource.from(exe);

  // Parse the .ico file into individual icon images, then replace icon group ID 1 in the PE resource table with them
  const iconFile = Data.IconFile.from(readFileSync(icoPath));
  Resource.IconGroupEntry.replaceIconsForResource(
    res.entries,
    1,
    1033, // ID for en-US
    iconFile.icons.map((i) => i.data),
  );

  const version = VERSION ?? '0.0.0';
  const [major, minor, patch] = version.split('.').map(Number);
  const versionInfos = Resource.VersionInfo.fromEntries(res.entries);
  const vi =
    versionInfos.length > 0
      ? versionInfos[0]
      : Resource.VersionInfo.createEmpty();
  vi.setFileVersion(major, minor, patch, 0);
  vi.setProductVersion(major, minor, patch, 0);
  vi.setStringValues(
    { lang: 1033, codepage: 1200 },
    {
      FileDescription: 'H2H iRacing Overlay',
      ProductName: 'H2H iRacing',
      FileVersion: version,
      ProductVersion: version,
    },
  );
  vi.outputToResourceEntries(res.entries);
  res.outputResource(exe);
  writeFileSync(exePath, Buffer.from(exe.generate()));
} else {
  console.log('Warning: scripts/h2h.ico not found — skipping icon embedding.');
}

console.log('Installing production dependencies...');
execSync('npm ci --omit=dev', { cwd: PROJECT_ROOT, stdio: 'inherit' });

console.log('Assembling distribution...');

cpSync(CACHED_NODE, join(DIST_DIR, 'node.exe'));
cpSync(join(BUILD_DIR, 'h2h-iracing.exe'), join(DIST_DIR, 'h2h-iracing.exe'));
cpSync(
  join(SIMHUB_DASHIES_DIR, 'H2H-Car_dashboard.simhubdash'),
  join(DIST_DIR, 'H2H-Car_dashboard.simhubdash'),
);
cpSync(
  join(SIMHUB_DASHIES_DIR, 'H2H-Head_to_Head_dashboard.simhubdash'),
  join(DIST_DIR, 'H2H-Head_to_Head_dashboard.simhubdash'),
);
cpSync(
  join(SIMHUB_DASHIES_DIR, 'H2H-Weather_dashboard.simhubdash'),
  join(DIST_DIR, 'H2H-Weather_dashboard.simhubdash'),
);
cpSync(join(PROJECT_ROOT, '.env'), join(DIST_DIR, '.env'));
cpSync(join(PROJECT_ROOT, 'package.json'), join(DIST_DIR, 'package.json'));
cpSync(join(PROJECT_ROOT, 'src/server'), join(DIST_DIR, 'src/server'), {
  recursive: true,
  filter: (src) => !src.endsWith('.test.ts'),
});
cpSync(
  join(PROJECT_ROOT, 'dist/h2h-dashboard'),
  join(DIST_DIR, 'dist/h2h-dashboard'),
  {
    recursive: true,
  },
);
cpSync(
  join(PROJECT_ROOT, 'dist/weather-dashboard'),
  join(DIST_DIR, 'dist/weather-dashboard'),
  {
    recursive: true,
  },
);
cpSync(
  join(PROJECT_ROOT, 'dist/car-dashboard'),
  join(DIST_DIR, 'dist/car-dashboard'),
  {
    recursive: true,
  },
);

console.log('Copying node_modules (production)...');
cpSync(join(PROJECT_ROOT, 'node_modules'), join(DIST_DIR, 'node_modules'), {
  recursive: true,
});

console.log('Creating zip archive...');
globSync('h2h-iracing-*.zip', { cwd: PROJECT_ROOT }).forEach((file) => {
  rmSync(join(PROJECT_ROOT, file));
});
execSync(`zip -r -q "${ZIP_FILE}" h2h-iracing`, {
  cwd: BUILD_DIR,
  stdio: 'inherit',
});

const sizeMB = (statSync(ZIP_FILE).size / 1024 / 1024).toFixed(1);

console.log('\n=== Build complete ===');
console.log(`Output: ${ZIP_FILE} (${sizeMB} MB)`);
console.log('Extract the zip and double-click h2h-iracing.exe to run.\n');

cpSync(ZIP_FILE, join(PROJECT_ROOT, `h2h-iracing-${VERSION}.zip`));

console.log('Restoring dev dependencies...');
execSync('npm ci', { cwd: PROJECT_ROOT, stdio: 'inherit' });
