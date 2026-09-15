import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadContent, listFiles, sourceHash, validateOutput, requireValue} from './lib/content.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
export function checkSite(root = ROOT) {
  const data = loadContent(root);
  const dist = path.join(root, 'dist');
  requireValue(fs.existsSync(path.join(dist, '.source-manifest.json')), 'Generated site is missing. Run npm run build.');
  const manifest = JSON.parse(fs.readFileSync(path.join(dist, '.source-manifest.json'), 'utf8'));
  requireValue(manifest.sourceHash === sourceHash(root), 'Content or assets changed since the last build. Run npm run build, then npm run check.');
  const files = new Map(listFiles(dist).map(file => [path.relative(dist, file).split(path.sep).join('/'), fs.readFileSync(file)]));
  return validateOutput(root, data, files);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { const result = checkSite(); console.log(`PASS: ${result.pages} English pages; ${result.links} local links; ${result.events} calendar events match the editable schedule.`); }
  catch (error) { console.error(`Check failed: ${error.message}`); process.exitCode = 1; }
}
