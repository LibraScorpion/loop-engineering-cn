<a id="dependency-sweeper-loop"></a>

# 依赖清扫循环（Dependency Sweeper Loop）

**目标**：发现过时或存在漏洞的依赖项，应用最小且安全的更新，在隔离环境中通过测试／构建进行验证，并将所有有风险的事项（`major` 版本升级、破坏性变更或高严重性漏洞）上报给人工处理。

<a id="scheduling"></a>

## Scheduling（调度）

**建议配置**：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

- Grok：`/loop 6h dependency-sweeper`（或在工作时间内每天运行）
- Claude Code：`/loop 12h /sweep-deps` + `/goal keep the dependency surface clean and green`
- Codex：安排自动化任务，每 4-12h 运行一次问题分诊（triage）+ `minimal-fix` 流程
- GitHub Actions：Dependabot + 定时或 `workflow_dispatch` 清扫任务（参见 `examples/github-actions/` 中的模式）

Dependabot 或 OSV 发出警报后应提高运行频率。进入 `major` 版本发布周期时应降低频率或暂停运行。

<a id="required-skills"></a>

## Required Skills（必需技能）

- `dependency-triage` — 解析锁文件／软件包清单，按风险对更新进行分组（`patch`／`minor`／`major` + 已知 CVE），并生成简短、可执行的列表，其中包含建议的下一版本及理由。
- `minimal-fix` — 应用尽可能小的变更（通常仅升级版本并更新锁文件），不做其他改动。
- `loop-verifier`（或项目测试脚本）— 在干净的 Git 工作树中运行项目的测试／构建／lint，并确认变更未引入回归。

<a id="state"></a>

## 状态（State）

文件名：`dependency-sweeper-state.md`

以紧凑列表记录进行中的更新、上一次操作和人工决策：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
- package.json (lodash): 4.17.21 → 4.17.21 (CVE-2021-23337) — applied patch, tests green
  Last: 2025-06-09T09:12Z
  Human: approved minor for express (was on denylist for this sprint)
- (resolved) react: minor bump — merged
```

每次运行时移除已合并／已关闭的条目。

<a id="how-the-loop-runs-typical-cycle"></a>

## 循环如何运行（典型周期）

1. 扫描软件包清单、锁文件以及所有安全公告（Dependabot、OSV、`npm audit` 等）。
2. 将更新归类为 `safe`（`patch + no CVE`，即 `patch` 且无 CVE）、`cautious`（`minor`）和 `high-risk`（`major` 或高严重性 CVE）。
3. 对于 `safe` 项：创建 Git 工作树，通过 `minimal-fix` 技能应用最小版本更新及锁文件更新，再运行验证器（测试 + 构建）。
4. 如果验证通过 → 创建或更新一个小型 PR（若依赖分支允许，也可提交 commit），并记录到状态文件中。
5. 对于 `cautious`／`high-risk` 项 → 加入状态文件并附上明确的 `needs human` 标记和上下文（变更日志差异摘要、CVE 链接）。
6. 更新状态文件，并（可选）在未关闭的依赖更新 PR 下留言。
7. 下一次运行时，重新评估未关闭事项，并关闭过期或存在冲突的事项。

<a id="verification-strategy"></a>

## 验证策略

- **绝不**让负责实施的子智能体自行宣告成功。
- 始终在隔离的 Git 工作树中运行验证器子智能体（或明确运行 `npm test && npm run build`）。
- 循环只提出变更或 PR。实际合并由人工（或针对 `known-safe patches` 的 allowlist）完成。
- 对于安全更新，优先选择能够解决安全公告的最小 `patch`。

<a id="human-handoff-points"></a>

## 人工交接点

- 任何 `major` 版本升级，或一次改动中触及 > N 个软件包的锁文件变更。
- 等级为 `high` 或 `critical` 的 CVE（即使已有 `patch`）。
- 位于显式 denylist 中的软件包（身份验证、支付、核心基础设施、大型内部 monorepo 软件包）。
- 同一依赖经过 N 次自动化尝试仍无进展。
- 验证器 Git 工作树中的测试或类型检查失败。

<a id="tool-specific-notes"></a>

## 特定工具说明

**Grok Build TUI**：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

- 使用 `/loop 6h Run dependency-triage. For safe patches create minimal PRs in worktrees. Never auto-merge majors or CVEs above medium.`
- 与调度器和 Git 工作树原语配合使用。

**Claude Code**：

- Boris-style 循环非常适合此场景：一个循环负责发现／问题分诊，子智能体负责最小版本升级 + 验证。

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

- 使用 `/goal` 保持目标 `dependency surface clean with no high sev vulns and < 5 open minor updates`。

**GitHub Actions / Dependabot**：

- 让 Dependabot 创建 PR。清扫任务随后负责“对 Dependabot PR 进行问题分诊；若机器人的 PR 受阻，则应用最小的额外修复；执行 rebase；并针对高风险事项提醒相关人员进行审查”。
- 示例工作流位于 `examples/github-actions/`。

**Codex**：

- 安排一个周期性 Codex 任务，针对 `package.json` + `package-lock.json` 运行问题分诊技能，并生成状态更新和建议差异。

<a id="failure-modes--mitigations"></a>

## 失效模式与缓解措施

| 失效模式 | 缓解措施 |
|---------|------------|
| 循环应用了一个 `safe` 更新，却破坏了生产环境中的构建 | 在 Git 工作树中使用可靠的验证器 + 若无显式 allowlist，绝不自动合并任何内容 + 任何超出 `patch` 的更新都须人工审查。 |
| 无限更新震荡（A 依赖 B，而 B 又还原变更） | 每个软件包在每 24h 内限制尝试次数。在状态文件中记录上一次尝试的版本。尝试 2 次后上报。 |
| 安全补丁在其他位置引入新漏洞 | 变更后，验证器应包含 `npm audit`（或等效工具）。 |
| 更新一次触及数十个传递依赖项 | 视为 `high-risk`。在 `minimal-fix` 步骤中只改动直接依赖项。 |
| 通知过多 | 仅针对状态文件 `needs human` 章节中的事项通知人工。其他事项保持静默或按日汇总。 |

<a id="cost-profile"></a>

## 成本概况

| 场景 | 每次运行的 token | 说明 |
|----------|------------|-------|
| `No-op`（无操作，无须升级） | ~5k | 扫描无异常时退出 |
| `Triage / scan`（问题分诊／扫描） | ~60k | 审计 + Dependabot + 锁文件扫描 |
| `Patch + verify`（L2） | ~300k | Git 工作树 + 完整测试套件 |

**运行节奏**：6h–1d · **层级**：medium · **建议每日上限**：500k token

> 中文说明：以下 Shell 命令保持原样

```bash
npx @cobusgreyling/loop-cost --pattern dependency-sweeper --level L2
```

验证器运行（`npm ci && npm test`）占据主要成本，因此需要在 `loop-budget.md` 中限制每个软件包的尝试次数。

<a id="success-metrics"></a>

## 成功指标

- 从“漏洞发布／Dependabot PR 创建”到完成合并的时间中位数（针对循环处理过的事项）。
- 仍未解决时间 > 48h 的 `high`／`critical` 漏洞数量（目标接近于零）。
- 完全符合 `LGTM, loop handled the bump + verified` 的依赖更新 PR 百分比。
- Slack/Linear 中“能升级一下 X 吗？”消息的减少量。

先在单个仓库中只处理 **`patch-level only` + 已知 CVE 修复**，持续 1-2 周。只有在信任验证器后，才扩展到 `minor`。`major` 和破坏性变更应长期保留人工审核关卡。
