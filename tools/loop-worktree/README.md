# loop-worktree

为循环工程的每次尝试管理隔离的 [Git 工作树](https://git-scm.com/docs/git-worktree)。每次修复尝试使用一个工作树；当验证器拒绝修复或人工升级处理时标记该工作树；随后清理已弃用的工作树。

`LOOP.md` 和 `docs/primitives.md` 以文字描述了这一约定（“每次修复使用一个工作树；在验证器给出 REJECT 或人工升级处理后丢弃”）。本工具是该约定的代码实现：为工作树提供统一的存放位置，通过清单跟踪其状态，并使用协调器清理孤立工作树。

<a id="install--run"></a>

## 安装与运行

```bash
npx @cobusgreyling/loop-worktree create --run-id ci-sweeper-2026-07-07-01 --pattern ci-sweeper
npx @cobusgreyling/loop-worktree list
```

**从本仓库运行：**

```bash
cd tools/loop-worktree
npm install
npm test
```

<a id="commands"></a>

## 命令

```bash
loop-worktree create --run-id <id> --pattern <p> [--base main]
  # 执行 git worktree add -b loop/<id> .loop-worktrees/<id> <base>，并记录清单条目

loop-worktree mark --run-id <id> --status rejected
  # 只更新清单（审计轨迹），不删除工作树

loop-worktree cleanup [--status rejected,escalated] [--older-than 24h] [--force]
  # 对匹配的条目执行 git worktree remove，然后从清单中移除这些条目

loop-worktree gc [--force] [--json]
  # 将 `git worktree list` 与清单进行协调：
  #   - 位于磁盘的 .loop-worktrees/ 下但不在清单中 -> 报告为孤立工作树
  #   - 位于清单中但不在磁盘上 -> 从清单中移除
  # 默认仅报告；--force 会移除孤立工作树

loop-worktree list [--status active] [--json]
```

<a id="status"></a>

## 状态

每个条目的状态是以下值之一：`active`、`rejected`、`escalated`、`merged`、`stale`。

`cleanup` 默认清理 `rejected` 和 `escalated` 状态的条目。`active` 状态的条目绝不会被自动清理。

<a id="safety"></a>

## 安全性

- 如果当前目录不是 Git 仓库，或者 `--run-id` 已有活跃工作树，`create` 会给出清晰的失败消息（而不是原始 Git 错误）。
- `cleanup` 会先在不带 `--force` 的情况下运行 `git worktree remove`，因此 Git 会拒绝删除包含未提交或未跟踪更改的工作树，并将该条目报告为已跳过。仅当你接受数据丢失时才传入 `--force`。
- `gc` 默认仅报告，这与本仓库的约定一致：任何大范围扫描都只报告而不执行操作。

<a id="pairing-with-loop-context"></a>

## 与 loop-context 配合使用

如果循环的控制脚本调用 [`loop-context`](../loop-context) `--check` 并进行升级处理，也应标记其工作树：

```bash
loop-worktree mark --run-id "$RUN_ID" --status escalated
```

这两个工具彼此独立：`loop-worktree` 不读取账本，`loop-context` 也不了解 Git。

<a id="manifest"></a>

## 清单

`.loop-worktrees/manifest.json`（将 `.loop-worktrees/` 添加到 `.gitignore`）：

> 中文说明：以下 JSON 是机器可读的清单示例；为保证字段、枚举和状态值准确，保持英文不变。

```json
{
  "version": 1,
  "worktrees": [
    {
      "id": "ci-sweeper-2026-07-07-01",
      "path": ".loop-worktrees/ci-sweeper-2026-07-07-01",
      "branch": "loop/ci-sweeper-2026-07-07-01",
      "baseBranch": "main",
      "pattern": "ci-sweeper",
      "createdAt": "2026-07-07T08:00:00.000Z",
      "status": "active"
    }
  ]
}
```

有关 Git 工作树在“五大构建模块 + 记忆”模型中的位置，请参阅 [docs/primitives.md](../../docs/primitives.md)。
