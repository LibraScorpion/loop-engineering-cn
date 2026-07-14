# 简体中文术语表

本表用于统一仓库中的简体中文译法。正文首次出现术语时，可采用“中文（English）”；后文使用中文。机器可读内容、可执行指令和代码中的 token 按文末规则保留原文。

## 核心术语

| 英文 | 推荐译法 | 保留英文规则与备注 |
| --- | --- | --- |
| Loop Engineering | Loop Engineering（品牌）；循环工程（概念） | 指项目、仓库或品牌名称时不翻译；泛指方法论时译为“循环工程”，首次出现可附英文。 |
| loop | 循环 | 指一般工作循环时翻译；命令、标识符、路径及 `/loop ...` 中保留 `loop`。 |
| coding agent | 编码智能体 | 首次出现可写“编码智能体（coding agent）”。 |
| agent harness | 智能体运行框架 | 强调具体实现或便于检索时，首次出现保留 `agent harness`。 |
| prompt | 提示词 | 解释性正文可翻译；可复制、可执行的 agent prompt 或指令块保持英文原文。 |
| token | token | 技术正文中保留英文，组合为“token 成本”“token 预算”“token 用量”，不要译为“令牌”；命令、字段和标识符仍保持原样。 |
| orchestration | 编排 | 特指智能体协作时可写“智能体编排”。 |
| primitive | 原语 | `primitive` 作为字段、ID、路径或代码标识符时不翻译。 |
| worktree | Git 工作树 | `git worktree` 命令、路径和代码示例保持原文。 |
| skill | 技能 | 首次出现可写“技能（skill）”；技能名、`SKILL.md` 及其中的机器指令不翻译。 |
| connector | 连接器 | 产品或插件中的正式名称不翻译；首次出现可附 `connector`。 |
| MCP | MCP | 缩写不翻译；解释性正文可写“MCP 连接器”或“MCP 服务”。 |
| sub-agent | 子智能体 | 代码、配置字段和正式角色名中的拼写保持原文。 |
| maker/checker | 执行者／检查者 | 作为模式名或标识符时保留 `maker/checker`；正文首次出现可中英并列。 |
| triage | 问题分诊 | 命令、技能名（如 `loop-triage`）和标识符不翻译。 |
| readiness | 就绪度 | 表达状态时也可按语境译为“就绪”；指标名和字段名保留原文。 |
| guardrail | 护栏 | 指安全或流程限制；代码、配置和正式名称中保留原文。 |
| state | 状态 | 文件名、字段名和代码标识符不翻译，例如 `STATE.md`。 |
| memory | 记忆 | 指智能体持久上下文时使用；文件名、字段名和代码标识符不翻译。 |
| human gate | 人工审核关卡 | 强调批准动作时可译为“人工审批关卡”；模式名和 ID 保留英文。 |
| report-only | 仅报告 | 表示只生成报告、不实施修改；选项、模式值和 ID 不翻译。 |
| assisted fixes | 辅助修复 | 表示在人工监督下实施修复；模式值和 ID 不翻译。 |
| unattended | 无人值守 | 指无需持续人工操作；配置值和模式名不翻译。 |
| circuit breaker | 熔断器 | 首次出现可写“熔断器（circuit breaker）”；代码标识符不翻译。 |
| kill switch | 紧急停止开关 | 首次出现可附英文；正式控件名、命令和代码标识符不翻译。 |
| cadence | 运行节奏 | 侧重频率时可按语境译为“执行频率”。 |
| failure mode | 失效模式 | 标题或解释性正文中翻译；模式 ID 不翻译。 |
| anti-pattern | 反模式 | 首次出现可写“反模式（anti-pattern）”；正式模式名或 ID 保留英文。 |

## 永不翻译的 token

| 类型 | 规则 | 示例 |
| --- | --- | --- |
| 命令及子命令 | 保持原样，包括斜杠命令和 shell 命令 | `/loop ...`、`git worktree`、`npm run build` |
| 命令选项 | 保持拼写、大小写和连字符不变 | `--suggest`、`--help` |
| 包名 | 保持原样 | `@cobusgreyling/loop-audit` |
| 文件名与路径 | 保持原样；可翻译其外围说明 | `AGENTS.md`、`LOOP.md`、`tools/loop-audit/` |
| 等级 | 保持 `L0`、`L1`、`L2`、`L3` 不变 | `L0-L3` |
| pattern IDs | 保持注册表中的精确值，不改大小写或分隔符 | 以 `patterns/registry.yaml` 为准 |
| 产品名 | 使用官方拼写，不造中文名称 | GitHub、Codex、Node.js |
| JSON/YAML keys | key 保持原样；枚举值及其他机器可读值也不翻译 | `report_only: true` |
| 代码标识符 | 变量、函数、类、环境变量和 API 字段保持原样 | `LOOP_LANG` |
| URL 与锚点 | 不修改 URL；已有锚点必须保持可用 | `https://github.com/...` |
