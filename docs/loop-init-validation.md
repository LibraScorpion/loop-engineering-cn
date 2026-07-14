<a id="loop-init-validation-checklist"></a>
# loop-init 验证清单

本清单用于跟踪 `npx @cobusgreyling/loop-init` 是否能为每一种 pattern × --tool
组合生成可正常使用且结构合理的脚手架。请先在全新的 git 仓库中实际运行命令，
再填写对应行 — 不要凭空猜测。

<a id="how-to-validate-a-row"></a>
## 如何验证一行

\`\`\`
mkdir <temp-folder> && cd <temp-folder>
git init
npx @cobusgreyling/loop-init . --pattern <pattern> --tool <tool>
\`\`\`

记录命令打印的 Loop Ready 分数、所创建的文件列表以及任何异常情况。以下是用于验证的
命令（Windows/PowerShell）：

\`\`\`
mkdir C:\Temp\loop-init-test
cd C:\Temp\loop-init-test
git init
npx @cobusgreyling/loop-init . --pattern daily-triage --tool claude
\`\`\`

<a id="matrix"></a>
## 矩阵

| 模式 | --tool | Loop Ready 分数 | 创建的文件 | 备注 |
|---|---|---|---|---|
| daily-triage | claude | 100/100 (L3) | `.claude/skills/loop-triage/`, `.claude/agents/loop-verifier.md`, `STATE.md`, `LOOP.md`, `loop-budget.md`, `loop-run-log.md`, `loop-constraints.md`, `.claude/skills/loop-budget/SKILL.md`, `.claude/skills/loop-constraints/SKILL.md`, `AGENTS.md` (模板) | 脚手架结构清晰，未出现错误。无需手动编辑便立即获得 100/100 分。 |
| daily-triage | grok | | | |
| daily-triage | codex | | | |
| daily-triage | opencode | | | |
| ci-sweeper | claude | | | |
| ci-sweeper | grok | | | |
| ci-sweeper | codex | | | |
| ci-sweeper | opencode | | | |

空白行留给其他贡献者填写 — 参见 #231。
