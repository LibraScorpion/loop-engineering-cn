# goal-audit

用于 Grok Build `/goal` 工作流的目标就绪度评分 CLI。

<a id="install--run"></a>

## 安装／运行

```bash
npx @cobusgreyling/goal-audit .
npx @cobusgreyling/goal-audit . --suggest
npx @cobusgreyling/goal-audit . --json
```

<a id="levels"></a>

## 等级

| 等级 | 分数 | 含义 |
|-------|-------|---------|
| G0 | < 40 | 临时使用 `/goal` |
| G1 | 40–59 | `GOAL.md` + 辅助目标 |
| G2 | 60–79 | 验证器 + 测试关卡 |
| G3 | 80+ | CI、预算和运行日志 |

<a id="development"></a>

## 开发

```bash
npm install
npm test
```
