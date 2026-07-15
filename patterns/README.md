<a id="loop-patterns"></a>
# 循环模式

已在（或可在）真实环境中运行、记录完备且可复用的循环模式。

每种模式都会回答以下问题：

- 它解决什么问题
- 推荐的运行节奏
- 所需的技能／状态结构
- 验证方法
- 人工移交策略
- 特定工具的说明（Grok、Claude Code、Codex、OpenClaw、Opencode、GitHub Actions）

<a id="pattern-registry"></a>
## 模式注册表

| 模式 | 运行节奏 | 风险 | 文件 |
|---------|---------|------|------|
| PR 守护 | 5–15m | 中 | [pr-babysitter.md](./pr-babysitter.md) |
| 每日问题分诊 | 1d–2h | 低 | [daily-triage.md](./daily-triage.md) |
| Issue 问题分诊（新增） | 2h–1d | 低 | [issue-triage.md](./issue-triage.md) |
| CI 清扫 | 5–15m | 中 | [ci-sweeper.md](./ci-sweeper.md) |
| 合并后清理 | 1d–6h | 低 | [post-merge-cleanup.md](./post-merge-cleanup.md) |
| 依赖清扫 | 6h–1d | 中 | [dependency-sweeper.md](./dependency-sweeper.md) |
| 变更日志草稿生成 | 1d | 低 | [changelog-drafter.md](./changelog-drafter.md) |

机器可读索引：[registry.yaml](./registry.yaml)

<a id="how-to-use-a-pattern"></a>
## 如何使用模式

1. 选择一种模式：[模式选择器](../docs/pattern-picker.md)
2. 使用 `npx @cobusgreyling/loop-init . --pattern <name> --tool grok` 创建脚手架（也可使用 `--tool opencode` / `--tool claude`），或从 `starters/` 复制
3. 若要在初始模板基础上进一步定制，请从 `templates/` 复制技能
4. 设置调度（`/loop`、`scheduler_create`、GitHub Action、Codex Automation）
5. 启用修复前，第一周先采用 **L1 仅报告（report-only）** 模式运行
6. 使用 `npx @cobusgreyling/loop-audit . --suggest` 执行审计

<a id="adding-a-pattern"></a>
## 添加模式

使用[模式模板](../templates/pattern-template.md)，在 `registry.yaml` 中添加条目，然后发起 PR。详情参见[贡献指南](../CONTRIBUTING.md)。
