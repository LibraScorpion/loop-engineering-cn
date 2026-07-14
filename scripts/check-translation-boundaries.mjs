#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT_PROTECTED_FILES = new Set([
  'AGENTS.md',
  'LOOP.md',
  'STATE.md',
  'loop-budget.md',
  'loop-constraints.md',
  'loop-run-log.md',
]);
const HAN_CHARACTER = /\p{Script=Han}/u;

function printHelp() {
  console.log(`检查受保护的指令文件是否新增了中文内容。

用法：
  node scripts/check-translation-boundaries.mjs [--base <rev>]

选项：
  --base <rev>  与指定 Git 版本比较（默认：HEAD）
  -h, --help    显示帮助

也可以用 TRANSLATION_BASE 环境变量指定比较基线。命令行参数优先。`);
}

function parseArguments(argv) {
  let base;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--help' || argument === '-h') {
      printHelp();
      process.exit(0);
    }

    if (argument === '--base') {
      base = argv[index + 1];
      if (!base) {
        throw new Error('--base 需要一个 Git 版本参数。');
      }
      index += 1;
      continue;
    }

    if (argument.startsWith('--base=')) {
      base = argument.slice('--base='.length);
      if (!base) {
        throw new Error('--base 需要一个 Git 版本参数。');
      }
      continue;
    }

    throw new Error(`未知参数：${argument}`);
  }

  return { base: base ?? process.env.TRANSLATION_BASE ?? 'HEAD' };
}

function runGit(arguments_, options = {}) {
  const result = spawnSync('git', arguments_, {
    cwd: ROOT,
    encoding: options.encoding ?? 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });

  if (result.error) {
    throw new Error(`无法运行 Git：${result.error.message}`);
  }

  if (result.status !== 0) {
    const detail = Buffer.isBuffer(result.stderr)
      ? result.stderr.toString('utf8').trim()
      : result.stderr.trim();
    throw new Error(detail || `Git 命令失败（退出码 ${result.status}）。`);
  }

  return result.stdout;
}

function resolveBase(revision) {
  if (!revision.trim()) {
    throw new Error('比较基线不能为空。');
  }

  const resolved = runGit([
    'rev-parse',
    '--verify',
    '--end-of-options',
    `${revision}^{commit}`,
  ]).trim();

  if (!/^[0-9a-f]{40,64}$/i.test(resolved)) {
    throw new Error(`无法解析比较基线：${revision}`);
  }

  return resolved;
}

function isReadme(filePath) {
  return path.posix.basename(filePath) === 'README.md';
}

function isProtected(filePath) {
  const normalized = filePath.replaceAll('\\', '/').replace(/^\.\//, '');

  if (ROOT_PROTECTED_FILES.has(normalized)) return true;
  if (normalized.startsWith('skills/')) return true;
  if (normalized.startsWith('templates/')) return true;
  if (normalized.startsWith('starters/')) return !isReadme(normalized);
  if (normalized.startsWith('examples/')) return !isReadme(normalized);
  return false;
}

function listChangedProtectedFiles(base) {
  const output = runGit(
    ['diff', '--name-only', '-z', '--diff-filter=ACMR', base, '--'],
    { encoding: null },
  );

  return output
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .filter(isProtected);
}

function listUntrackedProtectedFiles() {
  const output = runGit(
    ['ls-files', '--others', '--exclude-standard', '-z', '--'],
    { encoding: null },
  );

  return output
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .filter(isProtected);
}

function addedHanLines(base, filePath) {
  const diff = runGit([
    'diff',
    '--unified=0',
    '--no-color',
    '--no-ext-diff',
    '--diff-filter=ACMR',
    base,
    '--',
    filePath,
  ]);
  const violations = [];
  let newLineNumber = null;

  for (const line of diff.split('\n')) {
    const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      newLineNumber = Number.parseInt(hunk[1], 10);
      continue;
    }

    if (newLineNumber === null) continue;

    if (line.startsWith('+')) {
      const content = line.slice(1);
      if (HAN_CHARACTER.test(content)) {
        violations.push({ filePath, lineNumber: newLineNumber, content });
      }
      newLineNumber += 1;
    } else if (line.startsWith(' ')) {
      newLineNumber += 1;
    } else if (!line.startsWith('-') && !line.startsWith('\\')) {
      newLineNumber = null;
    }
  }

  return violations;
}

function hanLinesInUntrackedFile(filePath) {
  const content = readFileSync(path.join(ROOT, filePath), 'utf8');
  const violations = [];

  for (const [index, line] of content.split('\n').entries()) {
    const lineWithoutCarriageReturn = line.endsWith('\r') ? line.slice(0, -1) : line;
    if (HAN_CHARACTER.test(lineWithoutCarriageReturn)) {
      violations.push({
        filePath,
        lineNumber: index + 1,
        content: lineWithoutCarriageReturn,
      });
    }
  }

  return violations;
}

function main() {
  const { base: requestedBase } = parseArguments(process.argv.slice(2));
  const base = resolveBase(requestedBase);
  const changedFiles = new Set(listChangedProtectedFiles(base));
  const untrackedFiles = new Set(listUntrackedProtectedFiles());
  const violations = [...changedFiles].flatMap((filePath) =>
    addedHanLines(base, filePath),
  );

  for (const filePath of untrackedFiles) {
    if (!changedFiles.has(filePath)) {
      violations.push(...hanLinesInUntrackedFile(filePath));
    }
  }

  if (violations.length > 0) {
    console.error(`翻译边界检查失败：受保护文件中发现 ${violations.length} 行新增中文：`);
    for (const violation of violations) {
      console.error(
        `- ${violation.filePath}:${violation.lineNumber}: ${violation.content}`,
      );
    }
    process.exitCode = 1;
    return;
  }

  console.log('翻译边界检查通过：受保护指令文件未发现新增中文。');
}

try {
  main();
} catch (error) {
  console.error(`翻译边界检查出错：${error.message}`);
  process.exitCode = 2;
}
