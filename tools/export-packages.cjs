const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist-packages');
const ctx = { window: {}, console };
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/render.js'), 'utf8'), ctx);
const gen = ctx.window.EonixGen;
const data = JSON.parse(fs.readFileSync(path.join(root, 'data/site-data.json'), 'utf8'));
const toWebPath = (value) => String(value || '').replace(/\\/g, '/');
const read = (p) => fs.readFileSync(path.join(root, p));
const write = (base, relative, value) => {
  const target = path.join(base, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, value);
};
const clear = (p) => fs.rmSync(p, { recursive: true, force: true });
const copy = (src, dest) => {
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, dest, { recursive: true, filter: (p) => !p.includes(`${path.sep}backup-before-dashboard-`) && !p.includes(`${path.sep}dist-packages`) });
};

clear(output);
const pubRoot = path.join(output, 'public');
const ownerRoot = path.join(output, 'owner');
fs.mkdirSync(pubRoot, { recursive: true });
fs.mkdirSync(ownerRoot, { recursive: true });

for (const p of ['index.html', 'css', 'js', 'assets', 'robots.txt']) {
  copy(path.join(root, p), path.join(pubRoot, p));
}
const publishedState = {
  games: (data.games || []).filter((g) => g.published === true).map((g) => ({ ...g, id: g.id || g.slug })),
  articles: (data.articles || []).filter((a) => a.published === true).map((a) => ({ ...a, id: a.id || a.slug })),
  launch: data.launch || { enabled: false }
};
const generated = gen.buildFiles(publishedState, { res: (x) => x, siteUrl: '', md: gen.plainMd });
for (const f of generated.files) write(pubRoot, toWebPath(f.path), f.text);
if (!fs.existsSync(path.join(pubRoot, 'sitemap.xml'))) write(pubRoot, 'sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>/</loc></url></urlset>\n');

const readme = fs.readFileSync(path.join(root, 'README_AR.md'));
const ownerReadme = Buffer.concat([readme, Buffer.from('\n\nتتضمن هذه الحزمة مجلد public للموقع العام وملفات المشروع ولوحة الإدارة محلياً. لا ترفع owner إلى استضافة الموقع.\n')]);
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (['.git', 'backup-before-dashboard-2026-11-10', 'dist-packages', 'EONIX_GAMES_OWNER_PACKAGE.zip', 'EONIX_GAMES_PUBLIC_WEBSITE.zip'].includes(entry.name)) continue;
  copy(path.join(root, entry.name), path.join(ownerRoot, entry.name));
}
write(ownerRoot, 'README.md', ownerReadme);
write(ownerRoot, 'README_AR.md', ownerReadme);

console.log(`Public files generated: ${generated.files.length + 8}`);
console.log(`Owner package staged: ${ownerRoot}`);
