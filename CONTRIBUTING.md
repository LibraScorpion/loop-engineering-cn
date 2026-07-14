<a id="contributing-to-loop-engineering"></a>

# 为 Loop Engineering 做贡献

本仓库是一份**实用的工程参考资料**，而不是炒作内容的集合。我们欢迎模式、案例、工具映射，以及坦诚的失败报告。

<a id="ways-to-contribute"></a>

## 参与贡献的方式

| 贡献内容 | 提交位置 |
|--------------|-------|
| 新的循环模式 | `patterns/` + `patterns/registry.yaml` |
| 生产环境案例 | `stories/` |
| 工具示例 | `examples/{grok,claude-code,codex,openclaw,opencode,github-actions}/` |
| 技能模板 | `templates/` |
| 入门套件 | `starters/` |
| 文档改进 | `docs/` |

<a id="contribution-ladder"></a>

## 贡献阶梯

从小处着手——每个合并的 PR 都有价值。

| 阶段 | 所需时间 | 可以贡献什么 |
|------|------|-------------------|
| **1** | 约 15 分钟 | 修正错别字、添加采用者条目或原语矩阵条目，或添加 `examples/README.md` 链接 |
| **2** | 约 1 小时 | 在 `stories/` 中提交生产环境案例，或在 `examples/{tool}/` 中提交工具示例 |
| **3** | 半天 | 新增入门套件、技能模板或 MCP 操作指南条目 |
| **4** | 一整天 | 在 `patterns/` 中提交完整模式，并在 `patterns/registry.yaml` 中添加条目 |

**最快的参与方式：**[将你的项目加入采用者列表](https://github.com/cobusgreyling/loop-engineering/issues/new?template=add-adopter.yml) · [通过 Issue 分享案例](https://github.com/cobusgreyling/loop-engineering/issues/new?template=share-story.yml) · [`good first issue` 待办列表](https://github.com/cobusgreyling/loop-engineering/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

<a id="pattern-requirements"></a>

## 模式要求

每个新模式都必须包含 [templates/pattern-template.md](./templates/pattern-template.md) 中的所有章节：

1. 目标（一句话）
2. 调度（各工具对应的命令）
3. 必需的技能
4. 状态结构（包含示例）
5. 典型循环（编号步骤）
6. 验证策略（执行者／检查者，maker/checker）
7. 人工交接点
8. 工具专属说明（至少涉及 2 种工具）
9. 失效模式表
10. 成功指标

此外，还要在 `patterns/registry.yaml` 中添加一个条目。

<a id="story-requirements"></a>

## 案例要求

- 真实经历（必要时匿名化）
- 指明所使用的模式
- 至少包含一次失败或意外情况
- 用一个段落说明可付诸行动的经验

<a id="pull-request-checklist"></a>

## Pull Request 检查清单

- [ ] 可以从 README 或相关索引正常访问链接
- [ ] 不包含机密信息、token 或内部 URL
- [ ] `STATE.md` 示例使用 `.example` 后缀（实时状态文件已被 Git 忽略）
- [ ] 安全敏感的模式引用了 [docs/safety.md](./docs/safety.md)

<a id="code-of-conduct"></a>

## 行为准则

- 工程实践重于炒作
- 将失败视为一等内容
- 默认保持工具无关；工具专属内容应放在已明确标注的章节中

<a id="maintainer-response-adopters--stories"></a>

## 维护者响应（采用者与案例）

仅修改 `stories/`、`docs/adopters.md` 或 [Add Adopter](https://github.com/cobusgreyling/loop-engineering/issues/new?template=add-adopter.yml) 模板的 PR，在条件允许时可获得**当天审核**：

1. 维护者在 24 小时内合并，或要求进行一次小幅修正
2. 在 PR 或 Issue 中公开致谢（使用 `@mention` 提及贡献者）
3. 如果贡献者希望提交第二个 PR，可选择创建后续 Issue（例如：将案例扩展为模式示例）

自动化流程会在新的案例／采用者 PR 中发布欢迎评论（参见 `.github/workflows/welcome-contributors.yml`）。

<a id="community"></a>

## 社区

- **问题**：[GitHub Discussions](https://github.com/cobusgreyling/loop-engineering/discussions)（首选），或创建带有 `question` 标签的 Issue
- **展示你的循环**：[Add Adopter Issue](https://github.com/cobusgreyling/loop-engineering/issues/new?template=add-adopter.yml)、Discussions，或在 [docs/adopters.md](./docs/adopters.md) 中添加一行
- **Loop Ready 徽章**：`npx @cobusgreyling/loop-audit . --badge`——粘贴到你的 README 中
- **适合首次贡献的 Issue**：查找 [`good first issue`](https://github.com/cobusgreyling/loop-engineering/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) 标签
- **名人堂**：[CONTRIBUTORS.md](./CONTRIBUTORS.md)——合并后使用 `npm run contributors:generate` 重新生成
- **安全**：参见 [SECURITY.md](./SECURITY.md)——对于可利用的漏洞，请勿创建公开 Issue

感谢你帮助我们将本项目打造为循环工程的首选参考资料。
