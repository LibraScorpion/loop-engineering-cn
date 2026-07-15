<a id="examples"></a>

# 示例

相同的模式，不同的工具。技能和状态 schema 可以共享，只有调度与调用方式不同。

| 工具 | 目录 |
|------|-----------|
| Grok Build TUI | [grok/](./grok/) |
| Claude Code | [claude-code/](./claude-code/) |
| Codex App | [codex/](./codex/) |
| OpenClaw | [openclaw/](./openclaw/) |
| Cursor | [cursor/](./cursor/) |
| Windsurf | [windsurf/](./windsurf/) |
| Opencode | [opencode/](./opencode/) |
| Hermes Agent | [hermes/](./hermes/) |
| Gemini CLI | [原语矩阵 § Gemini CLI](../docs/primitives-matrix.md#appendix-gemini-cli) — 通过 `gemini` + 外部调度实现基于终端的循环 |
| GitHub Actions | [github-actions/](./github-actions/) |
| Aider CLI | [原语矩阵 § Aider](../docs/primitives-matrix.md#appendix-aider-cli) — 通过 cron + `--read` 技能实现 CLI 优先的循环 |
| MCP 连接器 | [mcp/](./mcp/) — 配置示例，包括 `loop-engineering.mcp.json`；参考服务器见 [tools/mcp-server/](../tools/mcp-server/) |

请先阅读 [primitives-matrix.md](../docs/primitives-matrix.md)，了解如何映射各项能力。

<a id="pattern-coverage"></a>

## 模式覆盖情况

| 模式 | Grok | Claude | Codex | OpenClaw | Cursor | Windsurf | Opencode | Hermes | GH Actions |
|---------|------|--------|-------|----------|--------|----------|----------|--------|------------|
| 每日问题分诊 | [grok/daily-triage.md](./grok/daily-triage.md) | [claude-code/daily-triage.md](./claude-code/daily-triage.md) | [codex/daily-triage.md](./codex/daily-triage.md) | [openclaw/daily-triage.md](./openclaw/daily-triage.md) | [cursor/daily-triage.md](./cursor/daily-triage.md) | [windsurf/daily-triage.md](./windsurf/daily-triage.md) | [opencode/daily-triage.md](./opencode/daily-triage.md) | [hermes/daily-triage.md](./hermes/daily-triage.md) | [github-actions/daily-triage.yml](./github-actions/daily-triage.yml) |
| PR 看护 | [grok/pr-babysitter.md](./grok/pr-babysitter.md) | [claude-code/pr-babysitter.md](./claude-code/pr-babysitter.md) | [codex/pr-babysitter.md](./codex/pr-babysitter.md) | [openclaw/pr-babysitter.md](./openclaw/pr-babysitter.md) | [cursor/pr-babysitter.md](./cursor/pr-babysitter.md) | [windsurf/pr-babysitter.md](./windsurf/pr-babysitter.md) | [opencode/pr-babysitter.md](./opencode/pr-babysitter.md) | [hermes/pr-babysitter.md](./hermes/pr-babysitter.md) | [github-actions/pr-babysitter.yml](./github-actions/pr-babysitter.yml) |
| CI 清理 | [grok/ci-sweeper.md](./grok/ci-sweeper.md) | [claude-code/ci-sweeper.md](./claude-code/ci-sweeper.md) | [codex/ci-sweeper.md](./codex/ci-sweeper.md) | [openclaw/ci-sweeper.md](./openclaw/ci-sweeper.md) | — | — | [opencode/ci-sweeper.md](./opencode/ci-sweeper.md) | — | [github-actions/ci-sweeper.yml](./github-actions/ci-sweeper.yml) |
| 合并后清理 | [grok/post-merge-cleanup.md](./grok/post-merge-cleanup.md) | [claude-code/post-merge-cleanup.md](./claude-code/post-merge-cleanup.md) | [codex/post-merge-cleanup.md](./codex/post-merge-cleanup.md) | [openclaw/post-merge-cleanup.md](./openclaw/post-merge-cleanup.md) | [cursor/post-merge-cleanup.md](./cursor/post-merge-cleanup.md) | — | [opencode/post-merge-cleanup.md](./opencode/post-merge-cleanup.md) | — | [github-actions/post-merge-cleanup.yml](./github-actions/post-merge-cleanup.yml) |
| 依赖清理 | [grok/dependency-sweeper.md](./grok/dependency-sweeper.md) | [claude-code/dependency-sweeper.md](./claude-code/dependency-sweeper.md) | [codex/dependency-sweeper.md](./codex/dependency-sweeper.md) | [openclaw/dependency-sweeper.md](./openclaw/dependency-sweeper.md) | [cursor/dependency-sweeper.md](./cursor/dependency-sweeper.md) | — | [opencode/dependency-sweeper.md](./opencode/dependency-sweeper.md) | — | [github-actions/dependency-sweeper.yml](./github-actions/dependency-sweeper.yml) |
| 变更日志起草 | [grok/changelog-drafter.md](./grok/changelog-drafter.md) | [claude-code/changelog-drafter.md](./claude-code/changelog-drafter.md) | [codex/changelog-drafter.md](./codex/changelog-drafter.md) | [openclaw/changelog-drafter.md](./openclaw/changelog-drafter.md) | — | — | [opencode/changelog-drafter.md](./opencode/changelog-drafter.md) | — | [github-actions/changelog-drafter.yml](./github-actions/changelog-drafter.yml) |
| Issue 分诊 | [grok/issue-triage.md](./grok/issue-triage.md) | [claude-code/issue-triage.md](./claude-code/issue-triage.md) | [codex/issue-triage.md](./codex/issue-triage.md) | [openclaw/issue-triage.md](./openclaw/issue-triage.md) | — | — | [opencode/issue-triage.md](./opencode/issue-triage.md) | — | [github-actions/issue-triage.yml](./github-actions/issue-triage.yml) |

L2 模式会在一个起步模板文件夹中提供适用于多种工具的技能——参见 `starters/<pattern>/`。

**可复制粘贴的起步模板**：

| 工具 | 每日问题分诊（L1） | PR 看护 | CI 清理 | 依赖清理 | 合并后清理 | 变更日志 | Issue 分诊 |
|------|-------------------|---------------|------------|-------------------|------------|-----------|--------------|
| Grok | [minimal-loop](../starters/minimal-loop/) | [pr-babysitter](../starters/pr-babysitter/) | [ci-sweeper](../starters/ci-sweeper/) | [dependency-sweeper](../starters/dependency-sweeper/) | [post-merge-cleanup](../starters/post-merge-cleanup/) | [changelog-drafter](../starters/changelog-drafter/) | [issue-triage](../starters/issue-triage/) |
| Claude Code | [minimal-loop-claude](../starters/minimal-loop-claude/) | 通过 `loop-init --tool claude` | 通过 `loop-init --tool claude` | 通过 `loop-init --tool claude` | 通过 `loop-init --tool claude` | 通过 `loop-init --tool claude` | 通过 `loop-init --tool claude` |
| Codex | [minimal-loop-codex](../starters/minimal-loop-codex/) | 通过 `loop-init --tool codex` | 通过 `loop-init --tool codex` | 通过 `loop-init --tool codex` | 通过 `loop-init --tool codex` | 通过 `loop-init --tool codex` | 通过 `loop-init --tool codex` |
| OpenClaw | [openclaw/daily-triage.md](./openclaw/daily-triage.md)（手动） | [openclaw/pr-babysitter.md](./openclaw/pr-babysitter.md) | [openclaw/ci-sweeper.md](./openclaw/ci-sweeper.md) | [openclaw/dependency-sweeper.md](./openclaw/dependency-sweeper.md) | [openclaw/post-merge-cleanup.md](./openclaw/post-merge-cleanup.md) | [openclaw/changelog-drafter.md](./openclaw/changelog-drafter.md) | [openclaw/issue-triage.md](./openclaw/issue-triage.md) |
| Hermes | [hermes/daily-triage.md](./hermes/daily-triage.md)（手动） | [hermes/pr-babysitter.md](./hermes/pr-babysitter.md)（手动） | — | — | — | — | — |
| Opencode | [minimal-loop-opencode](../starters/minimal-loop-opencode/) | [pr-babysitter-opencode](../starters/pr-babysitter-opencode/) | [ci-sweeper-opencode](../starters/ci-sweeper-opencode/) | [dependency-sweeper-opencode](../starters/dependency-sweeper-opencode/) | [post-merge-cleanup-opencode](../starters/post-merge-cleanup-opencode/) | [changelog-drafter-opencode](../starters/changelog-drafter-opencode/) | [issue-triage-opencode](../starters/issue-triage-opencode/) |
