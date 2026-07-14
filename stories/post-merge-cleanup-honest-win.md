<a id="post-merge-cleanup--small-wins-without-the-babysitter-tax"></a>

# Post-Merge Cleanup：不付照看成本的小胜利

**模式：** [post-merge-cleanup](../patterns/post-merge-cleanup.md)<br>
**运行节奏：** 1d（非高峰时段）<br>
**工具：** Grok Build TUI + GitHub Actions 后备方案<br>
**等级：** L1 → 谨慎采用 L2（仅文档／注释）<br>
**结果：** 有用、低噪声的后续 PR——并非万能清理工

<a id="setup"></a>

## 前置设置

一个中型 SaaS 团队（12 名工程师，每周 ~40 次合并）在发布功能分支后运行 Post-Merge Cleanup。可预见的遗留项越积越多：过时的注释、只更新了一半的文档，以及没人愿意为之切换上下文的小型 lint 问题。对于已经进入 `main` 的工作，PR Babysitter 显得过于繁重。

- **循环：** 每天扫描过去 24–48h 内完成的合并
- **技能：** `post-merge-scan`、`minimal-fix`、`loop-verifier`
- **状态：** `post-merge-state.md`，按合并 SHA 记录 fixed / ticketed / ignored
- **第一周：** L1 仅报告——循环列出候选项，由人工选取两个
- **拒绝列表：** `auth/`、`payments/`，以及任何涉及公共 API 契约的内容

<a id="what-worked"></a>

## 有效做法

- 选择非高峰时段（当地时间 21:00）运行，避免与正在进行的功能开发相互干扰
- 状态文件避免连续三天重复扫描同一次合并
- 验证器发现了一项暗中修改公共 API 示例的“文档修复”
- 两名工程师在未启用 L2 自动修复的情况下，仅凭**报告本身**就获得了价值
- 第一个 L2 PR（删除过时的 TODO 注释）经人工 LGTM 后在 6 分钟内合并

<a id="what-broke"></a>

## 出错环节

**意外情况——名不副实的文档修复：** 第 4 天，循环针对 PR #892 的一次合并提出了一行 README 修正。验证器将其标记出来：示例响应体从 `{ "id": string }` 变成了 `{ "userId": number }`，与一个未记录的 API 偏移一致。执行者将其归类为“仅文档”。如果没有将验证器职责拆分出来，这项修改就会被当作无害的文档微调发布。

**机器人合并噪声：** 循环连续三天对 Dependabot 和 Renovate 的合并提交进行了过度分诊，生成了 11 个仅涉及 lockfile 的“候选项”。工程师开始忽略报告。修复方式：在状态中加入 `ignored_authors`（dependabot、renovate）和 `min_diff_lines: 3`。

**对功能开关的虚假信心：** 循环建议移除 `legacyAuth`，依据是一条 `// remove after Q2` 注释，但该开关仍在循环不可见的移动客户端（独立仓库）中被引用。人工发现了这一问题；我们在 `LOOP.md` 中加入以下规则：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变
>
> “cross-repo flags → always escalate”

<a id="metrics-4-week-pilot"></a>

## 指标（为期 4 周的试点）

| 指标 | 之前 | 采用 L1+L2 后（仅文档） |
|--------|--------|-------------------------|
| 合并 → 首次跟进的时间中位数 | 6.2 天 | 1.4 天 |
| 每周创建的后续 PR | 0–1（临时处理） | 3–5（循环提出，人工批准） |
| 误报率（人工判断） | — | ~18%（第 1 周）→ ~6%（第 4 周） |
| 工程师对“报告是否有用？”的评分（1–5） | — | 平均 4.1（截至第 3 周） |

<a id="lesson"></a>

## 经验总结

先以 L1 运行两周——报告能校准团队实际认定为债务的内容。只有文档、注释和 lint 路径才启用 L2，并使用将 API 示例视为代码的验证器。架构债务应记录在 Linear 中，而不是循环里。Post-Merge Cleanup 是 PR Babysitter 的补充，而非替代品：它在非高峰时段处理已经合入的工作。
