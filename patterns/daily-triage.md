<a id="daily-triage-loop"></a>
# 每日问题分诊循环

**目标**：每天（或每个活跃时段）开始时，获得一份按优先级排列且可执行的待关注事项概览，而无需手动检查 CI、issue、PR 和聊天消息。

<a id="scheduling"></a>
## Scheduling（调度）

**建议**：
- 使用 `/loop 1d` 进行晨间问题分诊（Grok、Claude Code）
- 在活跃的冲刺期间使用 `/loop 2h`，更快获取信号
- 对于没有 TUI 的团队，使用 GitHub Action cron `0 8 * * 1-5`

许多团队会先运行 1–2 周的纯问题分诊（只报告，不自动修复），然后再启用操作。

<a id="required-skills"></a>
## Required Skills（所需技能）

- `loop-triage` — 读取 CI、issue、提交和聊天消息；生成按优先级排列的发现（参见 `templates/SKILL.md.loop-triage`）
- `minimal-fix`（可选，阶段 2）— 为明显故障起草小型修复
- 审查子智能体或技能（可选，阶段 2）— 验证建议的修复

<a id="state"></a>
## 状态

使用 `STATE.md`（或 Linear 看板视图）作为记忆主干：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
# Loop State — Project X

Last run: 2026-06-09 08:15 UTC

## High Priority (loop is acting or waiting on human)
- [ ] #1241 — flaky test in auth flow (CI red on main)
  Loop action: Opened worktree. Fix proposed. Waiting for human PR review.

## Watch List
- PR #1238 open 4 days with no activity.

## Recent Noise (ignored this run)
- Dependabot PRs (separate automation)
```

循环每次运行时都必须更新以下字段：
- `Last run` 时间戳
- `Item status + last action taken`（条目状态及上次采取的操作）
- `Human decisions that overrode the loop`（推翻循环处理结果的人工决策）

<a id="how-the-loop-runs-typical-cycle"></a>
## 循环如何运行（典型周期）

1. 调度器在早晨或预设间隔触发。
2. 问题分诊技能读取最近 `24h` 的 CI 故障、未关闭的 issue／工单、近期提交和此前的 `STATE.md`。
3. 将高优先级事项及建议的下一步操作追加到状态中。
4. （阶段 2）对于小型、可独立处理的故障：创建 Git 工作树 → 执行者 → 验证者。
5. （阶段 3）连接器更新 PR／工单；存在歧义的事项标记为需要人工处理。
6. 从状态中移除已解决或已合并的事项。
7. 在状态中记录运行后复盘：误报、重复事项、重新调整优先级或放弃的事项，以及针对下次运行的一项调整。

<a id="post-run-critique"></a>
## 运行后复盘

每次每日问题分诊运行后，记录：

- 高噪声事项。
- 误报（被错误标记的事项）。
- 应降低优先级的事项。
- 任何人工审查阻碍。
- 一项用于改进下个周期的变更。

<a id="verification-strategy"></a>
## 验证策略

- 阶段 1（仅报告，`report-only`）：由人工阅读 `STATE.md`，无需验证自动操作。
- 阶段 2+：绝不允许执行者自行将工作标记为完成；由验证者确认修复范围和测试结果。
- 问题分诊技能不得凭空创建架构工作，只负责提供信号。

<a id="human-handoff-points"></a>
## 人工交接点

- 设计决策或多文件重构
- 安全、身份认证、支付、基础设施
- 在问题分诊输出中标记为 `needs discussion` 的事项
- 循环已连续发现 3+ 天但仍未解决的任何事项

<a id="tool-specific-notes"></a>
## 工具特定说明

**Grok Build TUI**:

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
/loop 1d Run the loop-triage skill. Append high-priority items to STATE.md. For obvious small bugfixes only: worktree + minimal-fix + verifier sub-agent (maker/checker). Flag ambiguous items for human review.
```

**Claude Code**:

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
/loop 1d Run $loop-triage and update STATE.md. Do not auto-fix on first week — report only.
```

**Codex**:
- Automations 标签页：每日运行调用 `$loop-triage` 的提示词，并将结果输出到 Triage inbox 和 `STATE.md`。

**GitHub Actions**:
- 参见 `examples/github-actions/daily-triage.yml`。

<a id="failure-modes--mitigations"></a>
## 失效模式与缓解措施

| 故障 | 缓解措施 |
|---------|------------|
| 问题分诊产生噪声 | 收紧技能规则；添加 `Noise / Ignore` 章节 |
| 状态文件无限增长 | 每次运行时移除已合并或已关闭的事项 |
| 自动修复了优先级错误的事项 | 从仅报告（`report-only`）开始；添加明确的投入／风险关卡 |
| 遗漏夜间故障 | 添加 `fireImmediately: true`，或在每天开始时和中午分别运行一次 |
| 复盘内容过时／从未审查 | 如果复盘条目累积 N 次运行仍未解决，则转交人工处理。 |

<a id="cost-profile"></a>
## 成本概况

| 场景 | 每次运行 token 数 | 说明 |
|----------|------------|-------|
| 无操作 | ~5k | 状态中没有可执行事项 |
| 完整问题分诊（L1） | ~50k | 扫描 CI、issue 和提交 |
| 辅助修复（L2） | ~200k | Git 工作树 + 执行者 + 验证者 |

**运行节奏**：1d–2h · **层级**：low · **建议每日上限**：100k tokens

> 中文说明：以下命令保持原样，以确保可以直接执行

```bash
npx @cobusgreyling/loop-cost --pattern daily-triage --cadence 1d --level L1
```

使用 `loop-init` 生成 `loop-budget.md` 和 `loop-run-log.md` 的脚手架。参见 [operating-loops.md](../docs/operating-loops.md)。

<a id="success-metrics"></a>
## 成功指标

- 从“出现故障”到“人工知晓”的时间
- `STATE.md` 与人工检查结果一致的早晨占比
- 临时发送的“哪里出问题了？”Slack 消息减少量

从仅报告（`report-only`）开始。只有在问题分诊质量持续良好时，才添加操作。
