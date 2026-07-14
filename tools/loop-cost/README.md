# loop-cost

按运行节奏和就绪度等级（L1–L3）估算 [Loop Engineering](https://github.com/cobusgreyling/loop-engineering) 模式的每日 token 用量。

使用 `patterns/registry.yaml` 中的成本元数据。

<a id="install--run"></a>

## 安装与运行

```bash
npx @cobusgreyling/loop-cost --pattern ci-sweeper --cadence 15m --level L2
npx @cobusgreyling/loop-cost --pattern daily-triage --level L1 --json
npx @cobusgreyling/loop-cost --list
```

**从本仓库运行：**

```bash
cd tools/loop-cost
npm install
npm test
```

<a id="options"></a>

## 选项

| 选项 | 说明 |
|------|-------------|
| `--pattern` | pattern ID（参见 `--list`） |
| `--cadence` | 覆盖运行节奏（例如 `15m`、`1d`） |
| `--level` | `L1`、`L2` 或 `L3`（默认为 `L1`） |
| `--orchestration` | 多智能体操作成本：`single`（默认）、`maker-checker`、`parallel:N`、`debate:R` |
| `--conservative` | 使用取值范围中较慢的运行节奏 |
| `--json` | 机器可读输出 |

<a id="scenarios"></a>

## 场景

每项估算都包含以下场景。加粗的英文场景名称与 CLI 输出保持一致，括号中为中文说明：

- **Early-exit / no-op**（提前退出／无操作）—监视列表为空，token 用量最少
- **Full triage**（完整问题分诊）—每次运行都执行完整扫描
- **Action every run**（每次运行都执行操作）—每次都由执行者和验证者处理（最坏情况）
- **Realistic blend**（符合实际情况的混合比例）—基于等级计算（输出中有具体说明）

与 `loop-budget.md`（由 `loop-init` 生成脚手架）及 `loop-audit` 的成本可观测性检查配合使用。

<a id="orchestration-cost"></a>

## 编排成本

上述场景假定执行者只处理一轮。将任务分发给多个智能体的循环会在
**操作路径**上产生更高成本（无操作扫描和单次问题分诊不受影响）。`--orchestration`
会应用倍率，使估算值——以及提供给熔断器且符合实际情况的单次运行上限——能够
反映实际的运行结构：

| 模式 | 倍率 | 建模内容 |
|------|-----------|--------|
| `single`（默认） | 1x | 执行者处理一轮并自行检查 |
| `maker-checker` | 2x | 执行者 + 独立验证者处理一轮（L2+ 默认模式） |
| `parallel:N` | N+1 | 将任务分发给 N 个候选智能体，再由合并者／裁决者处理一轮 |
| `debate:R` | 1+R | 一个提案者加 R 轮评论与修订 |

```bash
npx @cobusgreyling/loop-cost --pattern ci-sweeper --level L2 --orchestration maker-checker
npx @cobusgreyling/loop-cost --pattern ci-sweeper --level L2 --orchestration parallel:3
```

倍率高于 2x 时会发出警告——深度分发或辩论很容易启用，
但在无人值守状态下运行的成本高昂。

<a id="feed-the-circuit-breaker"></a>

## 为熔断器提供预算

[`loop-context`](../loop-context) 的熔断器可以直接根据相应模式符合实际情况的单次运行估算值
确定 `--token-budget`，无需手动输入猜测值：

```bash
npx @cobusgreyling/loop-context --check --ledger loop-ledger.json \
  --budget-from-pattern ci-sweeper --budget-level L2
```

`loop-context` 通过 shell 调用此 CLI 的构建产物来完成这项工作——这些包在
源码层面保持独立，不共享运行时状态。显式设置的 `--token-budget` 始终会
覆盖 `loop-context` 调用中的推导值。

参阅[运行循环文档](../../docs/operating-loops.md)。
