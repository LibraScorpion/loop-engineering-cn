<a id="adopters--community-setups"></a>

# 采用者与社区配置

Fork 和 star 意味着有人正在自己的技术栈中尝试本项目。如果你运行了本仓库中的某个循环（或基于它改编的循环），请通过 PR 将你自己添加到这里。

**置顶：** [添加你的项目 —— Loop Ready 徽章与采用者列表](https://github.com/cobusgreyling/loop-engineering/discussions/92)（GitHub Discussions）

<a id="loop-ready-badge"></a>

## Loop Ready 徽章

在 README 中展示你的就绪度级别：

> 中文说明：以下为可直接运行的原始命令，为避免语义偏差保持不变

```bash
npx @cobusgreyling/loop-audit . --badge
```

将输出的 Markdown 粘贴到你的 README 中。当你从 L1 升级到 L2、再到 L3 后，请重新运行该命令。

<a id="how-to-list-your-project"></a>

## 如何列出你的项目

**快捷方式：** [创建“采用者登记”Issue](https://github.com/cobusgreyling/loop-engineering/issues/new?template=add-adopter.yml) —— 我们会把你的信息添加到表格中。

你也可以创建 PR，在下表中添加一行：

| 字段 | 应包含的内容 |
|-------|-----------------|
| **项目** | 仓库链接或产品名称 |
| **模式** | 例如 Daily Triage + Issue Triage |
| **工具** | Grok、Claude Code、Codex、Cursor、Windsurf、GitHub Actions 或混合使用 |
| **级别** | L1 / L2 / L3（请如实填写） |
| **备注** | 用一行说明哪些方面有效，哪些方面出了问题 |

<a id="adopters"></a>

## 采用者

| 项目 | 模式 | 工具 | 级别 | 备注 |
|---------|------------|------|-------|-------|
| [loop-engineering](https://github.com/cobusgreyling/loop-engineering)（本仓库） | Daily Triage, Changelog Drafter, audit 内部试用 | GitHub Actions + Grok | L3 | 参考实现 —— 每个 PR 都运行 `loop-audit`；就绪度得分为 100 |
| [loop-engineering](https://github.com/cobusgreyling/loop-engineering)（维护者） | Post-Merge Cleanup | Grok + GitHub Actions | L1→L2 | 在非高峰时段扫描；验证器发现了文档与 API 之间的偏差 —— 请参阅[案例](../stories/post-merge-cleanup-honest-win.md) |
| [loop-engineering](https://github.com/cobusgreyling/loop-engineering)（维护者） | Issue Triage + Daily Triage | Grok | L1 | Issue 队列输入源：第一周只提出标签建议；与每日早间的 `STATE.md` 问题分诊配合使用 |
| [loop-engineering](https://github.com/cobusgreyling/loop-engineering)（维护者） | PR Babysitter, Dependency Sweeper | Grok / Claude Code | L2 | 在 Git 工作树中进行辅助修复；合并需通过人工审核关卡；仅允许补丁版本的依赖项更新 |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent)，由 [Nous Research](https://nousresearch.com) 提供 | Daily Triage | Hermes | L1 | 在一个二进制文件中集成六种循环原语 —— `hermes cron` + 技能 + `delegate_task` + MCP + 记忆。参考：[examples/hermes/daily-triage.md](../examples/hermes/daily-triage.md) |

*欢迎在此添加你的项目 —— 请参阅 [CONTRIBUTING.md](../CONTRIBUTING.md)。*

<a id="show--tell"></a>

## 展示与分享

更愿意先交流而不是提交 PR？请在 [GitHub Discussions → 展示与分享](https://github.com/cobusgreyling/loop-engineering/discussions/categories/show-and-tell) 中发帖，并包含以下内容：

1. 你选择的模式及原因
2. 你的第一条 `/loop` 或调度器命令
3. 一个出乎意料的发现（无论好坏）

失败报告也同样重要 —— 请参阅 [stories/](../stories/)。
