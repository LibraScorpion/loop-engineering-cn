<a id="dependency-sweeper-week-one--patch-volume-and-a-verifier-lie"></a>

# Dependency Sweeper 第一周——补丁量与验证器谎言

<a id="setup"></a>

## 配置

- 模式：Dependency Sweeper（L2 仅补丁）
- 运行节奏：`/loop 6h`
- 拒绝列表：`react`、`@company/core-auth`
- 验证器：在隔离的 Git 工作树中运行 `loop-verifier`

<a id="what-worked"></a>

## 有效做法

- 针对 lodash 间接依赖 CVE 的补丁升级在 4 小时内完成并关闭相关事项，全程无需人工介入
- 状态文件清楚呈现了哪些任务正在处理中、哪些任务正等待人工操作
- 拒绝列表避免了在发布冻结期贸然升级 React 次版本

<a id="what-broke"></a>

## 出现的问题

- 第 3 天：验证器对一个 `express` 补丁给出 APPROVED，但**没有运行** `npm ci`——只运行了 `npm test`，而后者使用了缓存的 `node_modules`
- 该 PR 的 CI 因验证器漏掉的对等依赖冲突而失败
- 第 4 天：循环在一次运行中创建了 3 个补丁 PR——造成审核者疲劳

<a id="metrics"></a>

## 指标

| 指标 | 第 1 周 |
|--------|--------|
| 已创建的补丁 PR | 11 |
| 人工合并 | 7 |
| 验证器错误给出 APPROVE | 1 |
| token 估算 | ~800k |

<a id="lesson"></a>

## 教训

仅补丁并非“零风险”。验证器必须采用**与 CI 相同的安装路径**（运行 `npm ci`，而不能只运行 `npm test`）。应限制每天自动创建的 PR 数量（我们已在 LOOP.md 中将上限设为 5）。一次错误的 APPROVE 所耗费的人工时间，超过了手动处理一周补丁所需的时间。
