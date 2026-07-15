# loop-context

**面向智能体循环的有状态记忆管理器。** 保持上下文窗口整洁，并在失控循环消耗大量 token 之前将其停止。

[Loop Engineering 文档](../../docs/)提醒，长时间运行的智能体循环通常会以两种典型方式失败：

- **上下文溢出与劣化**——对话历史和错误日志持续增长，直至模型丢失最初目标，或被过时的堆栈跟踪淹没。
- **停滞／无进展循环**——智能体无休止地重试同一个失败操作，不知不觉耗尽 token 预算。

`loop-context` 位于智能体与其持久记忆（`STATE.md`、运行日志）之间，并在每次迭代前完成三件事：

1. **汇总**尝试过的操作及其失败情况。
2. **裁剪**冗长的堆栈跟踪、合并重复错误，并丢弃近期窗口之外的过时尝试。
3. 仅将必要信息**注入**下一条提示词。

**熔断器（circuit breaker）**会监控迭代次数、token 消耗、停滞（同一错误连续出现 N×）和无进展（连续失败次数过多），并将问题升级给人工处理，避免徒劳循环。

所有操作都**具有确定性且无需依赖项**：汇总或裁剪无需调用 LLM，因此成本足够低，可在每次迭代时运行。

<a id="install--run"></a>

## 安装 / 运行

```bash
npx @cobusgreyling/loop-context --help
# 或从此仓库运行：
cd tools/loop-context && npm install && npm test
```

<a id="the-ledger"></a>

## 运行账本

此工具读取一份**运行账本（run ledger）**，即记录循环目标和各次尝试的 JSON 数据。

> 中文说明：以下为机器可读的 JSON 示例；为避免协议漂移，key、枚举值、错误签名及示例字符串保持英文原文。

```json
{
  "goal": "Get the failing migration test to pass",
  "attempts": [
    { "iteration": 1, "action": "run migration", "outcome": "failure",
      "error": "Error: connect ECONNREFUSED 127.0.0.1:5432", "tokensUsed": 1500 },
    { "iteration": 2, "action": "run migration again", "outcome": "failure",
      "error": "Error: connect ECONNREFUSED 127.0.0.1:5432", "tokensUsed": 1400 }
  ]
}
```

`outcome` 的取值为 `success | failure | noop`。`error` 和 `tokensUsed` 为可选字段。

<a id="usage"></a>

## 用法

```bash
# 熔断器——退出码 0 = continue，2 = escalate（接入循环的控制流）
loop-context --check --ledger run.json

# 为下一条提示词生成紧凑的上下文块
loop-context --inject --ledger run.json

# 生成本次运行的事实汇总
loop-context --summary --ledger run.json --json

# 输出裁剪后的账本（近期窗口、精简的跟踪信息、合并的重复项）
loop-context --prune --ledger run.json

# 通过 stdin 管道传入
cat run.json | loop-context --check
```

<a id="options"></a>

### 选项

| 选项 | 默认值 | 说明 |
|------|---------|---------|
| `--max-iterations <n>` | 10 | 迭代次数硬上限 |
| `--stagnation <n>` | 3 | 同一错误连续出现 N× 时升级处理 |
| `--no-progress <n>` | 5 | 连续失败 N 次后升级处理 |
| `--token-budget <n>` | none | 累计 token 用量达到上限时升级处理 |
| `--window <n>` | 5 | 裁剪时保留的尝试次数 |
| `--max-trace-lines <n>` | 8 | 裁剪时保留的堆栈跟踪行数 |

退出码：`0` continue（继续）· `2` escalate（升级处理）· `1` error（错误）。

<a id="resolving-the-token-budget-from-a-pattern"></a>

## 根据模式确定 token 预算

手动输入 `--token-budget <n>` 只能依靠猜测。[`loop-cost`](../loop-cost) 已经会为每个模式和就绪度级别计算符合实际情况的单次运行估算值，因此应改为从中确定上限：

```bash
loop-context --check --ledger run.json --budget-from-pattern ci-sweeper --budget-level L2
```

| 选项 | 默认值 | 说明 |
|------|---------|---------|
| `--budget-from-pattern <id>` | none | 要在 `loop-cost` 注册表中查找的 pattern ID |
| `--budget-level <L1\|L2\|L3>` | `L1` | 传给 `loop-cost` 的就绪度级别 |
| `--budget-scenario <realistic\|action\|report>` | `realistic` | 用作上限的 `loop-cost` 场景 |
| `--budget-cadence <spec>` | pattern default | 透传给 `loop-cost` 的运行节奏覆盖值 |
| `--budget-conservative` | off | 使用范围内较慢的运行节奏（`loop-cost` 自身的选项） |

显式指定的 `--token-budget <n>` 始终优先于 `--budget-from-pattern`；只有未输入数值时才会填入派生值。`loop-context` 会通过 shell 调用 `loop-cost` 已构建的 CLI（先查找 monorepo 中的同级目录，再查找已安装的 `@cobusgreyling/loop-cost` 依赖项）。这与 `loop-init` 已用于解析 `loop-audit` 的方式相同，因此两个包在源码层面保持独立；遇到未知 pattern ID 时会显示 `loop-cost` 自身的错误，而不会静默失败。

<a id="populating-the-ledger"></a>

## 填充运行账本

循环控制脚本会在每次迭代时向 `run.json` 追加一个对象（也可以通过 stdin 管道传入相同的数据结构）。

> 中文说明：以下 shell/JavaScript 示例包含机器可读的 JSON key、枚举值、错误签名和示例字符串；这些内容保持英文原文，纯说明性注释已翻译。

```bash
# 每次智能体迭代后——追加一次尝试，再决定是否允许下一次迭代
node -e "
const fs = require('fs');
const ledger = JSON.parse(fs.readFileSync('run.json', 'utf8'));
ledger.attempts.push({
  iteration: ledger.attempts.length + 1,
  action: 'run migration tests',
  outcome: 'failure',
  error: process.argv[1],
  tokensUsed: Number(process.argv[2] || 0),
});
fs.writeFileSync('run.json', JSON.stringify(ledger, null, 2));
" \"\$ERROR_MSG\" \"\$TOKENS\"
loop-context --check --ledger run.json || { loop-context --inject --ledger run.json; exit 2; }
```

在循环开始时初始化一次：`{ \"goal\": \"Get CI green on main\", \"attempts\": [] }`。

<a id="in-a-loop"></a>

## 在循环中

```bash
# 在循环控制脚本中，每次迭代前：
if ! loop-context --check --ledger run.json; then
  loop-context --inject --ledger run.json > escalation.md   # 向人工处理者提供整洁的摘要
  exit 0                                                     # 停止而不是重试
fi
```

<a id="library-api"></a>

## 库 API

```ts
import {
  checkCircuitBreaker,
  pruneLedger,
  summarizeAttempts,
  buildContextInjection,
} from '@cobusgreyling/loop-context';

const decision = checkCircuitBreaker(ledger);
if (decision.escalate) escalateToHuman(decision.reason);
else runNextIteration(buildContextInjection(ledger));
```

<a id="where-it-fits"></a>

## 它在体系中的位置

这是循环工程中 **Memory / State（记忆／状态）**原语的动态实现：`STATE.md` 以静态方式存储状态，`loop-context` 则跨迭代管理状态。请参阅 [docs/primitives.md](../../docs/primitives.md) 和[运行与安全指南](../../docs/)。

MIT · [loop-engineering](https://github.com/cobusgreyling/loop-engineering) 的一部分，作者为 Cobus Greyling。
