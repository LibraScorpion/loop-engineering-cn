<a id="operating-loops-in-production"></a>

# 在生产环境中运行循环

运行循环是一项运维工作。本文介绍成本、日志记录、指标，以及何时应暂停或终止循环。

<a id="token--cost-budgeting"></a>

## token 与成本预算

在安排调度前进行估算：

```bash
npx @cobusgreyling/loop-cost --pattern <id> --cadence <interval> --level L1
npx @cobusgreyling/loop-init . --pattern <id>   # 创建 loop-budget.md、loop-run-log.md 和 loop-budget 技能的脚手架
```

`loop-audit` 会评估成本可观测性；只有预算、运行日志和 LOOP.md 中的预算章节均已存在，才允许评为 L3。

粗略规划因素：

| 因素 | 影响 |
|--------|--------|
| 运行节奏 | 线性倍增（5m 与 1d 的对比 = 288 次运行／天） |
| 每次运行的子智能体数量 | 每个子智能体都会产生完整的模型调用和工具往返 |
| 上下文大小 | 大型仓库加完整 CI 日志会使问题分诊成本高昂 |
| 验证器模型 | 对无人值守运行而言，为验证器使用更强的模型是值得的 |

<a id="example-estimates-order-of-magnitude"></a>

### 估算示例（数量级）

假设每次轻量问题分诊运行约使用 50k token，而包含执行者和验证器的每次运行约使用 200k token：

| 循环 | 运行节奏 | 每日运行次数 | 每日 token 粗略用量 |
|------|---------|----------|-------------------|
| 每日问题分诊（仅报告） | 1d | 1 | ~50k |
| CI 清理循环（轻量） | 15m | 96 | ~5M（如果每次都是完整运行——**应避免**） |
| PR 看护循环 | 5m | 288 | 很高——使用提前退出机制 |

**最佳实践**：问题分诊阶段成本较低；**仅**在状态表明有可执行事项时才生成子智能体。监视列表为空时，应在 <5k token 内退出。

<a id="budget-rules"></a>

### 预算规则

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
## Loop Budget — Project X
- Max tokens/day: 2M (adjust to your plan)
- On exceed: pause schedulers, notify human
- Max sub-agent spawns per run: 3
```

将以下提示词写入技能或调度器提示词中：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变
>
> "If no high-priority items, exit immediately."

<a id="logging-each-run"></a>

## 记录每次运行

最小日志条目（追加到 `loop-run-log.md` 或结构化 JSON 中）：

```json
{
  "run_id": "2026-06-09T08:15:00Z",
  "pattern": "daily-triage",
  "duration_s": 45,
  "items_found": 4,
  "actions_taken": 1,
  "escalations": 0,
  "tokens_estimate": 52000,
  "outcome": "success"
}
```

也可以在 `STATE.md` 页脚中使用便于人阅读的形式：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
---
Run log: 2026-06-09 08:15 | 4 findings | 1 worktree opened | 0 escalations
```

<a id="metrics-dashboard-template"></a>

## 指标仪表板（模板）

每周在电子表格或 Notion 中跟踪：

| 指标 | PR 看护循环 | 每日问题分诊 | CI 清理循环 |
|--------|---------------|--------------|------------|
| 运行次数 | | | |
| 可执行的发现项 | | | |
| 提议的自动修复 | | | |
| 人工升级次数 | | | |
| 误报 | | | |
| 人工知晓平均耗时 | | | |
| token 支出（估算） | | | |

各模式特有的成功指标见相应[模式](../patterns/README.md)。

<a id="when-to-slow-down"></a>

## 何时应降低运行速度

- 周中时 token 预算 >80%
- 问题分诊的误报率 >30%
- 同一事项在 48h 内升级了 2+ 次
- 重大版本发布周——暂停自动修复循环，切换为仅报告模式

<a id="when-to-pause"></a>

## 何时应暂停

- 正在处理生产事故（循环可能会干扰紧急修复）
- 正在进行破坏性数据库模式迁移
- 关键人工审核者不在岗，同时还启用了自动合并（不要这样做）

<a id="when-to-kill-a-loop"></a>

## 何时应终止循环

- 持续出现 [failure-modes.md](./failure-modes.md) 中的 S2 失效
- 连续 2 周成本 > 价值
- 团队将所有通知静音
- 模式已被事件驱动的替代方案取代（例如仅使用 CI Action）

**终止检查清单**：

1. 执行 `scheduler_delete`／禁用 Automation／移除 Action
2. 使用 `status: retired` 归档状态文件
3. 在 `stories/` 中进行复盘（可选，但很有价值）

<a id="upgrade-path"></a>

## 升级路径

```
仅报告（L1）→ 1–2 周稳定的问题分诊
       ↓
小型自动化成果（L2）→ 验证器 + Git 工作树 + 最大尝试次数
       ↓
连接器（L2+）→ 自动更新 PR／工单
       ↓
无人值守（L3）→ 仅在具备拒绝列表、预算、指标和人工审核关卡时采用
```

对于生产仓库中的新模式，绝不要跳过 L1。
