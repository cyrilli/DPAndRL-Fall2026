import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);entry.isDirectory()?walk(p):files.push(p);}}
walk(dist);
let links=0;
for(const file of files.filter(p=>p.endsWith('.html'))){
 const text=fs.readFileSync(file,'utf8');
 assert(text.includes('<html lang="en">'),`Missing English document language: ${file}`);
 assert(!/[\u3400-\u9fff]/u.test(text),`Unexpected Chinese text in authored page: ${file}`);
 assert(!text.includes('127.0.0.1'),`Local-only URL in published page: ${file}`);
 assert(!text.includes('href="/'),`Root-relative link would break a repository subpath: ${file}`);
 for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=match[1];
  if(/^(https?:|mailto:|data:)/.test(url))continue;
  const [pathname,hash]=url.split('#');
  const target=pathname?path.resolve(path.dirname(file),decodeURIComponent(pathname)):file;
  assert(target.startsWith(dist+path.sep),`Link outside site: ${url}`);
  assert(fs.existsSync(target),`Broken local link in ${file}: ${url}`);
  if(hash&&target.endsWith('.html'))assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`Missing anchor: ${url}`);
  links++;
 }
}
const ics=fs.readFileSync(path.join(dist,'downloads/course-calendar.ics'),'utf8').replace(/\r\n /g,'');
const starts=[...ics.matchAll(/^DTSTART:(\d{8})T(\d{6})Z/gm)];
assert.equal(starts.length,15,'Expected 15 regular Tuesday events');
assert.equal(new Set(starts.map(x=>x[1])).size,15,'Duplicate calendar event');
assert.equal(starts[0][1],'20260915');assert.equal(starts.at(-1)[1],'20261229');
assert(!starts.some(x=>x[1]==='20261006'),'Holiday must not be a class event');
for(const [_,d,t] of starts){assert.equal(t,'015000');assert.equal(new Date(`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}T00:00:00Z`).getUTCDay(),2);}
assert.equal((ics.match(/^DTEND:\d{8}T041500Z/gm)||[]).length,15);
assert(fs.existsSync(path.join(dist,'.nojekyll')));
console.log(`PASS: ${files.filter(x=>x.endsWith('.html')).length} English pages; ${links} local links; 15 Tuesday events; holiday excluded; repository-relative URLs.`);
