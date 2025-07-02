# 🔧 GitHub Pages 设置指南

## 📋 前置条件

1. **仓库必须是公开的** (使用 GitHub Free 计划) <mcreference link="https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site" index="1">1</mcreference>
2. **GitHub Actions 必须启用** <mcreference link="https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site" index="1">1</mcreference>
3. **管理员权限** 用于配置 Pages 设置

## 🚀 设置步骤

### 1. 启用 GitHub Pages

1. 进入仓库页面：`https://github.com/polibee/stocktokenhub`
2. 点击 **Settings** 标签
3. 在左侧边栏找到 **Pages** 选项
4. 在 "Build and deployment" 部分：
   - **Source**: 选择 "GitHub Actions" <mcreference link="https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site" index="3">3</mcreference>
   - 这将允许我们的自定义工作流进行部署

### 2. 验证 GitHub Actions 权限

1. 在仓库 Settings 中，找到 **Actions** → **General**
2. 确保以下设置：
   - ✅ "Allow all actions and reusable workflows"
   - ✅ "Read and write permissions" for GITHUB_TOKEN
   - ✅ "Allow GitHub Actions to create and approve pull requests"

### 3. 检查工作流状态

1. 点击仓库的 **Actions** 标签
2. 查看 "Build and Deploy" 工作流是否正在运行
3. 如果失败，点击查看详细日志

## 🔍 故障排除

### 问题 1: 网站无法访问

**可能原因：**
- GitHub Pages 还未启用
- 工作流执行失败
- DNS 传播延迟 (最多 10 分钟) <mcreference link="https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site" index="1">1</mcreference>

**解决方案：**
```bash
# 检查部署状态
npm run check:deployment

# 手动触发部署
git commit --allow-empty -m "trigger deployment"
git push origin master
```

### 问题 2: 工作流权限错误

**错误信息：** `Error: Resource not accessible by integration`

**解决方案：**
1. 进入 Settings → Actions → General
2. 在 "Workflow permissions" 中选择 "Read and write permissions"
3. 勾选 "Allow GitHub Actions to create and approve pull requests"

### 问题 3: Pages 构建失败

**检查步骤：**
1. 查看 Actions 标签中的工作流日志
2. 确保 `build` 目录包含 `index.html`
3. 检查是否有 `.nojekyll` 文件 (我们的工作流会自动创建)

## 📊 验证部署

### 自动检查
```bash
# 运行部署检查脚本
npm run check:deployment
```

### 手动检查
访问以下 URL 确认网站正常：
- 🏠 主页: https://polibee.github.io/stocktokenhub/
- 📝 博客: https://polibee.github.io/stocktokenhub/blog/
- 📚 文档: https://polibee.github.io/stocktokenhub/docs/
- 🎓 教程: https://polibee.github.io/stocktokenhub/tutorials/
- 🗺️ 站点地图: https://polibee.github.io/stocktokenhub/sitemap.xml
- 🤖 Robots: https://polibee.github.io/stocktokenhub/robots.txt

## 🔄 重新部署

如果需要强制重新部署：

```bash
# 方法 1: 空提交触发
git commit --allow-empty -m "force redeploy"
git push origin master

# 方法 2: 手动触发工作流
# 在 GitHub Actions 页面点击 "Run workflow"
```

## 📈 监控和维护

### 定期检查
- 每周运行 `npm run check:deployment` 检查网站状态
- 监控 GitHub Actions 工作流执行情况
- 查看 Google Analytics 和 Search Console 数据

### 性能优化
- Lighthouse CI 会在每次部署后自动运行
- 查看性能报告并根据建议优化
- 监控网站加载速度和 SEO 指标

## 🆘 获取帮助

如果遇到问题：
1. 查看 [GitHub Pages 官方文档](https://docs.github.com/en/pages) <mcreference link="https://docs.github.com/en/pages" index="5">5</mcreference>
2. 检查 GitHub Actions 工作流日志
3. 运行本地诊断脚本
4. 查看 GitHub Status 页面确认服务状态

---

💡 **提示**: GitHub Pages 的更改可能需要最多 10 分钟才能生效，请耐心等待。 <mcreference link="https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site" index="1">1</mcreference>