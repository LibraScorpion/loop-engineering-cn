<a id="pr-babysitter-loop"></a>

# PR Babysitter Loop（PR 看护循环）

**Goal（目标）**：减少人工推动 PR 完成审查、CI、rebase 和合并所需的时间，同时让人工始终掌握判断权。

<a id="scheduling"></a>

## Scheduling（运行调度）

**Recommended（建议）**：
- `/loop 5m /pr-babysit check`（Grok TUI）
- 在其他环境中使用等效的计划任务或 GitHub Action（通常在工作时间内每 5–15 分钟运行一次）。

许多团队会在活跃审查期间运行频率较高的“监视器”循环（2–5m），并在夜间运行频率较低的清扫循环。

<a id="required-skills"></a>

## Required Skills（必需技能）

- `pr-review-triage` — 理解项目的审查规范、必需检查，以及“可以合并”的含义。
- `minimal-fix` — 针对特定审查意见或 CI 失败生成尽可能小的改动。
- `rebase-and-clean` — 适用于仓库的安全 rebase 与冲突解决模式。

<a id="state"></a>

## State（状态）

维护一个简洁的 `pr-babysitter-state.md`（或 Linear 看板／GitHub project 视图），其中包含：

- 受监视的 PR 及其当前状态
- 上次执行的操作及其结果
- 推翻循环建议的人工决定

状态条目示例：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
- #1234 (feat/auth-refresh)
  Status: Changes requested by @reviewer
  Last action: Loop proposed minimal diff for comment X
  Human decision: Approved the diff, asked for one more test
```

<a id="how-the-loop-runs-typical-cycle"></a>

## How the Loop Runs (Typical Cycle)（循环如何运行：典型周期）

1. 查找由团队创建的开放 PR（或用户关心的所有 PR）。
2. 针对每个 PR：
   - 运行 `triage` 技能。
   - 如果 CI 失败 → 启动一个使用 `minimal-fix` 技能的子智能体来处理失败。
   - 如果存在可执行的审查意见 → 提议最小补丁。
   - 如果已就绪（所有检查均通过、已获得批准且没有阻塞性意见）→ 添加 `ready to merge` 标签或通知人工。
3. 对闲置时间过长的 PR → 建议关闭或交接。
4. 将简洁的更新写回 PR 和状态记录。
5. 遇到任何含糊或高风险事项 → 连同上下文提交给人工处理。

<a id="verification-strategy"></a>

## Verification Strategy（验证策略）

- 绝不允许实施改动的子智能体将自己的工作标记为“完成”。
- 使用独立的验证者子智能体（maker/checker，执行者／检查者），或在投入更多推理资源时使用能力更强的模型；它必须明确确认：
  - 改动解决了相应的审查意见或失败。
  - 未修改任何无关文件。
  - 测试／lint 在 Git 工作树中仍然通过。
- 循环只提出建议；实际合并由人工执行（对于非常安全的情况，也可使用明确的 `auto-merge` 允许列表）。

<a id="human-handoff-points"></a>

## Human Handoff Points（人工交接点）

- 高风险重构
- 涉及安全、支付、身份验证或核心基础设施的改动
- 循环针对同一个 PR 提议超过 N 次修复但仍无进展时
- 状态文件显示同一个 PR 连续数日反复出现时

<a id="tool-specific-notes"></a>

## Tool-Specific Notes（特定工具说明）

**Grok Build TUI**：
- `pr-babysit` 技能（若已安装）正是为此场景设计的。
- 使用 `/loop 5m /pr-babysit check` 运行。
- 任何修复尝试都应使用 Git 工作树隔离。
- 当监视列表为空时，该技能可以对自身调用 `scheduler_delete`。

**Claude Code**：
- Boris Cherny 曾公开介绍过运行非常相似的 `/loop 5m /babysit` 流程。
- 与 `/goal` 结合使用；原始提示词如下。

  > 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变
  >
  > keep working on this PR until CI is green and no blocking comments remain

**General（通用说明）**：
- 将状态文件放在仓库或共享文档中，让整个团队都能看到循环正在执行的操作。
- 清晰标记循环在 PR 中发布的评论（例如 `🤖 Loop Engineering — PR Babysitter`）。

<a id="failure-modes--mitigations"></a>

## Failure Modes & Mitigations（失效模式与缓解措施）

- **循环提出不当修复** → 使用能力强的验证者子智能体（maker/checker）进行验证，并为任何非简单改动设置人工审查关卡。
- **无限 rebase 循环** → 限制每个 PR 的自动 rebase 尝试次数。
- **状态陈旧** → 循环每次运行时都应移除已关闭／已合并的 PR。
- **通知疲劳** → 选择性发送通知（仅在确实需要人工操作时通知）。

<a id="cost-profile"></a>

## Cost Profile（成本概况）

| Scenario（情景） | Tokens/run | Notes（说明） |
|----------|------------|-------|
| 无操作（监视列表为空） | ~3k | **大多数运行的目标状态** — 提前退出 |
| 问题分诊检查 | ~80k | 扫描 PR 与 CI 状态 |
| 修复尝试（L2） | ~250k | Git 工作树 + `minimal-fix` + 验证者 |

**Cadence（运行节奏）**：5m–15m · **Tier（层级）**：high · **Suggested daily cap（建议的每日上限）**：2M tokens · **Early exit required（必须提前退出）**

```bash
npx @cobusgreyling/loop-cost --pattern pr-babysitter --cadence 10m --level L1 --conservative
```

频繁运行却不提前退出会快速消耗 token。请使用 `loop-budget` 技能和 `loop-run-log.md`。

<a id="success-metrics"></a>

## Success Metrics（成功指标）

- 从“可以审查”到合并的平均时间（针对循环处理过的 PR）。
- 内容仅为 `LGTM, loop handled the rest` 的人工评论数量。
- Slack／Linear 中 `can you rebase?` 或 `CI is red` 提醒数量的减少程度。

先从一个团队或一个仓库开始。衡量一周的效果，然后再扩大范围。
