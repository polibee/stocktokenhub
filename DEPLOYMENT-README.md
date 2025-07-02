# 🚀 部署指南

本项目使用 GitHub Actions 自动构建和部署到 GitHub Pages。

## 📋 工作流概览

### 1. 构建和部署工作流 (`deploy.yml`)

**触发条件：**
- 推送到 `main` 或 `master` 分支
- 创建 Pull Request
- 手动触发

**功能：**
- ✅ 自动安装依赖
- ✅ TypeScript 类型检查
- ✅ 构建 Docusaurus 网站
- ✅ 部署到 GitHub Pages
- ✅ Lighthouse 性能检测

### 2. SEO 自动化工作流 (`seo-automation.yml`)

**触发条件：**
- 每周日 UTC 2:00 自动执行
- 构建部署完成后自动执行
- 手动触发

**功能：**
- 🔍 生成 robots.txt
- 🗺️ 提交站点地图到搜索引擎
- 📊 SEO 检查和报告

### 3. 数据抓取工作流 (`scrape-data.yml`)

**触发条件：**
- 每天 UTC 2:00 自动执行
- 手动触发

**功能：**
- 📈 抓取最新的代币化股票数据
- 🔄 自动更新产品信息
- 📸 下载代币图标

## ⚙️ 配置要求

### GitHub Pages 设置

1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 确保 Actions 权限已启用

### 环境变量

项目使用以下环境变量（已在 `docusaurus.config.ts` 中配置）：

```typescript
// Google Analytics
gtag: {
  trackingID: 'G-XXXXXXXXXX', // 请替换为您的 GA4 ID
},

// Google AdSense
headTags: [
  {
    tagName: 'script',
    attributes: {
      async: true,
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8597282005680903',
      crossorigin: 'anonymous',
    },
  },
],
```

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 本地预览构建结果
npm run serve

# 类型检查
npm run typecheck

# SEO 相关脚本
npm run seo:robots    # 生成 robots.txt
npm run seo:submit    # 提交到搜索引擎
npm run build:seo     # 构建并执行 SEO 任务
```

## 📊 性能监控

### Lighthouse CI

项目集成了 Lighthouse CI，会在每次部署后自动检测：

- 🚀 **性能 (Performance)**: 最低 80 分
- ♿ **可访问性 (Accessibility)**: 最低 90 分
- 🛡️ **最佳实践 (Best Practices)**: 最低 80 分
- 🔍 **SEO**: 最低 90 分

### 配置文件

Lighthouse 配置在 `lighthouserc.js` 中，可以根据需要调整评分标准。

## 🚨 故障排除

### 常见问题

1. **构建失败**
   - 检查 TypeScript 类型错误
   - 确保所有依赖已正确安装
   - 查看 GitHub Actions 日志

2. **部署失败**
   - 确保 GitHub Pages 已启用
   - 检查仓库权限设置
   - 验证分支名称（main/master）

3. **SEO 工作流失败**
   - 检查网络连接
   - 验证搜索引擎 API 配置
   - 查看脚本执行日志

### 手动触发工作流

1. 进入 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择要执行的工作流
4. 点击 "Run workflow" 按钮

## 📈 监控和分析

- **网站地址**: https://polibee.github.io/stocktokenhub/
- **站点地图**: https://polibee.github.io/stocktokenhub/sitemap.xml
- **Robots.txt**: https://polibee.github.io/stocktokenhub/robots.txt
- **Google Analytics**: 在 GA4 控制台查看流量数据
- **Google Search Console**: 监控搜索表现

## 🔄 更新流程

1. 在本地进行开发和测试
2. 提交代码到 GitHub
3. GitHub Actions 自动构建和部署
4. 检查部署结果和性能报告
5. 监控网站运行状态

---

💡 **提示**: 所有工作流都支持手动触发，方便调试和紧急部署。