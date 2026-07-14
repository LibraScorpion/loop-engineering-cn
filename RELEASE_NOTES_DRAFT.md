<a id="release-notes-draft--since-loop-mcp-server-v100"></a>
# 发布说明草稿——自 `loop-mcp-server-v1.0.0` 以来

**状态：** 已发布至 [GitHub Discussions #219](https://github.com/cobusgreyling/loop-engineering/discussions/219)（2026-07-08）和 [#241](https://github.com/cobusgreyling/loop-engineering/discussions/241)（2026-07-10 维护更新）。这是供下次 changelog-drafter 运行使用的留档副本。

**时间范围：** 2026-07-06 → 2026-07-09

---

<a id="highlights"></a>
## 亮点

<a id="loop-audit-160--governance-scoring-233"></a>
### loop-audit 1.6.0——治理评分（[#233](https://github.com/cobusgreyling/loop-engineering/pull/233)）

就绪度评分现在会检查多智能体安全信号：

- 最小权限工具范围（技能中的 `allowed-tools`、限定作用域的 MCP）
- 卡滞／无进展检测（`loop-context`、熔断器、最大尝试次数）
- 人工升级路径（HITL、`LOOP.md`／约束中的移交用语）

已标记 `loop-audit-v1.6.0`。

```bash
npx @cobusgreyling/loop-audit . --suggest
```

<a id="new-on-npm-cobusgreylingloop-worktree-190-204"></a>
### npm 新增：`@cobusgreyling/loop-worktree`（[#190](https://github.com/cobusgreyling/loop-engineering/pull/190)、[#204](https://github.com/cobusgreyling/loop-engineering/pull/204)）

每次修复尝试使用隔离的 Git 工作树——支持 PR Babysitter 和 CI Sweeper L2 模式，避免分支冲突。已标记 `loop-worktree-v1.0.0`。

```bash
npx @cobusgreyling/loop-worktree create --run-id fix-1 --pattern pr-babysitter
npx @cobusgreyling/loop-worktree list
npx @cobusgreyling/loop-worktree cleanup --older-than 24h
```

感谢 [@KhaiTrang1995](https://github.com/KhaiTrang1995)。

<a id="stories"></a>
### 案例故事

| PR | 已发布内容 |
|----|--------------|
| [#234](https://github.com/cobusgreyling/loop-engineering/pull/234) | CI Sweeper 偶发测试无限失败案例 |
| [#182](https://github.com/cobusgreyling/loop-engineering/pull/182) | 多循环协作案例（@k-anushka14） |

<a id="docs--examples"></a>
### 文档与示例

| PR | 贡献者 | 已发布内容 |
|----|-------------|--------------|
| [#217](https://github.com/cobusgreyling/loop-engineering/pull/217) | @Mahizhan-S | `examples/mcp/` 中的 MCP 服务器 `npx` 快速入门（[#201](https://github.com/cobusgreyling/loop-engineering/issues/201)） |
| [#202](https://github.com/cobusgreyling/loop-engineering/pull/202) | @Mahizhan-S | 原语矩阵中的 Gemini CLI 附录 |
| [#206](https://github.com/cobusgreyling/loop-engineering/pull/206) | @Mahizhan-S | 原语矩阵中的 Zed 附录 |
| [#208](https://github.com/cobusgreyling/loop-engineering/pull/208) | @Mahizhan-S | Windsurf PR Babysitter 示例 |
| [#183](https://github.com/cobusgreyling/loop-engineering/pull/183) | @k-anushka14 | Opencode 约束示例 |
| [#185](https://github.com/cobusgreyling/loop-engineering/pull/185) | @k-anushka14 | 示例索引中的 Aider 附录链接 |
| Hermes 索引 + QUICKSTART | @AshayK003（[#187](https://github.com/cobusgreyling/loop-engineering/pull/187)–[#189](https://github.com/cobusgreyling/loop-engineering/pull/189)） | `examples/hermes/README.md`、QUICKSTART 小节 |
| QUICKSTART `loop-worktree` | 维护者（[#197](https://github.com/cobusgreyling/loop-engineering/issues/197)） | L2 Git 工作树小节 + 速查表 |

<a id="philosophy--contributor-growth"></a>
### 理念与贡献者成长

- KY cut surface 理念 v0.1（[#179](https://github.com/cobusgreyling/loop-engineering/pull/179)）——感谢 [@sololys](https://github.com/sololys)
- `CONTRIBUTORS.md` 自动化更新（[#180](https://github.com/cobusgreyling/loop-engineering/pull/180)）
- Star-history 页面重新设计（[#205](https://github.com/cobusgreyling/loop-engineering/pull/205)）

<a id="housekeeping"></a>
### 维护工作

- **Star-history 工作流**——创建自动合并 PR，而不是推送到受保护的 `main`
- **loop-audit 发布**——在 npm 发布前安装 `sigstore`（[#236](https://github.com/cobusgreyling/loop-engineering/pull/236)）
- Dependabot 版本升级：`actions/github-script` 7→9，以及 loop-audit/loop-init 中的 `@types/node`
- 清理陈旧分支（2026-07-10 删除了 18+ 个已合并的分支头）+ 文档同步（[#238](https://github.com/cobusgreyling/loop-engineering/pull/238)）

---

<a id="npm-packages-current"></a>
## npm 软件包（当前）

| 软件包 | 版本 | 说明 |
|---------|---------|-------|
| `@cobusgreyling/loop-audit` | **1.6.0** | 治理评分——`loop-audit-v1.6.0` |
| `@cobusgreyling/loop-worktree` | **1.0.0** | 新增——`loop-worktree-v1.0.0` |
| `@cobusgreyling/loop-init` | 1.3.3 | 脚手架生成后显示贡献者 CTA |
| `@cobusgreyling/loop-mcp-server` | 1.0.0 | 无变化 |
| `@cobusgreyling/loop-cost` | 1.0.3 | 无变化 |
| `@cobusgreyling/loop-sync` | 1.0.0 | 无变化 |
| `@cobusgreyling/loop-context` | 1.0.0 | 无变化 |
| `@cobusgreyling/goal-audit` | 1.0.2 | 配套工具——Goal Engineering 技术栈 |

---

<a id="try-it-in-5-minutes"></a>
## 5 分钟试用

```bash
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok
npx @cobusgreyling/loop-audit . --suggest
LOOP_PROJECT_ROOT=. npx @cobusgreyling/loop-mcp-server
```

第二周（L2）：将 `loop-worktree` 与 `loop-context --check` 配合使用——参见 [QUICKSTART 快速入门](docs/QUICKSTART.md#l2-isolated-fix-attempts-loop-worktree)。
