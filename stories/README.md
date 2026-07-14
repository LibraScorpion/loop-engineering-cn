# <a id="production-stories"></a>生产环境实践故事

来自真实场景的循环工程实践——也包括失败案例。欢迎按照[贡献指南（`CONTRIBUTING.md`）](../CONTRIBUTING.md)提交你的故事。

| 故事 | 模式 | 核心启示 |
|-------|---------|----------|
| [PR Babysitter：第一周（`pr-babysitter-week-one.md`）](./pr-babysitter-week-one.md) | PR Babysitter | 状态 + 尝试次数上限 + 验证器 |
| [Daily Triage：仅报告模式入门（`daily-triage-report-only.md`）](./daily-triage-report-only.md) | Daily Triage | 先 L1，后 L2 |
| [为什么我们在第 4 天停用了 CI Sweeper（`why-we-killed-ci-sweeper.md`）](./why-we-killed-ci-sweeper.md) | CI Sweeper | 预算、分支允许列表、紧急停止开关 |
| [Dependency Sweeper 第一周：补丁量与验证器谎言（`dependency-sweeper-week-one.md`）](./dependency-sweeper-week-one.md) | Dependency Sweeper | 验证器必须与 CI 安装路径一致 |
| [多循环冲突：CI Sweeper 与 PR Babysitter 在 PR #318 上的碰撞（`multi-loop-collision.md`）](./multi-loop-collision.md) | Multi-loop | 分支锁 + 冲突检测 |
| [多循环优先级冲突：Dependency Sweeper 与 CI Sweeper（`dependency-vs-ci-sweeper-collision.md`）](./dependency-vs-ci-sweeper-collision.md) | Multi-loop | CI 预检 + 优先级锁 |
| [L1 → L2 升级：我们何时启用了自动修复（`l1-to-l2-graduation.md`）](./l1-to-l2-graduation.md) | Daily Triage | 自动修复前先校准 |
| [Changelog Drafter：第一周（L1 仅起草）（`changelog-drafter-week-one.md`）](./changelog-drafter-week-one.md) | Changelog Drafter | 低风险、高 ROI 的 L1 成果 |
| [Post-Merge Cleanup：不付照看成本的小胜利（`post-merge-cleanup-honest-win.md`）](./post-merge-cleanup-honest-win.md) | Post-Merge Cleanup | 非高峰时段运行；验证器发现文档/API 偏移；机器人合并噪声 |
| [量化交易循环：验证器问题（`quant-loop-the-verifier-problem.md`）](./quant-loop-the-verifier-problem.md) | 量化研究（领域） | 对回测而言，数值检查器优于以 LLM 充当验证器 |
| [量化循环（第二部分）：通过研究仍然失败的策略（`quant-loop-out-of-time.md`）](./quant-loop-out-of-time.md) | 量化研究（领域） | 策略通过了研究阶段，却未通过时间外数据检验 |
| [KY 切面：生成与后果（`ky-cut-surface-generation-vs-consequence.md`）](./ky-cut-surface-generation-vs-consequence.md) | 哲学 → 循环的桥梁 | 生成 ≠ 后果；保留切面 |

**新故事模板：**

> 中文说明：以下章节标题属于故事提交协议，请保留英文原文。对应含义为：标题与背景、前置设置、有效做法、出错环节、指标（如有）和经验总结。

```markdown
# Title — Context
## Setup
## What Worked
## What Broke
## Metrics (if any)
## Lesson
```
