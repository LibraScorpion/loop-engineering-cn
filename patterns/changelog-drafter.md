<a id="changelog-drafter-loop"></a>

# Changelog Drafter Loop（变更日志草拟循环）

**Goal（目标）**：扫描自上次发布以来（或按固定运行节奏）的已合并 PR、提交和标签，生成高质量、已分类的 release notes 或 CHANGELOG 条目草稿。发布这些说明或正式创建 release 前，须由人工审核并批准。

<a id="scheduling"></a>

## Scheduling（运行调度）

**Recommended（建议）**：
- 对于活跃项目，每天早晨或日终运行 `/loop 1d`
- 准备 release 时：手动触发，或通过 tag webhook / GitHub Action（`on: [release, workflow_dispatch]`）触发
- 对更新较慢的项目，每周运行一次

这是非常适合在“非高峰时段”或“sprint 结束时”运行的循环。与 CI 或 PR babysitter 相比，其紧迫性较低。

<a id="required-skills"></a>

## Required Skills（必需技能）

- `changelog-scan` — 发现近期的合并、PR 和提交，提取标题、标签、关联 issue 及 breaking-change 信号，并生成结构化列表。
- `draft-release-notes` — 根据扫描结果和项目约定，生成清晰、面向用户的 release notes（分类保持为 Features、Fixes、Breaking、Security、Docs 等）。
- `loop-verifier`（或人工审核）— 检查草稿的准确性、语气、完整性，以及是否符合项目风格。绝不能让草拟者评判自己的输出。

<a id="state"></a>

## State（状态）

文件名：`changelog-drafter-state.md`

该文件简要记录已扫描的内容和等待审核的草稿。

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```markdown
# Changelog Drafter State

Last run: 2026-06-09 18:30 UTC
Last release: v2.14.0 (tag 2026-06-01)

## Pending Drafts
- v2.15.0-rc (unreleased)
  Items scanned: 17 PRs + 4 direct commits
  Draft location: RELEASE_NOTES_DRAFT.md (or PR body)
  Status: ready for human review

## Recently Published
- v2.14.0 — published 2026-06-01 (reviewed by @cobus)
```

release 被加上 tag 或发布，且草稿已纳入 release 后，循环应清理相应条目。

<a id="how-the-loop-runs-typical-cycle"></a>

## How the Loop Runs (Typical Cycle)（循环如何运行：典型周期）

1. 确定扫描时间窗口（上一个 tag、状态中记录的上次运行日期，或最近 N 天）。
2. `changelog-scan` 列出合并到 main 的 PR 和值得关注的直接提交，并提取 conventional commit 类型、标签（如 `breaking`、`security`）及关联 issue。
3. 将条目归入标准章节（Features、Bug Fixes、Performance、Breaking Changes、Security、Documentation、Internal / Chores）。
4. `draft-release-notes` 编写经过润色的 Markdown 草稿，包括链接、对贡献者的致谢，并在升级说明明确时将其写入。
5. verifier（或人工）审核草稿，重点检查：
   - 准确性（不得虚构功能）
   - 完整性（不得遗漏影响重大的条目）
   - 语气和项目风格
6. 批准后：循环可以开启一个更新 `CHANGELOG.md`（或 GitHub release body）的 PR，也可以只把草稿留在文件中，供维护者复制。
7. 记录本次运行，在状态中将条目标记为 `published`，并清理旧条目。
8. 在状态中记录运行后复盘：遗漏项目、误报、分组问题、重试情况，以及供下次运行采用的提示词／策略调整。

<a id="post-run-critique"></a>

## Post-Run Critique（运行后复盘）

人工审核草稿后，由人工审核者或操作者记录上一次运行遗漏或错误分类的内容，以便改进下一次运行。这些记录用于保留上一次草稿运行的审核发现。

在状态文件的 `## Post-Run Critique` 标题下记录：

- **Missed items**（遗漏项目）— 用户报告但草稿未包含的变更
- **False positives**（误报）— 草稿中本不应面向用户的条目（chores、仅涉及基础设施的变更）
- **Grouping issues**（分组问题）— 被放入错误章节的条目（例如，将修复项放入 Features）
- **Retries**（重试）— 修改或重新生成草稿的次数（以及原因）
- **Prompt/policy adjustments**（提示词／策略调整）— 对扫描、草拟或 verifier 技能指令做出的 1–2 项具体调整，供下次运行使用

这是可选项，但建议在 L1 dogfood 运行期间采用。即使只是偶尔记录复盘条目，也有助于防止问题重复发生。

<a id="verification-strategy"></a>

## Verification Strategy（验证策略）

- 草拟者绝不发布内容，只提出草案。
- 草稿必须由独立的 verifier 技能（或人工）批准。
- 对于自动更新 CHANGELOG 的 PR：该 PR 必须通过项目的常规审核关卡（或被明确加入此循环的 allowlist）。
- 前几次运行及任何包含 breaking changes 的 release，优先安排人工审核。

<a id="human-handoff-points"></a>

## Human Handoff Points（人工交接点）

- 任何 breaking change 或安全说明
- 主版本升级
- 有大量市场推广或外部沟通需求的 release
- 循环生成后超过 N 天仍未经人工审核的草稿
- 扫描窗口包含 > ~50 个条目时（单个 release 无法容纳，应拆分或由人工筛选）

<a id="tool-specific-notes"></a>

## Tool-Specific Notes（特定工具说明）

**Grok Build TUI**:

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
/loop 1d Run changelog-scan on merges since last tag or last state date. Produce a categorized draft in RELEASE_NOTES_DRAFT.md using draft-release-notes. Update changelog-drafter-state.md. Do not commit/publish without human approval.
```

**Claude Code**:

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```bash
/loop 1d Scan recent merges and draft release notes. Write draft to RELEASE_NOTES_DRAFT.md + update state. Flag breaking/security items for review.
```

**Codex**:
- 自动化：每日运行名为 "Changelog Drafter" 的任务，调用扫描和草拟技能，并将草稿发布到 Triage inbox 或专用的 release-prep issue。

**GitHub Actions**:
- 参阅 `examples/github-actions/` 中的工作流；它可在 push 到 main 时或通过 `workflow_dispatch` 触发，并可将草稿作为评论发布到 release tracking issue，或创建 draft PR。

<a id="failure-modes--mitigations"></a>

## Failure Modes & Mitigations（失效模式与缓解措施）

| Failure（失效） | Mitigation（缓解措施） |
|---------|------------|
| 虚构功能或归属错误 | verifier 依据实际 PR 标题和提交消息交叉核对每个条目。状态记录来源 PR。 |
| 遗漏重要变更 | 同时扫描 PR *和* main 上的直接提交。使用标签和 conventional commits。 |
| 说明过长或内容嘈杂 | 在草拟技能中采用严格分类和 "user-facing only" 规则。人工可以删减。 |
| 语气与项目不符 | 在 AGENTS.md 中提供简短的 "Release voice" 章节，或提供供草拟者读取的项目技能。 |
| 意外发布 | 若没有明确的人工审核关卡和 PR，绝不授予循环对 tag 或正式 CHANGELOG 的写入权限。 |
| 复盘过时或始终无人审核 | 当未解决的复盘条目累积并超过阈值（例如 3 次运行）时，增加人工交接。 |

<a id="cost-profile"></a>

## Cost Profile（成本概况）

| Scenario（场景） | Tokens/run | Notes（说明） |
|----------|------------|-------|
| No-op（无新合并） | ~5k | 如果上一个 tag 之后没有新内容，则退出 |
| 扫描并分类 | ~35k | 扫描 PR/commit |
| 草拟并验证 | ~80k | 已分类的 release notes 草稿 |

**Cadence（运行节奏）**：1d · **Tier（层级）**：low · **Suggested daily cap（建议每日上限）**：100k tokens

```bash
npx @cobusgreyling/loop-cost --pattern changelog-drafter --level L1
```

这是成本最低的高价值循环之一，可安全地与其他循环同时运行。

<a id="success-metrics"></a>

## Success Metrics（成功指标）

- 从 "last merge" 到 "published release notes" 的时间（patch release 目标：< 1 天）
- 首次发布时即包含说明的 release 百分比（避免“我们又忘了更新 changelog”）
- 每个 release 所需的人工审核时间（循环学习项目风格后应当下降）
- 用户发现但说明中遗漏的“意外”条目数量（目标：接近零）

这是投资回报率最高、风险最低的循环之一。Daily Triage 稳定后，非常适合作为第二或第三个循环引入。它能直接改善每一位用户和贡献者的体验。

关于何时将其与 Post-Merge Cleanup 一同引入，请参阅[模式选择器](../docs/pattern-picker.md)。
