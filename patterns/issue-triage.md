<a id="issue-triage-loop"></a>

# Issue Triage Loop（Issue 问题分诊循环）

**目标**：持续发现传入的 issue、功能请求和 discussion，进行去重、排定优先级并添加 label，让团队（以及其他循环）始终拥有整洁、可执行的队首任务。第一周采用纯报告／建议模式。风险极低、收益很高。

## Scheduling（运行安排）

**建议**：

- `/loop 2h` 或 `1d`（对于繁忙的仓库，在早晨和每天结束时各运行一次）
- 在 `issues` / `discussion` 事件触发 GitHub Action，并以定时运行作为后备
- 与 Daily Triage 配合效果很好（此循环为“我应该处理什么”报告提供输入）

这是一个非常适合始终运行、成本低廉的配套循环。

## Required Skills（必需技能）

- `issue-triage` — 扫描开放的 issue、discussion，以及（可选通过 MCP 扫描）Linear / Jira。执行去重，提取信号（label、评论、关联的 PR、存在时间、reaction），并提出 priority、建议 label 和单句摘要。
- `loop-verifier`（轻量或人工）— 在实际应用任何操作之前，对建议的问题分诊操作和新增 label 进行合理性检查；作为 maker/checker 中的 checker。

## State（状态）

文件名：`issue-triage-state.md`

当前 backlog 健康状况的紧凑滚动视图：

> 中文说明：以下为机器读取的原始英文 state 模板，为避免语义漂移保持不变

```markdown
# Issue Triage State
Last run: 2026-06-09 09:15 UTC
Open actionable: 14 (was 17)
New since last run: 3
Needs human: 2 (one potential duplicate of #412, one unclear spec)

## Top 5 (by loop score)
- #487 (bug, p1, 2d old) — "Crash on export with large files" — suggested: bug + needs-repro + area:export
- ...
```

循环会移除已关闭／已合并的项目，只保留“needs attention”的项目。

## How the Loop Runs（典型运行周期）

1. 发现自上次运行以来新增／更新的 issue 和 discussion（首次运行则检查所有开放项目）。
2. 对每个项目：概述其意图，检测 duplicate（通过标题与 embedding 提示，或简单文本匹配），并收集信号（存在时间、作者、关联的 PR、reaction、现有 label）。
3. 评分／分类：P0（security、prod breakage）、P1（high impact + clear）、P2、P3、needs-info、duplicate。
4. 在 state 文件中写入或更新整洁的优先级列表、建议 label 集合和简短的“why this matters”（也可以选择在 issue 本身添加一条名为“Loop triage note”的评论）。
5. verifier（或人工）只审核“needs human”分类，以及敏感领域中任何建议的 label 变更。
6. 记录本次运行，移除已解决项目并更新计数。

## Verification Strategy（验证策略）

- 在 L1 中，循环**绝不自动添加 label 或关闭 issue**。
- 在 L2 中，只有通过 verifier 检查后，才能应用 allowlisted label（例如 `area:*`、`needs-repro`）。
- 在最初几周，以及涉及 auth、payments、security 或 public API 的任何情况，P0/P1 分配始终由人工负责。

## Human Handoff Points（人工交接点）

- 任何涉及 security、auth、billing 或 infra 的 issue
- 结果不确定的 duplicate 检测（错误概率 >30%）
- 循环希望以“stale”为由关闭、存在时间超过 N 天的 issue（由人工确认）
- 单次运行中出现超过 X 个新 issue 时（上下文过载信号）

## Tool-Specific Notes（工具特定说明）

**Grok Build TUI**：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```
/loop 2h Run issue-triage skill. Read issue-triage-state.md first. Produce updated state + suggested labels for new items only. No auto-label or close. Escalate anything ambiguous.
```

**Claude Code**：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```
/loop 2h $issue-triage — update issue-triage-state.md. Propose labels only on allowlisted areas. Human review for P0/P1.
```

**Codex**：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

Automation every 2h or on `issues` event: run issue-triage → update state. Report mode.

**GitHub Actions**：

请参阅 `examples/github-actions/`，其中提供了可响应 issue 事件并定时运行的初始工作流。

## Failure Modes & Mitigations（失效模式与缓解措施）

| 失效模式 | 缓解措施 |
|--------------------------|----------|
| 对高噪声报告者给予过高优先级 | 根据团队真正关心的信号（reaction、关联的 PR、内部 +1）赋予权重。人工覆盖决定会记录在 state 中。 |
| duplicate 误报 | 使用保守匹配；在 L1 中始终显示“possible duplicate of #NNN”，交由人工确认。 |
| 每个新 issue 都触发提醒而导致提醒疲劳 | 只向人工通知“needs human”部分。其余内容都保留在 state 文件中，供 Daily Triage 或工程师阅读。 |

## Success Metrics（成功指标）

- 缩短从 issue 开放到首次获得有意义的 label 或“needs info”评论所需的时间。
- 在 24h 内具有明确 priority 的 issue 百分比。
- 工程师报告的“我始终知道最优先的 5 件事是什么”评分（定性指标，来自 state 文件审核）。
- 在两个人开始处理同一个问题之前发现的 duplicate 数量。

另请参阅：[Daily Triage](./daily-triage.md)（此循环为其提供输入）、[Multi-Loop Coordination](../docs/multi-loop.md) 和 [Loop Design Checklist](../docs/loop-design-checklist.md)。
