# loop-init

根据模式和工具，将循环工程的起始配置搭建到你的项目中。

**npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok** 可直接运行。

经过验证的模式 × `--tool` 矩阵，请参阅 [loop-init 验证文档](../../docs/loop-init-validation.md)。

<a id="install--run"></a>

## 安装与运行

```bash
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok
npx @cobusgreyling/loop-init . --pattern daily-triage --tool opencode
npx @cobusgreyling/loop-init . -p pr-babysitter -t claude
npx @cobusgreyling/loop-init . -p dependency-sweeper --dry-run
```

有关 npm 发布标签，请参阅[发布文档](../../docs/RELEASE.md)。已发布的包会捆绑此单体仓库（monorepo）中的 `starters/` 和 `templates/`。

搭建完成后，务必运行 `npx @cobusgreyling/loop-audit . --suggest`，并实际执行第一个仅报告循环，以生成活动信号。

<a id="patterns"></a>

## 模式

| 模式 | 默认状态文件 |
|---------|-------------------|
| `daily-triage` | `STATE.md` |
| `pr-babysitter` | `pr-babysitter-state.md` |
| `ci-sweeper` | `ci-sweeper-state.md` |
| `dependency-sweeper` | `dependency-sweeper-state.md` |
| `post-merge-cleanup` | `post-merge-state.md` |
| `changelog-drafter` | `changelog-drafter-state.md` |
| `issue-triage` | `issue-triage-state.md` |

对于 L2 模式（`ci-sweeper`、`dependency-sweeper`），如果起始配置中缺少 `minimal-fix` 和 `loop-verifier` 模板，也会一并复制。

具备修复能力的模式（`pr-babysitter`、`ci-sweeper`、`dependency-sweeper`、`post-merge-cleanup`）还会获得一个**熔断器（circuit breaker）**：

- `loop-guard` 技能——将每次尝试记录到 `loop-ledger.json`，并在重试前运行 [`loop-context`](../loop-context) `--check`
- `loop-ledger.json`——预置该模式的目标、`pattern`/`level`，以及一个空的 `attempts` 数组

账本中的 `pattern`/`level` 让 `loop-guard` 能够依据 [`loop-cost`](../loop-cost) 对每次运行的实际估算来设定熔断器的 `--token-budget`，无需手动输入数值。触发条件（连续 N 次出现同一错误、连续失败次数过多、达到 token 预算或迭代上限）满足时，熔断器会升级处理，而不是徒劳循环。仅报告模式会跳过熔断器。

处理人工编写且往往信息不足的输入的模式（`issue-triage`）还会获得一个**输入接收（intake）技能**：

- `loop-intake` 技能——当工作项过于模糊，无法验证是否“完成”时，它会逐次提出一个问题、要求提供确切值，并写入一个待解决问题和 `needs-human` 升级标记，而不是自行猜测。预先澄清可避免循环在从未明确定义的目标上浪费修复尝试。

每次搭建还会创建：

- `loop-budget.md`——特定于模式的每日上限和紧急停止开关（kill switch）
- `loop-run-log.md`——仅追加的运行历史记录
- `loop-budget` 技能——在每次运行开始和结束时执行的运行时预算护栏

<a id="tools"></a>

## 工具

- `grok`（默认）
- `claude`
- `codex`
- `opencode`——`daily-triage` 随附 `minimal-loop-opencode`（`skills/`、`AGENTS.md`、`opencode.json`）

如果某个工具的专用变体尚不可用，则回退到 Grok 起始配置路径。

<a id="from-this-repo"></a>

## 从本仓库运行

```bash
cd tools/loop-init && npm ci && npm test
node dist/cli.js /path/to/project --pattern daily-triage --tool grok
```

搭建完成后，配合使用 `loop-audit` 和 `loop-cost`：

```bash
npx @cobusgreyling/loop-cost --pattern daily-triage --level L1
npx @cobusgreyling/loop-audit . --suggest
```
