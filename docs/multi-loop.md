<a id="multi-loop-coordination"></a>
# 多循环协调

在一个仓库中运行多个循环很常见。但如果没有明确边界，循环之间就会相互冲突。

<a id="principles"></a>
## 原则

1. **每个分支只有一个所有者**——每小时最多只能有一个循环修改同一分支。
2. **使用独立的状态文件**——问题分诊使用 `STATE.md`；执行操作的循环使用各自模式专属的文件。
3. **问题分诊负责报告，操作循环负责执行**——L1 的 Daily Triage 绝不与 CI Sweeper 的修复争夺执行权。
4. **共享拒绝列表**——将相同的路径拒绝列表复制到每个 `LOOP.md` 中。
5. **汇总 token 预算**——参见 `templates/loop-budget.md.template`。

<a id="recommended-state-layout"></a>
## 推荐的状态文件布局

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```
STATE.md                    # Daily Triage (priorities, human inbox)
pr-babysitter-state.md      # PR watcher
ci-sweeper-state.md         # Active CI failures + attempt counts
dependency-sweeper-state.md # In-flight package updates
post-merge-state.md         # Cleanup backlog
loop-run-log.md             # Append-only observability
```

<a id="priority-when-loops-conflict"></a>
## 循环冲突时的优先级

| 优先级 | 循环 | 原因 |
|----------|------|--------|
| 1 | CI Sweeper | `main` 为红色状态时会阻塞所有工作 |
| 2 | PR Babysitter | 活跃 PR 有时效性 |
| 3 | Dependency Sweeper | CI 为红色状态时暂停 |
| 4 | Post-Merge Cleanup | 在非高峰时段运行，紧迫性最低 |
| 5 | Daily Triage | 在 L1 仅负责报告；为其他循环安排执行计划 |

<a id="scheduler-coordination"></a>
## 调度器协调

在根目录的 `LOOP.md` 中记录以下内容：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
## Multi-loop schedule
- CI Sweeper: /loop 15m (active hours)
- PR Babysitter: /loop 10m (active hours, skip if CI Sweeper acting on same PR)
- Daily Triage: /loop 1d 08:00
- Dependency Sweeper: /loop 6h (skip if main CI red)
- Post-Merge: /loop 1d 22:00
```

<a id="collision-detection"></a>
## 冲突检测

每个操作循环都应在自己的状态文件中写入 `acting_on: branch-or-pr-id`。生成修复任务之前：

1. 读取所有其他模式的状态文件
2. 如果另一个循环的 `acting_on` 与之匹配，则跳过本次任务，并记录到 `loop-run-log.md`

<a id="human-inbox"></a>
## 人工收件箱

在 `STATE.md` 中使用共享小节：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
## Human Inbox (ambiguous / cross-loop)
- [ ] PR #42: CI Sweeper and PR Babysitter both flagged — human pick owner
```

<a id="example-safe-three-loop-setup"></a>
## 示例：安全的三循环配置

| 循环 | 等级 | 运行节奏 |
|------|-------|---------|
| Daily Triage | L1 | 1d |
| PR Babysitter | L2 | 10m |
| Post-Merge Cleanup | L1 → L2 | 1d off-peak |

只有在 PR Babysitter 的尝试次数限制和验证器经过两周验证后，才能加入 CI Sweeper。

有关真实场景中的冲突案例，请参阅 [stories/multi-loop-collision.md](../stories/multi-loop-collision.md) 和 [stories/dependency-vs-ci-sweeper-collision.md](../stories/dependency-vs-ci-sweeper-collision.md)。
