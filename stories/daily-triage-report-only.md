<a id="daily-triage--report-only-onboarding"></a>
# Daily Triage：仅报告模式入门

<a id="context"></a>
## 背景

团队希望每天早上都能了解情况，但又不想在第一天就冒自动编辑的风险。

<a id="setup"></a>
## 前置设置

- [minimal-loop 启动模板](../starters/minimal-loop/)
- `/loop 1d`——仅进行问题分诊，不使用子智能体
- 由人工一边喝咖啡，一边阅读 `STATE.md`

<a id="week-1-results"></a>
## 第一周结果

- 5/5 个工作日：`STATE.md` 与值班人员手动排查所得结果一致
- 出现 2 个误报：Dependabot 被归入高优先级，因此我们调整了问题分诊技能中的 `Noise` 章节
- 用于执行者／检查者的 token 消耗为 0

<a id="graduation-to-l2"></a>
## 升级到 L2

在连续稳定运行 10 次后：

1. 添加 `minimal-fix` 和 `loop-verifier` 技能
2. 增加严格规则（仅允许处理单文件测试失败）：

   > 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变
   >
   > `single-file test failures only`

3. 第一个自动创建的 PR 在 8 分钟内获得人工 LGTM 并合并

<a id="lesson"></a>
## 经验总结

仅报告模式并不是浪费时间，而是在校准问题分诊。跳过 L1，循环就容易落下“噪声太多”的名声。
