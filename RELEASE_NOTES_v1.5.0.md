<a id="v150--community-tools-drop"></a>
# v1.5.0 — 社区工具发布

合并了七个社区 PR。发布了三个新工具。一条命令即可试用全部功能。

<a id="quickstart-copy-paste"></a>
## 快速入门（复制粘贴即可）

```bash
# 为你的第一个循环搭建脚手架（适用于任何 Git 仓库）
npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok

# 在安排运行前检查 token 成本
npx @cobusgreyling/loop-cost --pattern daily-triage --level L1 --cadence 1d

# 评估就绪度并获取后续步骤
npx @cobusgreyling/loop-audit . --suggest

# 检测 STATE.md 与 LOOP.md 之间的偏差
npx @cobusgreyling/loop-sync .
```

**初次使用？** [快速入门（5 分钟）](docs/QUICKSTART.md) · [交互式模式选择器](https://cobusgreyling.github.io/loop-engineering/#interactive)

---

<a id="whats-new"></a>
## 新增内容

<a id="new-loop-sync-cli-npm-v100"></a>
### 新增：`loop-sync` CLI（npm v1.0.0）

检测 `STATE.md`、`LOOP.md` 与技能版本之间的配置偏差。可在 CI 或本地运行：

```bash
npx @cobusgreyling/loop-sync . -v
```

由 [#47](https://github.com/cobusgreyling/loop-engineering/pull/47) 贡献——感谢 @community。

<a id="new-loop-constraints"></a>
### 新增：`loop-constraints`

结构化护栏文件与强制执行技能。`loop-init` 现在每次运行都会搭建 `loop-constraints.md` 和 `loop-constraints` 技能的脚手架。`loop-audit` 会对约束是否存在进行评分（文件和技能同时存在时，就绪度加 6 分）。

由 [#71](https://github.com/cobusgreyling/loop-engineering/pull/71) 贡献。

<a id="new-loop-mcp-server-repo-v1"></a>
### 新增：`loop-mcp-server`（仓库 v1）

在运行时通过 MCP 查询模式、技能和状态。包含路径遍历防护。

```bash
node tools/mcp-server/dist/index.js
```

由 [#72](https://github.com/cobusgreyling/loop-engineering/pull/72) 贡献。即将发布至 npm。

<a id="updated-npm-packages"></a>
### 已更新的 npm 包

| 包 | 版本 | 亮点 |
| --- | --- | --- |
| `@cobusgreyling/loop-audit` | **1.5.0** | 约束评分与建议 |
| `@cobusgreyling/loop-init` | **1.2.3** | 约束脚手架；序列化资源打包修复（[#80](https://github.com/cobusgreyling/loop-engineering/pull/80)） |
| `@cobusgreyling/loop-sync` | **1.0.0** | 首次发布至 npm |

<a id="docs--discoverability"></a>
### 文档与内容发现

- [QUICKSTART.md](docs/QUICKSTART.md)——从零开始、5 分钟完成第一个循环
- [OpenClaw 原语矩阵](docs/primitives-matrix.md)——cron、webhook 与 heartbeat 映射
- 深色主题 SVG 视觉素材与 README 润色
- README 中的 Star History 图表
- daily-triage 和 changelog-drafter 起始模板中的运行后复盘章节

---

<a id="community"></a>
## 社区

本次发布合并了来自 7 个社区 PR 的工作。完整过程请阅读[讨论 #89](https://github.com/cobusgreyling/loop-engineering/discussions/89)。

**运行过循环？** 请将自己添加到 [docs/adopters.md](docs/adopters.md)，或[新建“添加采用者”Issue](https://github.com/cobusgreyling/loop-engineering/issues/new?template=add-adopter.yml)。

**展示与分享：** [GitHub Discussions → 展示与分享](https://github.com/cobusgreyling/loop-engineering/discussions/categories/show-and-tell)

---

<a id="companion--goal-engineering"></a>
## 配套项目——Goal Engineering

循环发现持续进行的工作。**目标完成边界明确的任务。**

| 层级 | 仓库 | 命令 |
| --- | --- | --- |
| 发现（按运行节奏） | [loop-engineering](https://github.com/cobusgreyling/loop-engineering) | `npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok` |
| 完成（运行直至完成） | [goal-engineering](https://github.com/cobusgreyling/goal-engineering) | `npx @cobusgreyling/goal init . --pattern fix-bug --tool grok` |

**技术栈指南：** [loop → goal → fleet 的日常节奏](https://github.com/cobusgreyling/goal-engineering/blob/main/docs/stack-cookbook.md)

> 中文说明：以下为供智能体执行的原始英文指令，为避免语义漂移保持不变

```
/goal Read STATE.md top priority. Done when verifier PASS. goal-verifier before completed: true.
```
