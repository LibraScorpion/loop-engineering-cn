# 发布操作手册——npm 包

本仓库从 `tools/` 发布八个公开 npm 包：

| 包 | 目录 | 发布标签 |
|---------|-----------|-------------|
| `@cobusgreyling/loop-audit` | `tools/loop-audit` | `loop-audit-v*` |
| `@cobusgreyling/loop-init` | `tools/loop-init` | `loop-init-v*` |
| `@cobusgreyling/loop-cost` | `tools/loop-cost` | `loop-cost-v*` |
| `@cobusgreyling/loop-sync` | `tools/loop-sync` | `loop-sync-v*` |
| `@cobusgreyling/loop-context` | `tools/loop-context` | `loop-context-v*` |
| `@cobusgreyling/loop-mcp-server` | `tools/mcp-server` | `loop-mcp-server-v*` |
| `@cobusgreyling/loop-worktree` | `tools/loop-worktree` | `loop-worktree-v*` |
| `@cobusgreyling/goal-audit` | `tools/goal-audit` | `goal-audit-v*` |

## 一次性设置（可信发布——推荐）

将 npm 关联到 GitHub，然后在 [npmjs.com](https://www.npmjs.com/) 上为**每个包**依次进入该包的 **Settings** → **Trusted Publisher** → **GitHub Actions**：

| 包 | 仓库 | 工作流文件名 |
|---------|--------------|-------------------|
| `@cobusgreyling/loop-audit` | `cobusgreyling/loop-engineering` | `release-loop-audit.yml` |
| `@cobusgreyling/loop-init` | `cobusgreyling/loop-engineering` | `release-loop-init.yml` |
| `@cobusgreyling/loop-cost` | `cobusgreyling/loop-engineering` | `release-loop-cost.yml` |
| `@cobusgreyling/loop-sync` | `cobusgreyling/loop-engineering` | `release-loop-sync.yml` |
| `@cobusgreyling/loop-context` | `cobusgreyling/loop-engineering` | `release-loop-context.yml` |
| `@cobusgreyling/loop-mcp-server` | `cobusgreyling/loop-engineering` | `release-loop-mcp-server.yml` |
| `@cobusgreyling/loop-worktree` | `cobusgreyling/loop-engineering` | `release-loop-worktree.yml` |
| `@cobusgreyling/goal-audit` | `cobusgreyling/loop-engineering` | `release-goal-audit.yml` |

名称必须**完全匹配**（区分大小写）。配置可信发布后，无需 `NPM_TOKEN` secret。

**身份验证：**发布工作流使用仓库 secret `NPM_TOKEN`（Automation token）。如果发布因 `E401`/`E404` 失败，请前往 [npmjs.com](https://www.npmjs.com/) → Access Tokens 刷新该 token。

**无需重新添加标签即可重试：**Actions → Release workflow → **Run workflow** → 输入标签（例如 `loop-audit-v1.6.0`）。

**可信发布（可选）：**在 npm 上逐包配置；除非移除 `NPM_TOKEN` 并验证可信发布者，否则仅使用 OIDC 并不足够。

## 递增版本号

编辑 `version`（位于该包的 `package.json` 中）；如果该包有 `CHANGELOG.md`，同时更新它；然后通过 PR 提交到 `main`。

## 发布

推送标签会触发发布工作流：

```bash
# loop-audit（发布前运行测试）
git tag loop-audit-v1.6.0
git push origin loop-audit-v1.6.0

# loop-init（打包 starters/templates，运行冒烟测试）
git tag loop-init-v1.3.3
git push origin loop-init-v1.3.3

# loop-cost（打包 patterns/registry.yaml）
git tag loop-cost-v1.0.3
git push origin loop-cost-v1.0.3

# loop-sync（检测 STATE.md 与 LOOP.md 之间的偏移）
git tag loop-sync-v1.0.0
git push origin loop-sync-v1.0.0

# loop-context（有状态记忆管理器 + 熔断器）
git tag loop-context-v1.0.0
git push origin loop-context-v1.0.0

# loop-mcp-server（在 MCP 运行时查找模式、技能和状态）
git tag loop-mcp-server-v1.0.0
git push origin loop-mcp-server-v1.0.0

# loop-worktree（为每次修复尝试创建隔离的 Git 工作树）
git tag loop-worktree-v1.0.0
git push origin loop-worktree-v1.0.0

# goal-audit（Goal Engineering 就绪度评分工具——配套仓库）
git tag goal-audit-v1.0.2
git push origin goal-audit-v1.0.2
```

工作流：`.github/workflows/release-loop-audit.yml`、`.github/workflows/release-loop-init.yml`、`.github/workflows/release-loop-cost.yml`、`.github/workflows/release-loop-sync.yml`、`.github/workflows/release-loop-context.yml`、`.github/workflows/release-loop-mcp-server.yml`、`.github/workflows/release-loop-worktree.yml`、`.github/workflows/release-goal-audit.yml`。

## 发布后验证

```bash
npx @cobusgreyling/loop-audit --help
npx @cobusgreyling/loop-init --help
npx @cobusgreyling/loop-cost --help
npx @cobusgreyling/loop-sync --help
npx @cobusgreyling/loop-context --help
npx @cobusgreyling/loop-mcp-server --help
npx @cobusgreyling/loop-worktree --help
npx @cobusgreyling/goal-audit --help

mkdir /tmp/loop-init-test && cd /tmp/loop-init-test
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok --dry-run
```

## 变更日志与发布说明（根目录没有 `CHANGELOG.md`）

本仓库**不**维护根目录 `CHANGELOG.md`。请使用：

| 载体 | 用途 |
|---------|---------|
| `RELEASE_NOTES_DRAFT.md` | 下一次社区更新的工作草稿（changelog-drafter + 人工编辑） |
| [GitHub Discussions → 公告](https://github.com/cobusgreyling/loop-engineering/discussions/categories/announcements) | 已发布的发布说明（例如 [#89](https://github.com/cobusgreyling/loop-engineering/discussions/89)、[#219](https://github.com/cobusgreyling/loop-engineering/discussions/219)） |
| `tools/*/CHANGELOG.md` | 工具版本递增时记录各包的历史 |

发布后：将 `RELEASE_NOTES_DRAFT.md` 精简为一小段“自上次讨论以来”的占位内容，供下一次草稿生成器运行使用。

## npm 上线前（本地／monorepo）

```bash
cd tools/loop-audit && npm ci && npm test && node dist/cli.js ../.. --suggest
cd tools/loop-init && npm ci && npm test && node dist/cli.js /tmp/target --pattern daily-triage --dry-run
```
