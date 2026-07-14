# CI 清扫循环（CI Sweeper Loop）

**目标**：快速响应 main 或活跃分支上失败的 CI——诊断问题、提出最小修复方案，并在循环无法确信可以解决时升级处理。

## Scheduling（调度）

**推荐配置**：
- 活跃开发期间每 `/loop 15m` 运行一次（Grok、Claude Code）
- main 失败且正在发布时每 `/loop 5m` 运行一次
- 在 `workflow_run` 失败时触发 GitHub Action（事件驱动，而非轮询）

无人关注时，夜间采用较慢的运行节奏（30–60m）即可。

## Required Skills（必需技能）

- `ci-triage` — 解析 CI 日志，识别失败的 job/step，并将失败类型归类为 `flake`、`regression`、`env` 或 `config`
- `minimal-fix` — 针对特定失败实施最小改动
- `loop-guard` — 熔断器：将每次尝试记录到 `loop-ledger.json`，并在重试前运行 `loop-context --check`；对同一失败升级处理，而不是持续循环
- 项目的 test/lint 技能——适用于当前技术栈的构建和测试命令

## 状态

使用 `ci-sweeper-state.md`，或使用 `STATE.md` 中的相应章节：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
## CI Sweeper — Active Failures

Last run: 2026-06-09 14:30 UTC

### main @ abc1234
- Job: test-auth
- Failure: AssertionError in test_refresh_token_expiry
- Attempts: 1/3
- Last action: Minimal fix proposed in worktree fix/ci-auth-refresh
- Status: Waiting for verifier + human

### Resolved (last 7d)
- main @ def5678 — lint fix merged via PR #1250
```

跟踪以下内容：commit SHA、失败的 job、尝试次数、worktree/PR 链接和结果。

## 循环如何运行（典型周期）

1. 发现受监控分支（main、release/*、活跃 PRs）上的 CI 失败。
2. 针对每个新失败：
   - 分类：`flake`、真实的 `regression` 或 `infra`。
   - 如果是 `flake`（以前出现过、间歇发生）：加入 Watch，不要自动修复。
   - 如果可以处理：打开 worktree → 由 implementer 起草修复方案。
3. verifier 子智能体检查：修复是否针对该失败、是否没有无关改动，以及测试能否在本地通过。
4. 打开 PR，或在现有 PR 上评论并附上建议的修复方案。
5. 每次重试前，`loop-guard` 都会运行熔断器（`loop-context --check`）。如果同一失败重复 N× 次，或尝试次数超过上限（例如 3 次），熔断器将触发：向人工升级并提供精简后的上下文摘要，不再继续循环。
6. 从活跃列表中移除已解决的失败。

## 验证策略

- verifier 必须先在 worktree 中运行测试，才能批准。
- implementer 不能合并——只能提出方案。
- `flake` 检测：如果同一测试先失败，随后在没有代码改动的情况下重试通过，则不要自动修复。

## 人工交接点

- 基础设施失败（runner OOM、registry down、secrets missing）
- 涉及 >5 个文件或核心架构的失败
- 安全敏感型测试失败
- 对同一失败的尝试次数超过上限
- 需要隔离而不是修改代码的间歇性 `flake`

## 特定工具说明

**Grok Build TUI**:

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
/loop 15m Check CI on main and open PRs. For new failures: classify, and if actionable draft minimal fix in worktree with verifier. Update ci-sweeper-state.md. Escalate after 3 attempts.
```

**Claude Code**:

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
/goal All tests on main pass and lint is clean
```
使用 `/goal` 开展聚焦于“恢复绿色状态”的会话；使用定时 sweeper 进行持续监控。

**Codex**:

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

- Automation: "Summarise CI failures every 30m" → 问题分诊收件箱；修复尝试使用单独的 automation。

**GitHub Actions**:
- 参见 `examples/github-actions/ci-sweeper.yml`——在 workflow 失败时触发。

## 失效模式与缓解措施

| 失效模式 | 缓解措施 |
|---------|------------|
| 只修复表象的循环 | verifier 检查根本原因，而不只是 CI 是否恢复绿色状态 |
| 通过重试对抗 `flake` | 对 `flake` 分类；隔离，或创建 ticket 后跳过 |
| main 失败时消耗 token | N 次失败后暂停循环；批量修复 |
| 选错目标分支 | 在技能中明确设置分支允许列表 |

## 成本概况

| 场景 | token/次 | 说明 |
|----------|------------|-------|
| 无操作（CI 绿色） | ~5k | **必需**——CI 绿色时不要运行完整 sweeper |
| 问题分诊／分类 | ~50k | 日志解析 + 失败分类 |
| 修复尝试（L2） | ~200k | Worktree + implementer + verifier |

**运行节奏**：5m–15m · **层级**：very-high · **建议每日上限**：1M tokens · **必须提前退出**

```bash
npx @cobusgreyling/loop-cost --pattern ci-sweeper --cadence 15m --level L2
```

以 15m 的节奏运行且不提前退出时，最坏情况下的用量会超过 5M tokens/day。切勿在每次 tick 时都运行完整操作路径。

## 成功指标

- CI 变红后到首次提出修复方案的平均时间
- 无需人工干预即可解决的失败百分比（仅限简单情况）
- 重复失败率（同一 job 在 48h 内再次失败）

这是初次采用循环工程的团队最合适的入门循环——频率高、范围有限、验证清晰。
