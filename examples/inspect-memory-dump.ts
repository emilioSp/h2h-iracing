import { statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import {
  type Driver,
  IRSDK,
  SESSION_DATA_KEYS,
  VARS,
} from '@emiliosp/node-iracing-sdk';

type Column = {
  label: string;
  className?: string;
};

const columnClass = (column: Column | undefined): string =>
  column?.className ? ` class="${column.className}"` : '';

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const cell = (value: unknown): string => escapeHtml(String(value));

const cellList = (values: unknown[]): string =>
  [...new Set(values)].map(cell).join(', ');

type RenderTableInput = {
  columns: Column[];
  rows: string[][];
  highlightRow?: number;
};

const renderTable = ({
  columns,
  rows,
  highlightRow,
}: RenderTableInput): string => {
  const head = columns
    .map((c) => `<th${columnClass(c)}>${escapeHtml(c.label)}</th>`)
    .join('');

  const body = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, i) => `<td${columnClass(columns[i])}>${value}</td>`)
        .join('');
      return `<tr${rowIndex === highlightRow ? ' class="me"' : ''}>${cells}</tr>`;
    })
    .join('');

  return `<div class="scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
};

const section = ({ title, body }: { title: string; body: string }): string =>
  `<section><h2>${escapeHtml(title)}</h2>${body}</section>`;

const printValues = (values: unknown[]): string => {
  if (values.length === 1) return cell(values[0]);
  return values
    .map((value, index) => `<b>${index}</b>:${cell(value)}`)
    .join('  ');
};

if (!process.env.DUMP_FILE_PATH) {
  console.error('No dump to inspect. Set DUMP_FILE_PATH in .env');
  process.exit(1);
}

const outPath = join(import.meta.dirname, 'dump-report.html');
const absoluteDumpPath = resolve(process.env.DUMP_FILE_PATH);

const ir = IRSDK.fromDump(process.env.DUMP_FILE_PATH);
ir.refreshSharedMemory();

const readVar = (key: string): unknown[] | null => {
  try {
    return ir.get(key as never);
  } catch {
    return null;
  }
};

const weekend = ir.getSessionInfo(SESSION_DATA_KEYS.WEEKEND_INFO);
const sessionInfo = ir.getSessionInfo(SESSION_DATA_KEYS.SESSION_INFO);
const drivers = ir.getSessionInfo(SESSION_DATA_KEYS.DRIVER_INFO)?.Drivers ?? [];

const playerCarIdx = readVar(VARS.PLAYER_CAR_IDX)?.[0] as number;
const playerRow = drivers.findIndex((d) => d.CarIdx === playerCarIdx);

// ---------------------------------------------------------------- overview

const overview = renderTable({
  columns: [{ label: 'Field' }, { label: 'Value' }],
  rows: [
    ['Dump', cell(absoluteDumpPath)],
    [
      'Size',
      cell(
        `${(statSync(process.env.DUMP_FILE_PATH).size / 1024 / 1024).toFixed(2)} MB`,
      ),
    ],
    ['Track', cell(weekend?.TrackDisplayName)],
    ['Track length', cell(weekend?.TrackLength)],
    ['Event type', cell(weekend?.EventType)],
    ['Category', cell(weekend?.Category)],
    ['Sessions', cell(sessionInfo?.Sessions?.length)],
    ['Player car index', cell(playerCarIdx)],
    ['Drivers', cell(drivers.length)],
  ],
});

// ------------------------------------------------------------ car classes

const driversByClassId = Map.groupBy(drivers, (d) => d.CarClassID);

const classes = renderTable({
  columns: [
    { label: 'CarClassID' },
    { label: 'Cars', className: 'r' },
    { label: 'CarClassShortName' },
    { label: 'CarClassRelSpeed' },
    { label: 'CarClassEstLapTime' },
    { label: 'Car models' },
  ],
  rows: [...driversByClassId].map(([classId, members]) => [
    cell(classId),
    cell(members.length),
    cellList(members.map((d) => d.CarClassShortName)),
    cellList(members.map((d) => d.CarClassRelSpeed)),
    cellList(members.map((d) => d.CarClassEstLapTime).sort((a, b) => a - b)),
    cellList(members.map((d) => d.CarScreenNameShort)),
  ]),
});

// ---------------------------------------------------------------- drivers

const DRIVER_COLUMNS: (Column & { key: keyof Driver })[] = [
  { label: 'CarIdx', key: 'CarIdx', className: 'r' },
  { label: 'UserName', key: 'UserName' },
  { label: 'CarNumber', key: 'CarNumber', className: 'r' },
  { label: 'IRating', key: 'IRating', className: 'r' },
  { label: 'LicString', key: 'LicString' },
  { label: 'CarClassID', key: 'CarClassID', className: 'r' },
  { label: 'CarClassShortName', key: 'CarClassShortName' },
  { label: 'CarClassRelSpeed', key: 'CarClassRelSpeed', className: 'r' },
  { label: 'CarClassEstLapTime', key: 'CarClassEstLapTime', className: 'r' },
  { label: 'CarScreenNameShort', key: 'CarScreenNameShort' },
  { label: 'PaceCar', key: 'CarIsPaceCar', className: 'r' },
  { label: 'AI', key: 'CarIsAI', className: 'r' },
];

const driverTable = renderTable({
  columns: DRIVER_COLUMNS,
  highlightRow: playerRow,
  rows: drivers.map((d) => DRIVER_COLUMNS.map((c) => cell(d[c.key]))),
});

// ------------------------------------------------------------------- cars

const CAR_VARS = [
  VARS.CAR_IDX_CLASS,
  VARS.CAR_IDX_LAP_DIST_PCT,
  VARS.CAR_IDX_LAP_COMPLETED,
  VARS.CAR_IDX_ON_PIT_ROAD,
  VARS.CAR_IDX_TRACK_SURFACE,
  VARS.CAR_IDX_EST_TIME,
  VARS.CAR_IDX_POSITION,
  VARS.CAR_IDX_CLASS_POSITION,
  VARS.CAR_IDX_LAST_LAP_TIME,
  VARS.CAR_IDX_BEST_LAP_TIME,
];

const carValues = CAR_VARS.map((key) => readVar(key) ?? []);

const carTable = renderTable({
  columns: [
    { label: 'CarIdx', className: 'r' },
    { label: 'Driver' },
    ...CAR_VARS.map((key) => ({ label: key, className: 'r' })),
  ],
  highlightRow: playerRow,
  rows: drivers.map((d) => [
    cell(d.CarIdx),
    cell(d.UserName),
    ...carValues.map((values) => cell(values[d.CarIdx])),
  ]),
});

// ---------------------------------------------------------- telemetry vars

const varConstantByKey = new Map(
  Object.entries(VARS).map(([constant, key]) => [key as string, constant]),
);

const varNames = ir.getVarHeadersNamesList().sort();

const varsTable = renderTable({
  columns: [
    { label: 'Variable' },
    { label: 'VARS constant' },
    { label: 'Value', className: 'w' },
  ],
  rows: varNames.map((name) => {
    const values = readVar(name);
    return [
      cell(name),
      cell(varConstantByKey.get(name) ?? ''),
      values === null ? '<i>unreadable</i>' : printValues(values),
    ];
  }),
});

// ------------------------------------------------------------ session info

const sessionSections = Object.values(SESSION_DATA_KEYS)
  .map((key) => {
    const value = ir.getSessionInfo(key);
    const json =
      value === undefined
        ? 'not present in this dump'
        : JSON.stringify(value, null, 2);
    return `<details><summary>${escapeHtml(key)}</summary><pre>${escapeHtml(json)}</pre></details>`;
  })
  .join('');

// ------------------------------------------------------------------- write

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dump inspector — ${escapeHtml(basename(process.env.DUMP_FILE_PATH))}</title>
<style>
  :root { color-scheme: light dark; --bg:#fff; --fg:#161616; --dim:#666; --line:#ddd; --head:#f4f4f4; --me:#fff6d5; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0d0d0d; --fg:#e8e8e8; --dim:#999; --line:#2a2a2a; --head:#161616; --me:#2a2410; }
  }
  body { margin:0; padding:2rem 1.5rem 4rem; background:var(--bg); color:var(--fg);
         font:14px/1.5 ui-sans-serif, system-ui, sans-serif; }
  h1 { font-size:1.4rem; margin:0 0 .25rem; }
  h2 { font-size:1.05rem; margin:2.5rem 0 .75rem; padding-bottom:.35rem; border-bottom:1px solid var(--line); }
  .sub { color:var(--dim); margin:0 0 1rem; font-family:ui-monospace, monospace; font-size:.85rem; }
  .scroll { overflow-x:auto; }
  table { border-collapse:collapse; font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:.8rem; }
  th, td { border:1px solid var(--line); padding:.3rem .5rem; text-align:left; white-space:nowrap; }
  th { background:var(--head); position:sticky; top:0; }
  td.r, th.r { text-align:right; }
  td.w { white-space:normal; min-width:36rem; }
  tr.me { background:var(--me); font-weight:600; }
  details { border:1px solid var(--line); border-radius:4px; margin-bottom:.5rem; }
  summary { cursor:pointer; padding:.5rem .75rem; font-family:ui-monospace, monospace; }
  pre { margin:0; padding:.75rem; overflow-x:auto; font-size:.75rem; border-top:1px solid var(--line); }
</style>
</head>
<body>
<h1>iRacing shared-memory dump</h1>
<p class="sub">${escapeHtml(absoluteDumpPath)}</p>
${section({ title: 'Overview', body: overview })}
${section({ title: 'Car classes', body: classes })}
${section({ title: 'Drivers', body: driverTable })}
${section({ title: 'Cars', body: carTable })}
${section({ title: `Telemetry variables (${varNames.length})`, body: varsTable })}
${section({ title: 'Session info', body: sessionSections })}
</body>
</html>`;

writeFileSync(outPath, html);

console.log(`Report written to ${resolve(outPath)}`);
console.log(
  `${drivers.length} drivers, ${driversByClassId.size} car class(es), ${varNames.length} telemetry variables`,
);
