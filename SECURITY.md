<a id="security-policy"></a>
# 安全策略

循环工程会针对你的代码库运行无人值守自动化。请像对待生产环境操作员一样对待循环。

<a id="reporting-vulnerabilities"></a>
## 报告漏洞

请**私下**报告安全问题——对于可被利用的漏洞，请勿创建公开 Issue。

- **首选方式：**[GitHub 私有漏洞报告](https://github.com/cobusgreyling/loop-engineering/security/advisories/new)
- **邮箱：**security@cobusgreyling.me（可按请求提供 PGP）

有关循环安全的一般指导，请参阅 [docs/safety.md](docs/safety.md)。

<a id="unattended-automation-risks"></a>
## 无人值守自动化风险

| 风险 | 缓解措施 |
|------|------------|
| 自动合并恶意依赖项 | 拒绝清单（denylist）+ 验证器 + 第一周不自动合并 |
| MCP 权限过大 | L1 使用只读连接器；将写入范围限定为仅 PR 评论 |
| 通过提示词泄露机密 | 将 `.env`、凭据路径加入拒绝清单；绝不在 STATE.md 中记录机密 |
| 无限修复循环耗尽预算 | 严格限制尝试次数；在 LOOP.md 中设置紧急停止开关（kill switch） |
| 循环生成的 PR 存在供应链风险 | 对允许清单（allowlist）之外的任何内容进行人工审核 |

<a id="recommended-gates-before-l3"></a>
## 进入 L3 前的建议关卡

- [ ] 在 LOOP.md 中记录路径拒绝清单（denylist）
- [ ] 验证器在隔离的 Git 工作树中运行测试
- [ ] 没有明确的允许清单（allowlist）时，不得自动合并
- [ ] MCP 连接器遵循最小权限原则
- [ ] 使用 `loop-run-log.md` 或具备同等能力的可观测性机制

<a id="supported-versions"></a>
## 支持的版本

| 软件包 | 支持范围 |
|---------|-----------|
| `@cobusgreyling/loop-audit` | npm 上的最新发布版本 |
| `@cobusgreyling/loop-init` | npm 上的最新发布版本 |
| 参考仓库 `main` | 当前 HEAD |
