<a id="ci-sweeper--the-infinite-flaky-test-loop"></a>

# CI Sweeper——无限不稳定测试循环

<a id="setup"></a>

## 背景

- **模式：** CI Sweeper
- **工具与运行节奏：** GitHub Actions（每当 `main` 构建失败时触发）

<a id="what-worked"></a>

## 有效之处

CI Sweeper 成功检测到 `main` 上的 CI 失败，并立即提出了一项有效的代码修改：延长 `e2e/third-party/` 目录中测试的超时时间。

<a id="what-broke"></a>

## 出错之处

根本问题是第三方 API 不稳定，而不仅是简单的超时。
当 sweeper 创建修复 PR 后，CI 针对该 PR 运行，却因完全相同的不稳定问题再次失败。接着，sweeper 又启动了*另一个*循环来修复它自己提出的修复。最终，它在整个周末提出了 30+ 个迭代 PR，只是不断增大 `setTimeout` 的值。我们不得不手动禁用 GitHub Actions 工作流才将其停止。

<a id="metrics"></a>

## 指标

- 一个周末内创建了 ~30 个自动化 PR。
- 在无谓追查问题上浪费了不必要的 token 成本和 CI 算力。

<a id="lesson"></a>

## 教训

如果没有严格的每日运行次数上限，绝不能让 CI Sweeper 针对不稳定测试自动触发。我们在 `LOOP.md` 中为 `e2e/third-party/` 添加了拒绝列表，并在整个仓库范围内设置了严格的预算上限：每天最多自动尝试修复 3 次。
