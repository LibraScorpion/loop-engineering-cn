# 启动模板（Starters）

克隆即可运行的脚手架。将其复制到你的项目中，或者使用 `loop-init`：

```bash
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok
npx @cobusgreyling/loop-init . -p pr-babysitter -t claude
```

<a id="daily-triage-l1-report-only"></a>

## 日常问题分诊（Daily Triage，L1 仅报告）

| 启动模板 | 工具 | 路径 |
|---------|------|------|
| [minimal-loop](./minimal-loop/) | Grok | `.grok/skills/` |
| [minimal-loop-claude](./minimal-loop-claude/) | Claude Code | `.claude/skills/` + `.claude/agents/` |
| [minimal-loop-codex](./minimal-loop-codex/) | Codex | `.codex/skills/` + `.codex/agents/` |
| [minimal-loop-opencode](./minimal-loop-opencode/) | Opencode | `skills/` + `AGENTS.md` |

<a id="l2-assisted-patterns"></a>

## L2 辅助修复模式

| 启动模板 | 模式 | 工具 | 就绪度 |
|---------|---------|-------|-----------|
| [pr-babysitter](./pr-babysitter/) | PR Babysitter | Grok, Claude, Codex | L2 辅助修复 |
| [pr-babysitter-opencode](./pr-babysitter-opencode/) | PR Babysitter | Opencode | L1 → L2 |
| [ci-sweeper](./ci-sweeper/) | CI Sweeper | Grok, Claude, Codex | L2 辅助修复 |
| [ci-sweeper-opencode](./ci-sweeper-opencode/) | CI Sweeper | Opencode | L2 谨慎模式 |
| [dependency-sweeper](./dependency-sweeper/) | Dependency Sweeper | Grok, Claude, Codex | L2 仅补丁 |
| [dependency-sweeper-opencode](./dependency-sweeper-opencode/) | Dependency Sweeper | Opencode | L2 仅补丁 |
| [post-merge-cleanup](./post-merge-cleanup/) | Post-Merge Cleanup | Grok, Claude, Codex | L1 → L2 |
| [post-merge-cleanup-opencode](./post-merge-cleanup-opencode/) | Post-Merge Cleanup | Opencode | L1 → L2 |
| [changelog-drafter](./changelog-drafter/) | Changelog Drafter | Grok, Claude, Codex | L1 草拟 → L2 |
| [changelog-drafter-opencode](./changelog-drafter-opencode/) | Changelog Drafter | Opencode | L1 草拟 → L2 |
| [issue-triage](./issue-triage/) | Issue Triage | Grok, Claude, Codex | L1 仅提议 |
| [issue-triage-opencode](./issue-triage-opencode/) | Issue Triage | Opencode | L1 仅提议 |

复制完成后：

```bash
npx @cobusgreyling/loop-audit .
npx @cobusgreyling/loop-audit . --suggest
```
