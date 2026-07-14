<a id="pr-babysitter--week-one-example-story"></a>
# PR Babysitter——第一周（示例故事）

*供贡献者参考的匿名化生产环境风格叙事。请通过 PR 将其替换为你的真实指标。*

<a id="context"></a>
## 背景

- 4 人团队、单体仓库（monorepo），使用 Grok Build TUI + GitHub
- 痛点：Slack 上每天会收到 10–15 次“能 rebase 一下吗？”和“CI 挂了”的提醒

<a id="setup"></a>
## 配置

- 模式：[pr-babysitter](../patterns/pr-babysitter.md)
- 运行节奏：工作时间内执行 `/loop 5m`
- L2 辅助模式：minimal-fix + loop-verifier，不自动合并

<a id="what-worked"></a>
## 有效做法

- **状态文件**（`pr-babysitter-state.md`）阻止了重复的修复尝试——尝试次数计数器很重要
- 更强模型上的验证器在发布 PR 评论前发现了 2 处范围过大的差异
- 循环评论带有签名 `🤖 Loop Engineering — PR Babysitter`——审核者知道哪些内容可信

<a id="what-broke"></a>
## 出现的问题

- **第 3 天**：不稳定的端到端测试触发了无限修复循环——循环尝试修改代码 4 次后，才由人工停止调度器
  - **修复**：在问题分诊中增加偶发失败分类；提示词强制规定最多尝试 3 次
- **第 5 天**：通知疲劳——即使没有任何变化，机器人也会在每次运行时发表评论
  - **修复**：仅当判定为 APPROVE 或 ESCALATE_HUMAN 时发表评论

<a id="metrics-week-1"></a>
## 指标（第一周）

| 指标 | 之前 | 之后 |
|--------|--------|-------|
| Slack CI/rebase 提醒 | 约 12 次/天 | 约 4 次/天 |
| 首个修复提案的平均等待时间 | 数小时 | 约 25 分钟 |
| 循环导致的错误合并 | 0 | 0 |

<a id="lesson"></a>
## 经验

先进行 3 天仅观察状态的运行，之后才能启用 L2。循环无法自行区分偶发失败和回归——你需要在技能中教会它。
