// Checks every video in src/data/videos.ts against YouTube's public oEmbed endpoint
// and reports the ones that no longer resolve (removed, private, or region-blocked).
// Usage: node scripts/check-videos.mjs [--write]
//   --write  also patch `creatorChannel` and `verifiedAt` (today, UTC) into each playable
//            entry of videos.ts. Idempotent: the two fields are always the last in an entry,
//            replaced rather than duplicated. Unavailable entries are reported, never edited.
import { readFileSync, writeFileSync } from 'node:fs';

const write = process.argv.includes('--write');
const videosUrl = new URL('../src/data/videos.ts', import.meta.url);
const source = readFileSync(videosUrl, 'utf8');
const ids = [...source.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);

// A thrown error is a network hiccup, not a verdict: retry those once. HTTP errors are final.
const check = async (id, attempt = 1) => {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return { id, ok: false, status: res.status };
    const data = await res.json();
    return { id, ok: true, author: data.author_name, title: data.title };
  } catch (err) {
    if (attempt < 2) return check(id, attempt + 1);
    return { id, ok: false, status: err?.name ?? 'error' };
  }
};

const results = await Promise.all(ids.map((id) => check(id)));

const dead = results.filter((r) => !r.ok);
const byAuthor = results
  .filter((r) => r.ok)
  .reduce((acc, r) => acc.set(r.author, (acc.get(r.author) ?? 0) + 1), new Map());

console.log(`Checked ${ids.length} videos: ${ids.length - dead.length} ok, ${dead.length} unavailable.\n`);
if (dead.length) {
  console.log('Unavailable:');
  for (const d of dead) console.log(`  ${d.id}  (${d.status})`);
  console.log('');
}
console.log('Videos per channel:');
for (const [author, n] of [...byAuthor].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${author}`);

if (write) {
  const info = new Map(results.filter((r) => r.ok).map((r) => [r.id, r.author]));
  const today = new Date().toISOString().slice(0, 10);
  const quote = (v) => `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  let patched = 0;
  const next = source.replace(/^ {2}\{\n {4}id: '([^']+)',\n[\s\S]*?\n {2}\},$/gm, (block, id) => {
    if (!info.has(id)) return block;
    const lines = block
      .split('\n')
      .filter((l) => !/^ {4}(creatorChannel|verifiedAt):/.test(l));
    const close = lines.pop();
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,?$/, ',');
    lines.push(`    creatorChannel: ${quote(info.get(id))},`, `    verifiedAt: '${today}'`, close);
    patched++;
    return lines.join('\n');
  });
  if (next !== source) writeFileSync(videosUrl, next);
  console.log(`\nWrote creatorChannel/verifiedAt for ${patched} videos${next === source ? ' (no changes)' : ''}.`);
}

process.exitCode = dead.length ? 1 : 0;
