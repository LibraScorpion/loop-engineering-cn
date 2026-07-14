# loop-audit

用于评估项目 **Loop 就绪度**（0–100 分）并建议后续步骤的 CLI。

已发布的软件包可直接运行：**npx @cobusgreyling/loop-audit . --suggest**。

<a id="install--run"></a>

## 安装与运行

**npm（推荐）：**

```bash
npx @cobusgreyling/loop-audit .
npx @cobusgreyling/loop-audit . --suggest
```

**从本仓库运行：**

```bash
cd tools/loop-audit
npm install
npm run build
node dist/cli.js /path/to/your/project
```

<a id="beforeafter-demo"></a>

## 前后对比演示

查看评分如何从空目录开始，经 L1 起步模板提升至 L2 验证器：

```bash
bash scripts/before-after-demo.sh
```

<a id="options"></a>

## 选项

```bash
loop-audit .              # 人类可读格式（默认）
loop-audit . --json       # 机器可读格式
loop-audit . --md         # Markdown 报告
loop-audit . --suggest    # 从模板复制的命令 + 活动建议（所有工具）
loop-audit . --badge      # Markdown README 徽章（Loop Ready 级别 + 评分）
```

评分低于 40 时退出码为 `2`（当项目已具备循环就绪条件后，可用于 CI 关卡）。

<a id="publish-to-npm"></a>

## 发布至 npm

维护者：

```bash
cd tools/loop-audit
npm run build
npm publish --access public
```

<a id="signals-checked-v16"></a>

## 检查的信号（v1.6+）

| 信号                    | 说明 |
|-------------------------|-------|
| 状态文件                | STATE.md 或特定模式的状态文件 |
| 问题分诊技能            | loop-triage / ci-triage / pr-review-triage 等 |
| 验证器技能              | 执行者／检查者（maker/checker）分离（技能或 Claude/Codex 智能体） |
| LOOP.md / 配置          | 运行节奏、限制与交接 |
| AGENTS.md / CLAUDE.md   | 项目约定 |
| 安全文档                | safety.md，以及 LOOP.md 中对关卡的说明 |
| .github/ + 工作流       | 项目自身实践 / 自动化 |
| MCP / 连接器            | 文本提及或配置文件 |
| Git 工作树证据          | 文档中的隔离模式 |
| patterns/registry.yaml  | 供工具使用的机器索引 |
| loop-budget.md          | token 上限和紧急停止开关 |
| loop-run-log.md         | 仅追加的运行历史 |
| LOOP.md 预算章节        | 配置中记录的运行节奏限制 |
| loop-budget 技能        | 运行时预算护栏 |
| 最小权限工具范围        | SKILL.md 中的 `allowed-tools`，或文档中记录的工具/MCP 范围（智能体仅获得其角色所需的权限） |
| 停滞 / 无进展检测       | loop-context 熔断器、账本，或文档中记录的最大尝试次数 / 无进展规则 |
| 人工介入路径            | LOOP.md / 安全文档定义何时停止并交由人工处理 |
| **loopActivity (v1.4)** | **动态证据**：状态中的 "Last run" 时间戳、与循环相关的 Git 提交、定时工作流和运行日志 |

L3 要求具备验证器、状态和成本可观测性（预算 + 运行日志 + LOOP.md 预算），**并且**存在经过验证的循环活动（而不只是磁盘上存在相应文件）。

<a id="levels"></a>

## 级别

| 级别 | 含义 |
|-------|---------|
| L0 | 草案 — 记录意图 |
| L1 | 仅报告循环 |
| L2 | 带验证器的辅助自动修复 |
| L3 | 具备无人值守能力（设有人工审核关卡） |

参见[循环设计检查清单](../../docs/loop-design-checklist.md)。
