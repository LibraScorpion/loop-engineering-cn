# @cobusgreyling/loop-mcp-server

面向 **loop-engineering** 的 MCP（Model Context Protocol）服务——将模式、技能、状态、预算和审计工具公开为 AI 智能体可在运行时查询的资源。

无需将所有循环文档都塞进提示词，智能体可以通过 MCP 按需查询所需内容。

<a id="quick-start"></a>

## 快速开始

```bash
npx @cobusgreyling/loop-mcp-server
```

在已克隆的 `loop-engineering` 仓库中：

```bash
cd tools/mcp-server && npm ci && npm test
node dist/index.js
```

将 `LOOP_PROJECT_ROOT` 设置为目标项目（默认为 `cwd`）。

<a id="configure-in-claude-code--grok--any-mcp-client"></a>

### 在 Claude Code、Grok 或任意 MCP 客户端中配置

将以下内容添加到 MCP 配置（`.mcp.json` 或同等配置文件）中：

> 中文说明：以下 JSON 是机器可读的 MCP 客户端配置，其 key、命令、参数、包名、路径和环境变量保持英文原文。

```json
{
  "mcpServers": {
    "loop-engineering": {
      "command": "npx",
      "args": ["-y", "@cobusgreyling/loop-mcp-server"],
      "env": {
        "LOOP_PROJECT_ROOT": "."
      }
    }
  }
}
```

<a id="resources"></a>

## 资源

| URI | 说明 |
|-----|-------------|
| `loop://registry` | 模式注册表（全部 7 个模式及其元数据、成本和阶段） |
| `loop://config` | LOOP.md——运行节奏、预算、关卡和调度 |
| `loop://budget` | loop-budget.md——token 上限和紧急停止开关 |
| `loop://run-log` | loop-run-log.md——仅追加的运行历史记录 |
| `loop://safety` | 安全文档——拒绝列表、自动合并策略和 MCP 权限范围 |
| `loop://patterns/{id}` | 按 ID 获取完整的模式文档 |
| `loop://skills/{name}` | 按名称获取技能定义（SKILL.md） |
| `loop://state/{file}` | 状态文件内容 |

<a id="tools"></a>

## 工具

| 工具 | 说明 |
|------|-------------|
| `loop_list_patterns` | 列出所有模式及其目标、运行节奏和风险等级 |
| `loop_list_skills` | 列出可用技能及其位置 |
| `loop_list_state_files` | 列出项目中的状态文件 |
| `loop_get_pattern` | 获取完整的模式文档和注册表元数据 |
| `loop_get_skill` | 获取指定技能的 SKILL.md 内容 |
| `loop_get_state` | 读取状态文件，以了解当前循环状态 |
| `loop_recommend_pattern` | 根据用例描述推荐模式 |
| `loop_estimate_cost` | 估算某个模式在 L1/L2/L3 下的每日 token 成本 |

<a id="environment"></a>

## 环境

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `LOOP_PROJECT_ROOT` | `cwd()` | 要提供服务的项目根目录 |

<a id="development"></a>

## 开发

```bash
cd tools/mcp-server
npm install
npm run build
npm test
```

<a id="architecture"></a>

## 架构

```
智能体（Claude Code / Grok / Codex）
  │
  ├─ MCP 资源读取 ──→ loop://patterns/daily-triage
  ├─ MCP 工具调用 ──→ loop_recommend_pattern("watch CI failures")
  └─ MCP 工具调用 ──→ loop_estimate_cost("ci-sweeper", "L2")
  │
  ▼
loop-mcp-server（stdio 传输）
  │
  ├─ resolver.ts ──→ 读取 patterns/、skills/、STATE.md、LOOP.md 等
  └─ index.ts ──→ MCP 协议处理程序
```

服务从 `LOOP_PROJECT_ROOT` 指定的本地文件系统读取内容。它是只读的，绝不会写入项目。

<a id="see-also"></a>

## 另请参阅

- [Loop Engineering 模式](../../patterns/)
- [MCP 示例](../../examples/mcp/)
- [原语：插件与连接器](../../docs/primitives.md)
- [安全：MCP 最小权限](../../docs/safety.md)
