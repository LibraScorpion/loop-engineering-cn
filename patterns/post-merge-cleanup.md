<a id="post-merge-cleanup-loop"></a>

# Post-Merge Cleanup Loop（合并后清理循环）

**Goal（目标）**：在内容合并至 main 后，扫描需要跟进的工作——弃用项、TODO、技术债工单、陈旧的 feature flag 和文档缺口——但不因此阻塞合并本身。

<a id="scheduling"></a>

## Scheduling（运行调度）

**Recommended（建议）**：
- `/loop 1d` 或 `/loop 6h`（紧迫性低于 CI sweeper）
- 通过 GitHub webhook → Action，在合并事件发生时触发（事件驱动）
- 较小的团队可使用每周 cron

在工作时间以外或夜间运行，以免与活跃的开发循环争用资源。

<a id="required-skills"></a>

## Required Skills（必需技能）

- `post-merge-scan` — 读取最近的合并、diff 摘要和关联工单；识别清理机会
- `minimal-fix` — 小型跟进工作（移除无效代码、更新弃用通知、修复文档中的失效链接）
- Project conventions skill（项目约定技能）— 明确你的仓库中“清理”的含义

<a id="state"></a>

## State（状态）

`post-merge-state.md`：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
# Post-Merge Cleanup

Last run: 2026-06-09 22:00 UTC

## Pending Cleanup (from recent merges)
- [ ] PR #1245 merged — remove `legacyAuth` flag (marked TODO in merge)
  Source: commit abc1234, line 42 in auth/handler.ts
  Risk: low | Effort: small
- [ ] PR #1240 merged — update API docs for new endpoint
  Risk: low | Effort: small

## Completed (last 14d)
- PR #1230 — removed unused import cluster (PR #1248)

## Deferred (human decision)
- PR #1238 — large refactor deferred; ticket ENG-1001 created
```

<a id="how-the-loop-runs-typical-cycle"></a>

## How the Loop Runs (Typical Cycle)（循环如何运行：典型周期）

1. 列出自上次运行（或 last N days，即最近 N 天）以来合并至 main 的内容。
2. 针对每次合并：扫描 diff，查找 TODO、弃用项、`// remove after`、feature flag 和失效的文档链接。
3. 交叉检查关联的 Linear/GitHub issue，查找明确的跟进项。
4. 确定优先级：小型 + 低风险 → 在 Git 工作树中提议修复；大型 → 创建工单 + 提醒人工。
5. 验证者确认清理工作不会改变行为（有意移除的内容除外）。
6. 创建小型 PR，或每天将改动合并到一个“cleanup”PR 中。
7. 更新状态；清除已完成的项目。

<a id="verification-strategy"></a>

## Verification Strategy（验证策略）

- 除非明确要移除无效代码路径，否则清理工作不得改变行为。
- 验证者（verifier）运行完整测试套件——一旦出现回归，立即交接给人工。
- 清理 PR 涉及 >10 个文件时，未经人工批准不得自动合并。

<a id="human-handoff-points"></a>

## Human Handoff Points（人工交接点）

- 需要设计讨论的架构债务
- 会影响生产环境配置的 feature flag 移除
- 涉及外部 API 消费者的弃用项
- 循环已尝试两次、但仍未通过测试的任何清理工作

<a id="tool-specific-notes"></a>

## Tool-Specific Notes（特定工具说明）

**Grok Build TUI**：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
/loop 1d Scan merges to main in the last 24h. Identify cleanup items. For small low-risk items: worktree + minimal fix + verifier. Update post-merge-state.md. Create tickets for larger items.
```

**Claude Code**：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
/loop 6h /post-merge-sweeper
```

（Boris Cherny 曾在社区中介绍过类似流程。）

**Codex**：
- 自动化：按每日运行节奏执行 "Post-merge sweeper"，结果发送至 Triage inbox。

**GitHub Actions**：
- 请参阅 `examples/github-actions/post-merge-cleanup.yml`——在内容推送至 main 时触发。

<a id="failure-modes--mitigations"></a>

## Failure Modes & Mitigations（失效模式与缓解措施）

| Failure（失效） | Mitigation（缓解措施） |
|---------|------------|
| 过度激进的删除 | 验证者 + “不改变行为”规则；大型 diff 设置人工审核关卡 |
| 遗漏合并 | 使用 GitHub API 的合并列表，而不只依赖本地 git log |
| 每个 TODO 都产生噪声 | 仅处理具有合并上下文或关联工单的 TODO |
| 与功能开发争用资源 | 在非高峰时段运行；限制每天自动创建的 PR 数量（例如 2） |

<a id="cost-profile"></a>

## Cost Profile（成本概况）

| Scenario（情景） | Tokens/run | Notes（说明） |
|----------|------------|-------|
| 无操作 | ~5k | 没有需要扫描的近期合并 |
| 扫描 + 确定优先级 | ~40k | 合并列表 + TODO 扫描 |
| 小型修复（L2） | ~150k | Git 工作树 + 验证者 |

**Cadence（运行节奏）**：1d–6h · **Tier（层级）**：low · **Suggested daily cap（建议的每日上限）**：200k tokens

```bash
npx @cobusgreyling/loop-cost --pattern post-merge-cleanup --cadence 1d --level L1
```

在非高峰时段运行。在 `loop-budget.md` 中限制每天自动创建的 PR 数量。

<a id="success-metrics"></a>

## Success Metrics（成功指标）

- “合并后忘记移除 X”事件的减少程度
- 待处理的合并后清理项目的存在时长
- 未收到审查意见便合并的清理 PR 百分比

与 CI sweeper 相比风险更低——适合在每日问题分诊稳定后作为第二个循环。
