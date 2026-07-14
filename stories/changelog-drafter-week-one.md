<a id="changelog-drafter--week-one-l1-draft-only"></a>

# Changelog Drafter：第一周（仅 L1 草稿）

<a id="setup"></a>

## 前置设置

- 参考项目中新增了该模式和入门套件。
- 每天通过 `/loop 1d` 运行（未来也可使用定时 Action）。
- 目标：根据近期合并生成 `RELEASE_NOTES_DRAFT.md`。任何发布操作前都由人工审核。

<a id="what-worked"></a>

## 有效做法

- `changelog-scan` 快速生成了一份简洁、可引用的 PR 与直接提交清单。
- `draft-release-notes` 首次尝试就生成了分类清晰的输出（Features / Fixes / Breaking 均被正确突出）。
- 状态文件（`changelog-drafter-state.md`）让人能轻松确认时间窗口以及已审核的内容。

<a id="what-broke--needed-tuning"></a>

## 出现的问题／需要调优的地方

- 初稿包含了过多内部 chore PR（Dependabot 噪声）。通过在扫描技能中强化“ignore bot + pure deps”规则解决了该问题。
- 与以往手工编写的说明相比，语气略显干涩。因此在 `AGENTS.md` 中增加了一小段“Release voice”，现在草拟器会读取它。
- 有一项破坏性变更未被显著呈现。verifier 技能发现了它，并强制将它移到顶部以警示框突出显示。

<a id="metrics-first-5-runs"></a>

## 指标（前 5 次运行）

- 每个时间窗口的平均条目数：11
- 每份草稿的人工审核时间：~4 分钟（从零编写时需 ~15–20 分钟）
- 草稿中的误报（不应公开的条目）：第一周为 2 条 → 调整规则后为 0 条
- verifier 通过后，破坏性变更／安全相关条目始终能被正确突出

<a id="lesson"></a>

## 经验总结

Daily Triage 之后，Changelog Drafter 是最容易上手的循环之一。它的杠杆效应很大（每位用户都会看到输出），风险很低（只读取并提出建议），还能推动 conventional commits 和标签管理保持良好规范。

此参考项目的下一步：将其接入发布流程，使其能在发布周实际提出 CHANGELOG PR（须经人工审批关卡），并作为发布流程的一部分运行。

完整模式见 `patterns/changelog-drafter.md`，入门套件见 `starters/changelog-drafter/`。
