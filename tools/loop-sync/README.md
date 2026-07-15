# loop-sync

检测并同步仓库中 Loop 配置文件之间的漂移。

<a id="why-loop-sync"></a>
## 为什么使用 loop-sync？

团队协作时，Loop 配置可能会随着时间推移而产生漂移：

- STATE.md 与 LOOP.md 不再同步
- 技能已更新，但配置中没有体现
- 缺少必需文件
- 配置偏离起始模板

`loop-sync` 会检测这些问题，并提供可执行的建议。

<a id="installation"></a>
## 安装

```bash
npm install -g @cobusgreyling/loop-sync
# 或
npx @cobusgreyling/loop-sync .
```

<a id="usage"></a>
## 用法

```bash
loop-sync [target-dir] [options]
```

<a id="options"></a>
### 选项

| 选项 | 说明 |
|--------|-------------|
| `-a, --auto-fix` | 尝试自动修复问题（实验性功能） |
| `-d, --dry-run` | 显示将执行的操作，但不实际进行更改 |
| `-v, --verbose` | 显示详细信息 |
| `--json` | 以 JSON 格式输出 |
| `-h, --help` | 显示帮助信息 |

<a id="examples"></a>
### 示例

```bash
# 基本同步检查
loop-sync .

# 详细输出
loop-sync ./my-project -v

# 输出 JSON，供脚本使用
loop-sync ./my-project --json
```

<a id="what-it-checks"></a>
## 检查内容

1. **必需文件**
   - STATE.md（必需）
   - LOOP.md（必需）
   - AGENTS.md（推荐）

2. **STATE.md ↔ LOOP.md 一致性**
   - 结构相似性
   - 状态文件引用
   - 模式一致性

3. **技能目录**
   - `.claude/skills/` 是否存在
   - SKILL.md 文件中的版本信息

4. **配置漂移**
   - 缺失的引用
   - 孤立文件
   - 不一致之处

<a id="score-interpretation"></a>
## 分数解读

| 分数 | 级别 | 含义 |
|-------|-------|---------|
| 90-100 | Healthy | 未检测到问题 |
| 70-89 | Warning | 存在轻微的不一致 |
| 0-69 | Critical | 存在需要处理的重大问题 |

<a id="output-example"></a>
## 输出示例

> 中文说明：以下为 `loop-sync` 的原始英文 CLI 输出示例，为避免固定机器文本发生变化而保持不变。

```
Loop Sync Report
══════════════════════════════════════════════════
Score: 85/100 (healthy)

✅ No issues detected. Configuration is consistent.

💡 Suggestions:
   - Run loop-init to scaffold missing files
```

<a id="integration-with-cicd"></a>
## 与 CI/CD 集成

将以下内容添加到 GitHub Actions 工作流中：

```yaml
- name: Run loop-sync
  run: npx @cobusgreyling/loop-sync .
```

<a id="development"></a>
## 开发

```bash
cd tools/loop-sync
npm install
npm run build
npm test
```

<a id="license"></a>
## 许可证

MIT
