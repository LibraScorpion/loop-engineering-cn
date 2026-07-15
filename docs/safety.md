<a id="safety--guardrails"></a>
# 安全与护栏

循环会放大判断，无论好坏。对于会接触代码或外部系统的生产级循环，以下护栏是最低要求。

<a id="path-denylist"></a>
## 路径拒绝列表

未经人工批准，循环**绝不能**自动编辑以下路径：

```
.env
.env.*
**/secrets/**
**/credentials/**
**/*_key*
**/*_secret*
.terraform/**
k8s/production/**
**/migrations/**          # unless explicit migration loop
auth/**
payments/**
billing/**
```

将此规则写入 `minimal-fix` 和执行者技能中：

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

> Do not modify files matching the denylist. Escalate to human with context.

<a id="auto-merge-policy"></a>
## 自动合并策略

**默认：不自动合并。**

如果允许简单循环自动合并：

| 允许 | 不允许 |
|---------|-------------|
| 修正注释／文档中的拼写错误 | 行为变更 |
| 仅自动修复测试文件中的 lint 问题 | 依赖版本升级 |
| 调整导入顺序 | 锁文件变更 |
| 允许列表内 `docs/` 路径的配置 | 任何拒绝列表路径 |

在 `AGENTS.md` 或专用的 `loop-auto-merge-allowlist.md` 中记录允许列表。

<a id="mcp-connector-least-privilege"></a>
## MCP 连接器最小权限

| 连接器 | 读取 | 写入 |
|-----------|------|-------|
| GitHub | `issues`、`PRs`、`checks` | `comment`、`label`（默认不执行 `merge`） |
| Linear | 团队 `issues` | `comment`、`status`（不执行 `delete`） |
| Slack | 频道历史记录 | 仅 `post` 到 `#loop-escalations` |
| 数据库 | — | 禁止循环写入生产环境 |

使用独立的机器人账号／`token`，并授予最小权限范围。

<a id="human-gates-required"></a>
## 人工审核关卡（必需）

以下事项始终需要人工审核：

- 安全、身份认证、授权
- 支付、计费、PII 处理
- 基础设施／Terraform／K8s 生产环境
- 依赖升级（供应链风险）
- 涉及超过 N 个文件的变更（建议 N=10）
- 对同一事项的第三次尝试失败

<a id="secrets-in-prompts--logs"></a>
## 提示词与日志中的机密信息

- 绝不要将 API key 粘贴到调度器提示词中
- CI 日志可能包含机密信息——问题分诊技能应在写入状态前将其脱敏
- 状态文件通常会被提交——`STATE.md` 中不得包含凭据

<a id="flake--test-safety"></a>
## 偶发失败与测试安全

- 不要为了让 CI 通过而禁用测试
- 不要在未记录根本原因的情况下盲目增加超时时间
- 隔离偶发失败必须有明确的工单和人工批准

<a id="incident-response"></a>
## 事件响应

如果循环合并了有问题的代码：

1. 立即暂停所有循环（`scheduler_list` → delete）
2. 还原该合并
3. 记录到状态和 `stories/` 中
4. 重新启动前收紧验证器或缩小范围

<a id="pre-flight-safety-check"></a>
## 运行前安全检查

进入 L3（无人值守）前：

- [ ] 技能中已包含拒绝列表
- [ ] 已关闭自动合并或配置严格的允许列表
- [ ] 已审核连接器权限范围
- [ ] 模式中已记录人工审核关卡
- [ ] 已记录紧急停止开关（[operating-loops.md](./operating-loops.md)）

另请参阅 [loop-design-checklist.md](./loop-design-checklist.md)。

<a id="machine-readable-constraints"></a>
## 机器可读约束

为了在运行时强制执行，请在项目根目录的 `loop-constraints.md` 中定义约束。
`loop-constraints` 技能会在每次循环运行开始时读取此文件，并强制执行
其中的每条规则。模板：[templates/loop-constraints.md](../templates/loop-constraints.md)。

工具示例：[Grok](../examples/grok/constraints.md) · [Claude Code](../examples/claude-code/constraints.md) · [Codex](../examples/codex/constraints.md)
