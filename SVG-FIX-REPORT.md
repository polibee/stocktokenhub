# SVG 文件名修复报告

## 问题描述

构建失败，错误信息显示大量 xStocks 产品文档引用了不存在的 SVG 图片文件：

```
Error: Image static/img/tokens/aaplx.svg used in docs/products/xstocks/aaplx.md not found.
```

## 根本原因

**文件名大小写不匹配问题：**
- 文档中引用的是小写文件名：`/img/tokens/aaplx.svg`
- 实际文件是大写文件名：`AAPLx.svg`
- 导致 MDX 编译器无法找到对应的图片文件

## 解决方案

### 1. 文件重命名
- 将 `static/img/tokens/` 目录下所有 SVG 文件重命名为小写
- 从 `AAPLx.svg` 重命名为 `aaplx.svg`
- 影响约 60 个 SVG 文件

### 2. 创建修复工具

**Node.js 脚本：** `scripts/fix-svg-case.js`
- 自动检测和修复 SVG 文件名大小写问题
- 提供详细的修复报告

**PowerShell 脚本：** `scripts/fix-svg-case.ps1`
- Windows 环境下的批量重命名工具
- 支持大小写敏感的文件操作

## 修复结果

### ✅ 构建测试
```bash
npm run build
# [SUCCESS] Generated static files in "build".
```

### ✅ 类型检查
```bash
npm run typecheck
# 通过，无错误
```

### ✅ 文件状态
- 所有 SVG 文件已重命名为小写
- 文档引用路径与实际文件名匹配
- MDX 编译错误已解决

## 部署状态

### 代码推送
- ✅ 修复代码已提交到 Git
- ✅ 代码已推送到 GitHub
- ✅ GitHub Actions 工作流已触发

### 下一步操作
1. **手动启用 GitHub Pages**
   - 访问：https://github.com/polibee/stocktokenhub/settings/pages
   - Source: Deploy from a branch → **GitHub Actions**
   - 保存设置

2. **验证部署**
   - 等待工作流完成（2-3分钟）
   - 访问：https://polibee.github.io/stocktokenhub/
   - 运行验证：`node scripts/setup-github-pages.js`

## 预防措施

### 文件命名规范
- 所有静态资源文件使用小写命名
- 文档引用路径与实际文件名保持一致
- 使用自动化脚本检查文件名一致性

### 构建验证
- 本地构建测试：`npm run build`
- 类型检查：`npm run typecheck`
- 部署前验证：`npm run check:deployment`

## 工具和脚本

| 脚本 | 用途 | 命令 |
|------|------|------|
| `fix-svg-case.js` | SVG文件名修复 | `node scripts/fix-svg-case.js` |
| `fix-svg-case.ps1` | Windows批量重命名 | `powershell scripts/fix-svg-case.ps1` |
| `setup-github-pages.js` | 部署状态检查 | `node scripts/setup-github-pages.js` |
| `fix-build-issues.js` | 构建问题诊断 | `node scripts/fix-build-issues.js` |

---

**修复完成时间：** 2025年1月2日  
**状态：** ✅ 构建问题已解决，等待部署完成  
**下一步：** 手动启用 GitHub Pages 设置