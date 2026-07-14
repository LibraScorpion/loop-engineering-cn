<a id="primitives-matrix--grok-claude-code-codex-openclaw-opencode-cursor-windsurf-hermes"></a>
# 原语矩阵 — Grok、Claude Code、Codex、OpenClaw、Opencode、Cursor、Windsurf、Hermes

与工具无关的循环设计：重要的是**能力**，而非产品名称。本矩阵展示了每种原语在八种主要智能体环境中的具体形式。

| 原语 | 在循环中的作用 | Grok Build TUI | Claude Code | Codex | OpenClaw | Opencode | Cursor | Windsurf | Hermes |
|-----------|-----------------|----------------|-------------|-------|----------|----------|--------|----------|--------|
| **自动化／调度** | 按运行节奏执行发现与问题分诊 | `/loop [interval] <prompt>`、`scheduler_create` / `scheduler_list` / `scheduler_delete`（`recurring`、`durable`、`fireImmediately`），用 `monitor` 监听流式事件 | `/loop`、计划任务、cron、钩子、GitHub Actions | [Automations 选项卡](https://developers.openai.com/codex/app/automations)：项目、提示词、运行节奏、环境；问题分诊收件箱 | [`openclaw cron`](https://docs.openclaw.ai/automation/cron-jobs)（`--cron` / `--every` / `--at`，隔离会话或主会话）；webhook（`POST /hooks/agent`、`/hooks/wake`）；心跳 | OS cron / systemd timer / GitHub Action 调用 `opencode run "..."`；通过 `opencode serve` 运行无头服务器 | Cloud Agents + **Automations**（cron、webhook、Linear/GitHub/Slack 触发器）；前台 Agent 对话用于临时的 `/loop` 风格提示词 | Cascade **Workflows**（`/workflow-name`，手动调用）；配合 GitHub Actions 或外部 cron 实现真正的调度 | [`hermes cron create "<cron>" --skill … --deliver local\|origin\|<channel>\|platform:chat_id:thread_id --workdir "$PWD"`](https://hermes-agent.nousresearch.com/docs)；通过 `POST /hooks/agent` 使用 webhook；每个任务的 `context_from` 将上游任务的 stdout 串接到下游提示词中 |
| **运行直至完成** | 持续工作，直到满足可验证的条件 | [`/goal`](https://github.com/cobusgreyling/goal-engineering) + `update_goal`——跨轮次持久保存目标（[Goal Engineering](https://github.com/cobusgreyling/goal-engineering)） | `/goal`——由独立模型检查完成情况 | `/goal`——暂停／恢复、可验证的停止条件 | 使用带有明确 `--message` 停止条件的周期性隔离 cron；通过 `coding-agent` 技能委派给外部 CLI；将有边界的工作交给 Goal Engineering | 有边界的 `opencode run "<goal + stop condition>"` 会话；随后通过 `--agent verifier` 运行验证智能体 | Agent 模式 + **hooks**（`.cursor/hooks.json`），用于持续修复直至全部通过的循环 | 带明确验证检查点的工作流步骤；通过 **Memories** 保持跨会话连续性 | 通过 `hermes cron edit --context-from <upstream-id>` 串接 cron 任务；技能循环使用 `delegate_task`，直到满足可验证的停止条件；`hermes cron edit --schedule` 可实时调整运行节奏 |
| **Git 工作树** | 安全地并行执行 | 使用 `isolation: "worktree"` 的子智能体、后台任务 | `git worktree`、`--worktree`、子智能体上的 `isolation: worktree` | 每个线程内置一个 Git 工作树 | 智能体工作区中的 `exec` + `git worktree`；`coding-agent` 委派给 CLI 后端；可为每个智能体配置可选沙箱 | 每次执行者运行显式使用 `git worktree`；通过 `--dir` 传递 Git 工作树路径 | 每个 Composer / Cloud Agent 任务使用一个 Git 工作树 | 工作区隔离；同时运行多个 Cascade 会话 | 在 cron 任务中使用标准 `git worktree`；`--workdir` 固定工具 cwd，并为每个任务注入 `AGENTS.md`，避免并行任务冲突 |
| **技能** | 持久保存项目知识 | `.grok/skills/` 或 `~/.grok/skills/` 中的 `SKILL.md`；按名称调用 | `.claude/skills/` 或项目技能中的 `SKILL.md` | [Agent Skills](https://developers.openai.com/codex/skills)——`$name` 或隐式匹配 | `<workspace>/skills/`、`.agents/skills` 或 `~/.openclaw/skills` 中的 `SKILL.md`；[AgentSkills](https://agentskills.io) 规范；[ClawHub](https://clawhub.ai) + `openclaw skills install` | `skills/<name>/` 中的 `SKILL.md`；用 `AGENTS.md` 保存始终生效的仓库规则 | `.cursor/rules/*.mdc`（glob、`alwaysApply`）、`AGENTS.md`、`.cursor/skills/` | `.devin/rules/` 或 `.windsurf/rules/`（持久上下文）；`.windsurf/workflows/`（可复用流程） | `~/.hermes/skills/<name>/`（用户）或 `.hermes/skills/<name>/`（项目）下的 `SKILL.md`；`hermes skills install/list/inspect`；在 cron 任务中通过 `--skill <name>` 调用，或根据描述匹配自动加载 |
| **插件与连接器** | 连接真实工具 | 通过 `CallMcpTool` 使用 MCP 服务 | MCP 服务 + 插件 | 连接器（MCP）+ 用于分发的插件 | MCP + 渠道插件（Slack、Telegram、WhatsApp 等）；浏览器自动化插件 | `opencode.json` 中的 MCP 服务；通过 CLI 或 MCP 桥接 GitHub/Linear/Slack | 设置中的 MCP；可完整访问连接器的 Cloud Agent 沙箱 | 通过 Cascade 设置 / `mcp_config.json` 使用 MCP | 通过 `hermes mcp add` 使用 MCP 服务；内置常用渠道（Feishu、Slack、Discord、Telegram、WhatsApp、SMS）；`hermes send` 可投递到任何已连接渠道 |
| **子智能体** | 执行者／检查者分工 | 带 `subagent_type` 和 Git 工作树隔离的 `Task` 工具 | `.claude/agents/` 中的 Task 子智能体、智能体团队 | `.codex/agents/` 中以 TOML 定义的子智能体 | `agents.list` 多智能体路由；隔离的 cron 子智能体编排；独立的验证智能体 ID | 通过 `opencode agent` 使用具名智能体；每次运行用 `--agent verifier` 或 `--agent implementer` 调用一个角色 | 多智能体模式、审查模式、`.cursor/agents/` 中的自定义智能体 | 并行运行多个 Cascade；工作流编排的执行者 → 审查者步骤 | `delegate_task(goal=..., role='leaf'\|'orchestrator', toolsets=[...])`——后台执行、隔离上下文，结果作为新消息重新进入；按 `delegation.max_concurrent_children` 的限制并行运行最多 N 个子任务 |
| **状态／记忆** | 跨运行追踪已完成的工作 | `STATE.md`、待办事项、持久化的调度器状态 | `AGENTS.md`、进度文件、通过 MCP 使用 Linear | Markdown 或通过连接器使用 Linear | 工作区中的 `STATE.md`、`HEARTBEAT.md`；cron 持久化到 Gateway SQLite；Skill Workshop 用于提出技能建议 | `STATE.md`、`LOOP.md`、`AGENTS.md`，通过 `opencode export <sessionID>` 导出会话 | `STATE.md`、`LOOP.md`、Cloud Agent 记忆 | `STATE.md`、Cascade **Memories**、工作流运行记录 | `--workdir` 中的 `STATE.md`；用 `HEARTBEAT.md` 进行定期轮询；通过 `hermes memory` 保存跨会话持久事实；cron 任务存储在 gateway SQLite 中 |

**参考 MCP 服务：**本仓库提供 [`tools/mcp-server/`](../tools/mcp-server/)——将模式、技能、状态、预算和安全文档作为运行时可查询的 MCP 资源（减少提示词填充）。配置示例：[`examples/mcp/loop-engineering.mcp.json`](../examples/mcp/loop-engineering.mcp.json)。

<a id="scheduling-quick-reference"></a>
## 调度快速参考

| 使用场景 | Grok | Claude Code | Codex | OpenClaw | Opencode | Cursor | Windsurf | Hermes |
|----------|------|-------------|-------|----------|----------|--------|----------|--------|
| 每 5 分钟 | `/loop 5m <prompt>` | `/loop 5m <prompt>` | Automation，5 分钟运行节奏 | `openclaw cron create "*/5 * * * *" --session isolated --message "..."` | Cron/systemd 调用 `opencode run "..."` | Automation cron 触发器 | 外部 cron + `/workflow` 或 Action | `hermes cron create "*/5 * * * *" --deliver local --skill loop-triage "..."` |
| 每天早晨 | `/loop 1d <prompt>` | Cron / `/loop 1d` | Automation，每日运行 | `openclaw cron create "0 7 * * *" --tz ... --session isolated` + 可选的 `--announce` | Cron/systemd 调用 `opencode run "Run loop-triage"` | 每日 Automation + `AGENTS.md` 上下文 | 每日工作流 + Memories | `hermes cron create "0 7 * * *" --name "Daily triage" --deliver local --skill loop-triage --workdir "$PWD" "..."` |
| 直到测试通过 | [`/goal`](https://github.com/cobusgreyling/goal-engineering/blob/main/patterns/tests-green.md) + `goal-verifier` 技能（或循环 + 验证智能体） | `/goal all tests pass` | `/goal` | 隔离 cron + 消息中的验证智能体，或 `coding-agent` + 外部 CLI | `opencode run "Goal: all tests pass. Stop when verifier approves."` | 通过钩子持续修复直至全部通过 | 包含测试／修复循环的工作流 | 使用 `delegate_task` 运行执行者的有边界技能循环，再用第二个 `delegate_task` 作为检查者；或通过 `context_from` 串接 cron 任务 |
| 重启后继续运行 | 带 `durable: true` 的 `scheduler_create` | 钩子 + 持久化配置 | Automation（服务端） | cron 任务持久化到 Gateway SQLite | systemd timer + 已提交的 `STATE.md` + 已导出的会话 | Cloud Agent + 仓库持久化状态 | Memories + 已提交的 `STATE.md` | cron 任务持久化到 gateway SQLite；`--workdir` 在每次触发时重新注入项目上下文 |
| 事件驱动（CI 失败） | `monitor` 或 GitHub Action | GitHub Action + webhook | Automation + webhook | `POST /hooks/agent` 或已映射的 webhook | GitHub Action / webhook 桥调用 `opencode run` | PR/issue 事件上的 Automation | GitHub Action 触发器 + `/workflow` | `POST /hooks/agent`，内容为 `{"message":"…","name":"…","deliver":"local"}` |

<a id="skill-packaging"></a>
## 技能打包

| 概念 | Grok | Claude Code | Codex | OpenClaw | Opencode | Cursor | Windsurf | Hermes |
|---------|------|-------------|-------|----------|----------|--------|----------|--------|
| 编写格式 | `SKILL.md` + 可选的脚本／参考资料 | 相同 | 相同 | 相同（[AgentSkills](https://agentskills.io)） | 相同（`skills/<name>/` 下的 `SKILL.md`） | `SKILL.md` 或带 frontmatter 的 `.mdc` 规则 | Markdown 规则 + 工作流文件 | `SKILL.md` + 可选的 `references/`、`templates/`、`scripts/`、`assets/`（[AgentSkills](https://agentskills.io) 规范） |
| 分发 | 复制到 `.grok/skills/` 或用户技能目录 | 插件／复制到项目 | 插件包 | `<workspace>/skills/`、ClawHub、`openclaw skills install` | 复制到 `skills/`；在 `AGENTS.md` 中保留项目规则 | `.cursor/skills/` 或 `.cursor/rules/` | 仓库中的 `.windsurf/rules/` + `.windsurf/workflows/` | `~/.hermes/skills/<name>/`（用户）或 `.hermes/skills/<name>/`（项目）；通过 `hermes skills install <name>` 从 skills.sh、ClawHub、well-known endpoint 或 GitHub 安装 |
| 调用 | 在提示词中写技能名，或根据描述自动匹配 | `$skill-name` 或隐式调用 | `$skill-name` | 斜杠命令，或自动注入系统提示词 | 在 `opencode run` 消息中指定技能，或在 `opencode.json` 中配置具名智能体 | 规则按 glob 自动应用；按需使用技能 | `/workflow-name`，或 Cascade 中始终生效的规则 | cron 任务上的 `--skill <name>`；会话期间根据描述匹配自动加载；在 `hermes chat` 上用 `--skills X,Y` 进行一次性预加载 |

<a id="sub-agent-patterns"></a>
## 子智能体模式

| 分工 | 适用场景 | Grok | Claude Code | Codex | OpenClaw | Opencode | Cursor | Windsurf | Hermes |
|-------|-------------|------|-------------|-------|----------|----------|--------|----------|--------|
| 执行者 → 验证智能体 | 任何无人值守的代码变更 | `Task` + 不同的指令／模型 | `.claude/agents/reviewer.md` | 配置了更高 `reasoning_effort` 的 TOML 智能体 | 独立的 `agents.list` ID，或 cron 消息中的验证智能体块 | 在 Git 工作树中运行 `opencode run "..." --agent implementer`，随后运行 `opencode run "Verify diff" --agent verifier --file diff.patch` | 审查模式或第二轮 Cloud Agent 检查 | 第二个 Cascade 或工作流审查步骤 | 依次调用两次 `delegate_task`（第一次以 `role='leaf'` 使用 terminal+file；第二次以 `role='leaf'` 使用只审查工具集）；或通过 `context_from` 串接两个 cron 任务 |
| 探索者 → 执行者 | 大型且不熟悉的代码库 | `explore` subagent_type | 探索智能体 | 快速只读子智能体 | `--light-context` cron + 后续隔离任务 | 先运行 `opencode run "read-only exploration..."`，再在 Git 工作树中运行后续执行者 | 先使用 `@codebase` + 计划模式 | 先运行审计工作流（只读），再实施 | 先运行 `delegate_task(toolsets=['file'], goal='read-only exploration…')`，再在 Git 工作树中运行后续 `delegate_task(toolsets=['terminal','file'], goal='implement…')` |
| 仅问题分诊 | 报告优先的循环 | `loop-triage` 技能 | `$loop-triage` | Automation 调用技能 | `loop-triage` + 隔离 cron；限制 `--tools` | `opencode run "Run loop-triage. Do not edit code."` | `AGENTS.md` + 仅报告规则 | 问题分诊工作流，不含编辑步骤 | `loop-triage` 技能 + 带 `--deliver local` 的 `hermes cron`；限制技能的工具列表；提示词中不使用 `delegate_task` |

<a id="state-conventions"></a>
## 状态约定

推荐的文件名（每个项目选择一个主干）：

| 文件 | 用途 |
|------|---------|
| `STATE.md` | 通用循环记忆（每日问题分诊） |
| `issue-triage-state.md` | Issue 队列健康状况（每日问题分诊的输入源） |
| `pr-babysitter-state.md` | PR 专用监控状态 |
| `ci-sweeper-state.md` | 活跃的 CI 失败 + 尝试次数 |
| `post-merge-state.md` | 最近合并产生的清理积压 |

Linear / GitHub Projects 同样适用——循环每次运行时都必须**读写**同一个存储。

<a id="choosing-a-tool"></a>
## 选择工具

你不必永远固定使用一种工具。设计良好的循环可以迁移：

1. 编写**技能**（与工具无关的 `SKILL.md`）
2. 定义**状态模式**（Markdown 或 JSON）
3. 记录**验证分工**（由谁检查谁）
4. 将调度映射到当前的 TUI、编辑器或 Action

对于 Opencode，迁移通常意味着使用 `skills/`、`STATE.md`、`AGENTS.md`，并让 cron/systemd 调用 `opencode run`。参见[示例](../examples/)，了解同一模式在不同工具中的实现。

<a id="copy-paste-starters-daily-triage-l1"></a>
## 可复制粘贴的起步模板（每日问题分诊，L1）

| 工具 | 起步模板 |
|------|---------|
| Grok | [starters/minimal-loop](../starters/minimal-loop/) |
| Claude Code | [starters/minimal-loop-claude](../starters/minimal-loop-claude/) |
| Codex | [starters/minimal-loop-codex](../starters/minimal-loop-codex/) |
| OpenClaw | [examples/openclaw/daily-triage.md](../examples/openclaw/daily-triage.md)——复制 `skills/` + `STATE.md`；暂不支持 `loop-init` |
| Opencode | [starters/minimal-loop-opencode](../starters/minimal-loop-opencode/) |
| Cursor / Windsurf | 从任一起步模板复制 `SKILL.md` + `STATE.md`；将调度映射到编辑器的 Automations 或 Workflows（参见附录） |
| Hermes | [examples/hermes/daily-triage.md](../examples/hermes/daily-triage.md)——将 `starters/minimal-loop/STATE.md.example` 复制到项目根目录；在 `~/.hermes/skills/` 下安装 `loop-triage` 技能；通过 `hermes cron create` 调度。暂不支持 `loop-init --tool hermes`——这种桥接是当前采用的路径。 |

复制后审计：`npx @cobusgreyling/loop-audit . --suggest`

自动搭建脚手架：`npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok`

<a id="goals-run-until-done"></a>
## 目标（运行直至完成）

循环发现持续存在的工作；**目标完成有边界的任务**。权威参考：**[Goal Engineering](https://github.com/cobusgreyling/goal-engineering)**（`/goal`、`update_goal`、`GOAL.md`、`goal-verifier`）。

| 交接 | 命令 |
|---------|---------|
| 循环发现了可修复项 | `/goal Read STATE.md top item. Complete per goal-engineering pattern. goal-verifier before done.` |
| 审计目标就绪度 | `npx @cobusgreyling/goal-audit . --suggest` |
| 判断使用目标还是循环 | [goal-vs-loop.md](https://github.com/cobusgreyling/goal-engineering/blob/main/docs/goal-vs-loop.md) |

<a id="appendix-editor-transfer-recipes-opencode-cursor--windsurf"></a>
## 附录：编辑器迁移方案（Opencode、Cursor 和 Windsurf）

迁移方案将相同的循环形态映射到各个宿主：

| 步骤 | Opencode | Cursor | Windsurf |
|------|----------|--------|----------|
| 1. 技能 | 将 `templates/SKILL.md.loop-triage` 复制到 `skills/loop-triage/SKILL.md`；在 `AGENTS.md` 中添加始终生效的规则 | 将 `templates/SKILL.md.loop-triage` 复制到 `.cursor/skills/loop-triage/SKILL.md`；在 `.cursor/rules/` 中添加始终生效的问题分诊规则 | 将技能内容复制到 `.windsurf/rules/loop-triage.md` |
| 2. 状态 | `cp starters/minimal-loop-opencode/STATE.md.example STATE.md` | `cp starters/minimal-loop/STATE.md.example STATE.md` | 相同——在项目根目录提交 `STATE.md` |
| 3. 调度 | Cron/systemd 调用 `opencode run "Run loop-triage"`；使用 `--session` / `--continue` 保持连续性 | Cloud Automation（cron）或按运行节奏手动输入 Agent 提示词 | 创建 `.windsurf/workflows/daily-triage.md`，调用 `/daily-triage` |
| 4. 验证 | 使用 `opencode agent` 创建具名验证智能体；通过 `opencode run "Verify diff" --agent verifier --file diff.patch` 调用 | 从 `templates/SKILL.md.verifier` 创建 `.cursor/agents/loop-verifier.md` | 在工作流末尾添加审查步骤；对拒绝列表中的路径设置人工审核关卡 |
| 5. 连接器 | 在 `opencode.json` 中配置 MCP 或 CLI 桥接 | 为发现 issue/PR 启用只读 GitHub MCP | 在 Cascade 设置中配置 GitHub MCP |

<a id="appendix-codeium-windsurf"></a>
## 附录：Codeium（Windsurf）

Codeium 已将其智能体界面更名为 Windsurf；智能体本身名为 Cascade。
Codeium 没有独立的 CLI——如今的“Codeium”品牌主要涵盖企业代码补全分析，而非智能体循环原语。
本附录记录 **Windsurf IDE / Cascade 智能体**，也就是上方编辑器迁移方案表中提到的同一界面。

| 原语 | Windsurf（Cascade）映射 |
|-----------|----------------------------|
| 调度 | 没有原生的 cron 风格调度器。使用 `.windsurf/workflows/<name>.md` 并通过 `/workflow-name` 手动调用，或配合外部调度器（cron、systemd、GitHub Actions）重新打开工作区并触发工作流。 |
| 技能／规则路径 | 项目规则：根目录中的 `.windsurfrules`，或使用 `.windsurf/rules/` 存放多个文件。跨所有项目的全局规则：`~/.codeium/windsurf/memories/global_rules.md`。 |
| 状态 | 没有原生的 `STATE.md` 约定。与其他编辑器宿主工具一样，手动在仓库根目录提交 `STATE.md`；Cascade 内置的 Memories 系统（每个工作区）可以作为补充，但不能替代已提交的状态文件。 |
| 执行者／检查者分工 | 没有原生的子智能体或审查者角色。变通方案：在一个 Cascade 会话中运行执行者，然后在接受变更前打开第二个会话作为检查者（或手动审查差异视图）。 |
| Git 工作树 | 不原生支持。与 Aider 相同，使用标准 Git 分支／工作树，并在合并前通过 Cascade 的差异视图进行审查。 |
| 连接器 | 直接在 Cascade/Windsurf 设置中配置 MCP 服务，用于 GitHub、issue/PR 发现或其他外部上下文。 |
| 客观不足 | 没有用于无头／无人值守运行的持久调度器，没有内置的执行者／检查者分工，也没有一等的状态文件约定——目前 Windsurf 的循环原语几乎完全依赖手动操作和会话驱动。 |

最小迁移方案：

```bash
mkdir -p .windsurf/rules .windsurf/workflows
cp templates/SKILL.md.loop-triage .windsurf/rules/loop-triage.md
cp starters/minimal-loop/STATE.md.example STATE.md
```

第一周的每日问题分诊工作流（`.windsurf/workflows/daily-triage.md`），仅报告：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```text
Run loop-triage for this repository.

Read STATE.md first.
Update STATE.md with High Priority and Watch List only.
Do not edit source code in week one.
```

在 Cascade 面板中通过 `/daily-triage` 调用。

后续 L2 工作的验证步骤——打开第二个 Cascade 会话：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```text
Act as loop-verifier.

Review the current git diff against STATE.md goals.
Report PASS/FAIL and do not edit files.
```

复制后：在 Windsurf 提供一等的 cron 等效功能之前，将调度映射到手动调用 `/workflow-name` 或外部调度器。使用 `.windsurfrules` 或 `.windsurf/rules/` 保存始终生效的仓库指导，并通过第二个 Cascade 会话（或人工差异审查）实现执行者／检查者分工。

<a id="appendix-aider-cli"></a>
## 附录：Aider CLI

Aider 是以 CLI 为先的工具，而不是带原生调度器的循环宿主，因此应将[选择工具](#choosing-a-tool)中的相同原语映射到 shell 脚本、cron 和 Git 分支。

| 原语 | Aider 映射 |
|-----------|---------------|
| 调度 | 通过 `aider --message` 或 `aider --message-file` 从 cron/systemd/GitHub Actions 运行一次性脚本会话，或使用 `--watch-files` 处理由注释触发的工作。 |
| 技能 | 使用 `--read templates/SKILL.md.loop-triage` 或项目专用约定文件，将循环指令作为只读上下文加载。 |
| 状态 | 将 `STATE.md` 保存在仓库根目录，并将其作为问题分诊循环的可编辑文件传入；专业化循环使用特定模式的状态文件，例如 `pr-babysitter-state.md`。 |
| 执行者／检查者分工 | 在一个 Aider 会话／分支中运行执行者，然后在提交或创建 PR 前，针对 `git diff` 或 `diff.patch` 运行第二个只读审查者会话。 |
| 连接器 | 优先使用由脚本调用的 CLI 工具或 MCP sidecar；不要将凭据写入提示词和状态文件。 |

第一周的每日问题分诊命令（仅报告，只更新状态）：

> 中文说明：以下命令包含供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
aider STATE.md \
  --read templates/SKILL.md.loop-triage \
  --no-auto-commits \
  --no-dirty-commits \
  --message "Run loop-triage. Update STATE.md with High Priority and Watch List only. Do not edit source code in week one."
```

后续 L2 工作的验证步骤：

> 中文说明：以下命令包含供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
git diff > diff.patch
aider --read diff.patch --read STATE.md \
  --no-auto-commits \
  --no-dirty-commits \
  --message "Act as loop-verifier. Review the diff against STATE.md goals. Report PASS/FAIL and do not edit files."
```

迁移方案：从本仓库复制与工具无关的 `SKILL.md` + 状态模式；在 Aider 被更完善的循环调度器封装之前，将调度映射到 cron、systemd 或 CI。

<a id="appendix-zed"></a>
## 附录：Zed

Zed 以编辑器为宿主，而不是独立的循环调度器，因此应将[选择工具](#choosing-a-tool)中的相同原语映射到 [Agent Panel](https://zed.dev/docs/ai/agent-panel) 线程、[Instructions](https://zed.dev/docs/ai/instructions)、[Skills](https://zed.dev/docs/ai/skills)、[Agent Profiles](https://zed.dev/docs/ai/agent-profiles)、[Tool Permissions](https://zed.dev/docs/ai/tool-permissions)、[MCP](https://zed.dev/docs/ai/mcp) 服务、[Terminal Threads](https://zed.dev/docs/ai/terminal-threads)、[Tasks](https://zed.dev/docs/tasks) 和 [Parallel Agents](https://zed.dev/docs/ai/parallel-agents) Git 工作树。

| 原语 | Zed 映射 |
|-----------|-------------|
| 调度 | Zed 目前未提供一等的 cron 风格循环调度器。使用 Agent Panel 线程或 Terminal Threads 进行手动／临时运行，使用 Zed Tasks 设置编辑器端命令钩子，并通过 cron、systemd、GitHub Actions 或其他外部调度器设置运行节奏。 |
| 项目规则／技能路径 | 将始终生效的仓库指导放入项目指令，最好使用 `AGENTS.md`；Zed 还支持 `.rules`、`.cursorrules`、`.windsurfrules`、`.clinerules`、`.github/copilot-instructions.md`、`AGENT.md`、`CLAUDE.md` 和 `GEMINI.md`。将可复用工作流放在 `.agents/skills/<name>/SKILL.md` 下的项目本地 Skills 中。 |
| 状态 | 将 `STATE.md` 保存在仓库根目录，并让每个循环提示词读取和更新同一个文件。Zed 线程历史有助于保持本地连续性，但已提交的 Markdown 状态才是跨重启、智能体和外部调度器的可移植记忆主干。 |
| Git 工作树 | 当多个线程可能编辑同一文件时，使用带 Git 工作树隔离的 Parallel Agents；通过常规 Git 流程审查差异并合并。 |
| 执行者／检查者分工 | 在 Write 配置文件线程中运行执行者，然后针对 `git diff`、`STATE.md` 和验收标准运行第二个 Ask／只读或受限自定义配置文件线程。使用 Tool Permissions 拒绝检查者使用破坏性工具，或要求确认后才能使用。 |
| 连接器 | 在 Zed Agent Settings 中配置 MCP 服务，用于 GitHub、文档查询、issue/PR 发现或其他外部上下文。External Agents 和 Terminal Threads 可能使用自身的原生配置，因此不要假定 Zed 能控制每个连接器。不要将凭据写入提示词和状态文件。 |

最小迁移方案：

```bash
mkdir -p .agents/skills/loop-triage .agents/skills/loop-verifier
cp templates/SKILL.md.loop-triage .agents/skills/loop-triage/SKILL.md
cp templates/SKILL.md.verifier .agents/skills/loop-verifier/SKILL.md
cp starters/minimal-loop/STATE.md.example STATE.md
```

第一周的每日问题分诊提示词（仅报告，只更新状态）：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```text
Run loop-triage for this repository.

Read AGENTS.md and STATE.md first.
Update STATE.md with High Priority and Watch List only.
Do not edit source code in week one.
Use MCP tools only when needed for issue/PR discovery.
```

后续 L2 工作的验证步骤：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```text
Act as loop-verifier.

Review git diff against STATE.md goals and the issue acceptance criteria.
Use an Ask/read-only or confirmation-gated profile.
Report PASS/FAIL and do not edit files.
```

复制后：在 Zed 提供更完善的一等循环调度器之前，将调度映射到手动 Agent Panel 线程、Terminal Threads、Zed Tasks 或外部调度器。使用 `AGENTS.md` 保存始终生效的仓库规则，使用 `.agents/skills/<name>/SKILL.md` 保存可复用工作流，使用 Agent Profiles / Tool Permissions 实现执行者／检查者分工，并使用 MCP 连接外部工具。

<a id="appendix-gemini-cli"></a>
## 附录：Gemini CLI

Gemini CLI 是基于终端的智能体工具。将相同的循环原语映射到 `gemini` 命令、外部调度器、上下文文件和独立验证会话。

| 原语 | Gemini CLI 映射 |
|-----------|--------------------|
| 调度 | 使用 cron、systemd timer 或 GitHub Actions 等外部调度器，按运行节奏调用 Gemini CLI 工作流。 |
| 技能／上下文文件 | 使用 `GEMINI.md` 等项目上下文文件和仓库文档提供指令、约定和背景信息。 |
| 状态 | 将持久循环状态保存在 `STATE.md.example` 等文件中。每次运行都应读取已有状态，只更新相关部分，并保留历史记录。 |
| 执行者／检查者分工 | 使用独立的 Gemini CLI 会话：一个会话创建变更，另一个会话审查输出、验证要求并检查差异。 |
| 连接器 | 使用可用的 MCP 服务或外部工具提供更多上下文和能力。 |

<a id="week-one-daily-triage-example"></a>
### 第一周每日问题分诊示例

Gemini CLI 每日问题分诊循环：

1. 从仓库根目录启动 Gemini CLI。
2. 读取 `STATE.md.example`。
3. 审查待处理的问题分诊项。
4. 只更新问题分诊部分。
5. 第一周不要编辑源文件。
6. 保存更新后的状态，供下次运行使用。

<a id="official-documentation"></a>
### 官方文档

https://github.com/google-gemini/gemini-cli

<a id="appendix-amazon-q-developer-cli"></a>
## 附录：Amazon Q Developer CLI

Amazon Q Developer CLI（`q chat`）是 AWS 原生、基于终端的智能体，支持自定义智能体配置文件和 MCP。将相同的循环原语映射到 `q chat`、自定义智能体配置、上下文资源和外部调度器。

| 原语 | Amazon Q Developer CLI 映射 |
|-----------|--------------------------------|
| 调度 | 没有原生的 cron 风格调度器。使用外部调度器（cron、systemd timer、GitHub Actions）以非交互方式调用 `q chat`，或使用 `q chat --resume` 在下一次计划运行时继续每个目录中已保存的对话。 |
| 规则／上下文文件 | 在 `.amazonq/agents/<name>.json`（项目）或 `~/.aws/amazonq/cli-agents/<name>.json`（个人）中定义自定义智能体，并在其 `resources` 字段中列出始终生效的上下文（例如 `file://STATE.md`、`file://.amazonq/rules/**/*.md`）。使用 `hooks.agentSpawn` 在会话启动时注入最新上下文（例如 `git status`）。 |
| 状态 | 将 `STATE.md` 保存在仓库根目录，并在自定义智能体的 `resources` 字段中引用，以便每个会话都加载该文件；每次运行都应先读取，然后只更新相关部分。 |
| 执行者／检查者分工 | 没有原生的子智能体／审查者原语。变通方案：定义两个自定义智能体（例如，带写入工具的 `daily-triage.json`，以及仅限使用 `fs_read`/`@git` 的 `loop-verifier.json`），并在独立的 `q chat --agent loop-verifier` 会话中运行验证智能体来审查差异。 |
| 连接器 | 在 `.amazonq/mcp.json`（项目）或 `~/.aws/amazonq/mcp.json`（全局）中配置 MCP 服务；通过 `allowedTools` 为每个智能体限定工具信任范围。请谨慎对待不受信任仓库中的工作区 `.amazonq/mcp.json` 文件——打开前先审查，因为自动加载的 MCP 配置确实曾成为这类工具的攻击途径。 |
| 客观不足 | 没有一等调度器，没有内置的执行者／检查者分工，也没有专用的状态文件约定——与大多数不含专用循环调度器的终端智能体相同，这些都是叠加在 `q chat` 之上的手动约定。 |

最小迁移方案：

```bash
mkdir -p .amazonq/agents .amazonq/rules
cp templates/SKILL.md.loop-triage .amazonq/rules/loop-triage.md
cp starters/minimal-loop/STATE.md.example STATE.md
```

`.amazonq/agents/daily-triage.json`:

> 中文说明：以下配置包含供智能体执行的原始英文指令及机器可读字段，为避免语义漂移保持不变

```json
{
  "name": "daily-triage",
  "description": "Report-only daily triage agent",
  "prompt": "Run loop-triage. Update STATE.md with High Priority and Watch List only. Do not edit source code in week one.",
  "tools": ["fs_read", "fs_write"],
  "resources": [
    "file://STATE.md",
    "file://.amazonq/rules/loop-triage.md"
  ]
}
```

<a id="week-one-daily-triage-prompt-report-only-copy-paste"></a>
### 第一周每日问题分诊提示词（仅报告，可复制粘贴）

> 中文说明：以下命令包含供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
q chat --agent daily-triage --no-interactive \
  "Run loop-triage. Read STATE.md first. Update only High Priority and Watch List sections. Do not edit source code in week one."
```

后续 L2 工作的验证步骤——使用独立的只读作用域智能体：

> 中文说明：以下命令包含供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
git diff > diff.patch
q chat --agent loop-verifier --no-interactive \
  "Act as loop-verifier. Review diff.patch against STATE.md goals. Report PASS/FAIL and do not edit files."
```

复制后：在 Q 提供一等循环调度器之前，将调度映射到 cron/systemd/GitHub Actions。使用 `.amazonq/rules/` 保存始终生效的仓库指导，使用独立的自定义智能体实现执行者／检查者分工，并通过 `.amazonq/mcp.json` 连接外部工具。

<a id="official-documentation-1"></a>
### 官方文档

https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line.html
