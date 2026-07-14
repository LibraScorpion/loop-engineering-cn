#!/usr/bin/env node
/**
 * Regenerate CONTRIBUTORS.md from GitHub API + story attributions.
 * Requires: gh auth login (read access to public repo is enough)
 *
 *   node scripts/generate-contributors.mjs
 *   node scripts/generate-contributors.mjs --check   # exit 1 if file would change
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'CONTRIBUTORS.md');
const REPO = 'cobusgreyling/loop-engineering';
const MAINTAINER = 'cobusgreyling';
const BOTS = new Set(['github-actions[bot]', 'dependabot[bot]', 'dependabot']);

const CONTRIBUTOR_QUICKSTART =
  'https://github.com/cobusgreyling/loop-engineering/discussions/123';

function ghJson(args) {
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8', cwd: ROOT }));
}

function ghApiPaginated(route) {
  const out = execFileSync('gh', ['api', route, '--paginate'], { encoding: 'utf8', cwd: ROOT });
  const items = [];
  for (const line of out.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) items.push(...parsed);
    else items.push(parsed);
  }
  return items;
}

function storyAttributions() {
  const storiesDir = path.join(ROOT, 'stories');
  const attributions = new Map();
  let files;
  try {
    files = readdirSync(storiesDir).filter((f) => f.endsWith('.md'));
  } catch {
    return attributions;
  }
  const re = /Contributed by \[@([^\]]+)\]/g;
  for (const file of files) {
    const text = readFileSync(path.join(storiesDir, file), 'utf8');
    for (const m of text.matchAll(re)) {
      const login = m[1];
      if (!attributions.has(login)) attributions.set(login, []);
      attributions.get(login).push(`案例：\`${file}\``);
    }
  }
  return attributions;
}

async function main() {
  const check = process.argv.includes('--check');

  const apiContributors = ghApiPaginated(`repos/${REPO}/contributors`);

  const mergedPrs = ghJson([
    'pr',
    'list',
    '--repo',
    REPO,
    '--state',
    'merged',
    '--limit',
    '200',
    '--json',
    'author,title,number',
  ]);

  const highlights = new Map();
  for (const pr of mergedPrs) {
    const login = pr.author?.login;
    if (!login || login === MAINTAINER || pr.author?.is_bot) continue;
    if (!highlights.has(login)) highlights.set(login, []);
    const list = highlights.get(login);
    if (list.length < 2) list.push(`#${pr.number} ${pr.title}`);
  }

  const storyAttrs = storyAttributions();

  const people = new Map();
  for (const c of apiContributors) {
    const login = c.login;
    if (login === MAINTAINER || BOTS.has(login) || login.endsWith('[bot]')) continue;
    people.set(login, {
      login,
      contributions: c.contributions ?? 0,
      highlights: highlights.get(login) ?? [],
      stories: storyAttrs.get(login) ?? [],
    });
  }

  for (const [login, stories] of storyAttrs) {
    if (people.has(login)) {
      people.get(login).stories = stories;
      continue;
    }
    people.set(login, {
      login,
      contributions: 0,
      highlights: highlights.get(login) ?? [],
      stories,
    });
  }

  const sorted = [...people.values()].sort((a, b) => {
    const score = (p) => p.contributions + p.stories.length * 2 + p.highlights.length;
    return score(b) - score(a) || a.login.localeCompare(b.login);
  });

  const generated = new Date().toISOString().slice(0, 10);
  const lines = [
    '<a id="contributors"></a>',
    '# 贡献者',
    '',
    '感谢每一位为文档、案例、示例和工具修复做出贡献的成员。',
    '',
    `*由 \`node scripts/generate-contributors.mjs\` 于 ${generated} 生成——合并后请重新运行。*`,
    '',
    '| 贡献者 | 贡献亮点 |',
    '|-------------|------------|',
  ];

  for (const p of sorted) {
    const bits = [...p.highlights, ...p.stories];
    const cell =
      bits.length > 0
        ? bits.map((b) => b.replace(/\|/g, '\\|')).join('<br>')
        : `${p.contributions} 次提交`;
    lines.push(`| [@${p.login}](https://github.com/${p.login}) | ${cell} |`);
  }

  lines.push(
    '',
    '<a id="your-first-pr"></a>',
    '## 你的第一个 PR',
    '',
    '选择一项范围明确、约 15 分钟可完成的任务：[贡献者快速入门](' + CONTRIBUTOR_QUICKSTART + ')。',
    '',
    '案例、采用者和文档类贡献可在当天获得审查——请参阅 [CONTRIBUTING.md](./CONTRIBUTING.md)。',
    '',
  );

  const content = lines.join('\n');

  if (check) {
    const existing = readFileSync(OUT, 'utf8');
    if (existing !== content) {
      console.error('CONTRIBUTORS.md 已过期。请运行：node scripts/generate-contributors.mjs');
      process.exit(1);
    }
    console.log('CONTRIBUTORS.md 已是最新。');
    return;
  }

  writeFileSync(OUT, content);
  console.log(`已写入 ${OUT}（${sorted.length} 位贡献者）`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
