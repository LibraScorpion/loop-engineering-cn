<a id="enable-github-pages"></a>

# 启用 GitHub Pages

1. 打开仓库的**设置（Settings）** → **Pages**
2. **源（Source）**：选择从分支部署（Deploy from a branch），分支为 `main`
3. **文件夹（Folder）**：`/docs`
4. 保存（Save）——展示网站将发布到 `https://cobusgreyling.github.io/loop-engineering/`

首页（`docs/index.html`）是完整的交互式展示页面，包含模式、原语、快速入门指南和结构图。

根目录中的 `README.md` 和 `LOOP.md` 说明了此参考仓库如何通过 `.github/workflows/audit.yml` + `validate-patterns.yml` 应用自身的模式。

首次部署可能需要 1–2 分钟。启用后，每日定时运行的审计工作流会让已发布网站与此参考仓库的循环就绪度分数保持一致。

**小贴士**：在本地运行 `node tools/loop-audit/dist/cli.js . --suggest`，并逐步提高分数——工作流会反映这些变化。
