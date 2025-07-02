#!/usr/bin/env node

/**
 * 构建问题自动修复脚本
 * 检查和修复常见的 Docusaurus 构建问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkAndCreateFile(filePath, content, description) {
  if (!fs.existsSync(filePath)) {
    log(`❌ ${description} 缺失`, 'red');
    log(`💡 创建 ${filePath}...`, 'yellow');
    
    try {
      // 确保目录存在
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      log(`✅ ${description} 已创建`, 'green');
      return true;
    } catch (error) {
      log(`❌ 创建失败: ${error.message}`, 'red');
      return false;
    }
  } else {
    log(`✅ ${description} 存在`, 'green');
    return true;
  }
}

function checkPackageJson() {
  log('\n📦 检查 package.json...', 'blue');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packagePath)) {
    log('❌ package.json 不存在', 'red');
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // 检查必需的脚本
    const requiredScripts = {
      'typecheck': 'tsc',
      'build': 'docusaurus build',
      'start': 'docusaurus start',
      'serve': 'docusaurus serve'
    };
    
    let needsUpdate = false;
    const currentScripts = packageJson.scripts || {};
    
    for (const [script, command] of Object.entries(requiredScripts)) {
      if (!currentScripts[script]) {
        log(`❌ 缺少脚本: ${script}`, 'red');
        currentScripts[script] = command;
        needsUpdate = true;
      } else {
        log(`✅ 脚本存在: ${script}`, 'green');
      }
    }
    
    // 检查必需的依赖
    const requiredDeps = {
      'typescript': '~5.6.2',
      '@docusaurus/core': '^3.8.1',
      '@docusaurus/preset-classic': '^3.8.1'
    };
    
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const [dep, version] of Object.entries(requiredDeps)) {
      if (!allDeps[dep]) {
        log(`⚠️  缺少依赖: ${dep}`, 'yellow');
      } else {
        log(`✅ 依赖存在: ${dep}`, 'green');
      }
    }
    
    if (needsUpdate) {
      packageJson.scripts = currentScripts;
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      log('✅ package.json 已更新', 'green');
    }
    
    return true;
  } catch (error) {
    log(`❌ 解析 package.json 失败: ${error.message}`, 'red');
    return false;
  }
}

function checkTypeScriptConfig() {
  log('\n📝 检查 TypeScript 配置...', 'blue');
  
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  const defaultTsconfig = {
    "extends": "@docusaurus/tsconfig",
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@site/*": ["./src/*"]
      }
    },
    "include": [
      "src/**/*",
      "*.ts",
      "*.tsx"
    ],
    "exclude": [
      "node_modules",
      "build",
      ".docusaurus"
    ]
  };
  
  return checkAndCreateFile(
    tsconfigPath,
    JSON.stringify(defaultTsconfig, null, 2),
    'TypeScript 配置文件'
  );
}

function checkDocusaurusConfig() {
  log('\n⚙️  检查 Docusaurus 配置...', 'blue');
  
  const configPath = path.join(process.cwd(), 'docusaurus.config.ts');
  if (!fs.existsSync(configPath)) {
    log('❌ docusaurus.config.ts 不存在', 'red');
    return false;
  }
  
  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // 检查基本配置
    const checks = [
      { pattern: /baseUrl:\s*['"]\//g, name: 'baseUrl 配置' },
      { pattern: /url:\s*['"]https:\/\/[^'"]+['"]/, name: 'URL 配置' },
      { pattern: /@docusaurus\/preset-classic/, name: 'Classic 预设' }
    ];
    
    checks.forEach(check => {
      if (check.pattern.test(configContent)) {
        log(`✅ ${check.name} 正确`, 'green');
      } else {
        log(`⚠️  ${check.name} 可能有问题`, 'yellow');
      }
    });
    
    return true;
  } catch (error) {
    log(`❌ 读取配置文件失败: ${error.message}`, 'red');
    return false;
  }
}

function checkStaticFiles() {
  log('\n📁 检查静态文件...', 'blue');
  
  const staticDir = path.join(process.cwd(), 'static');
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
    log('✅ static 目录已创建', 'green');
  }
  
  // 检查 .nojekyll 文件
  const nojekyllPath = path.join(staticDir, '.nojekyll');
  checkAndCreateFile(nojekyllPath, '', '.nojekyll 文件');
  
  // 检查 favicon
  const faviconPath = path.join(staticDir, 'img', 'favicon.ico');
  if (!fs.existsSync(faviconPath)) {
    log('⚠️  favicon.ico 不存在，建议添加', 'yellow');
  } else {
    log('✅ favicon.ico 存在', 'green');
  }
  
  return true;
}

function runBuildTest() {
  log('\n🔨 测试构建...', 'blue');
  
  try {
    log('📦 安装依赖...', 'yellow');
    execSync('npm ci', { stdio: 'pipe' });
    log('✅ 依赖安装成功', 'green');
    
    log('🔍 类型检查...', 'yellow');
    execSync('npm run typecheck', { stdio: 'pipe' });
    log('✅ 类型检查通过', 'green');
    
    log('🏗️  构建测试...', 'yellow');
    execSync('npm run build', { stdio: 'pipe' });
    log('✅ 构建成功', 'green');
    
    // 检查构建产物
    const buildDir = path.join(process.cwd(), 'build');
    if (fs.existsSync(buildDir)) {
      const files = fs.readdirSync(buildDir);
      log(`📦 构建产物: ${files.length} 个文件/目录`, 'cyan');
      
      // 检查关键文件
      const keyFiles = ['index.html', 'sitemap.xml'];
      keyFiles.forEach(file => {
        if (fs.existsSync(path.join(buildDir, file))) {
          log(`✅ ${file} 存在`, 'green');
        } else {
          log(`⚠️  ${file} 缺失`, 'yellow');
        }
      });
    }
    
    return true;
  } catch (error) {
    log('❌ 构建失败:', 'red');
    log(error.message, 'red');
    
    // 提供具体的错误解决建议
    if (error.message.includes('TypeScript')) {
      log('\n💡 TypeScript 错误解决建议:', 'yellow');
      log('   • 检查 tsconfig.json 配置');
      log('   • 确保所有 .ts/.tsx 文件语法正确');
      log('   • 运行 npm run typecheck 查看详细错误');
    }
    
    if (error.message.includes('Module not found')) {
      log('\n💡 模块缺失解决建议:', 'yellow');
      log('   • 运行 npm install 安装依赖');
      log('   • 检查 import 路径是否正确');
      log('   • 确保所有依赖都在 package.json 中');
    }
    
    return false;
  }
}

function printNextSteps() {
  log('\n🎯 下一步操作:', 'magenta');
  log('\n1. 如果本地构建成功:');
  log('   • 提交并推送代码: git add . && git commit -m "fix: 修复构建问题" && git push');
  log('   • 等待 GitHub Actions 工作流完成');
  log('   • 手动启用 GitHub Pages (如果尚未启用)');
  
  log('\n2. 如果构建仍然失败:');
  log('   • 查看上方的具体错误信息');
  log('   • 检查 GitHub Actions 工作流日志');
  log('   • 运行 npm run typecheck 进行类型检查');
  
  log('\n3. GitHub Pages 设置:');
  log('   • 运行: node scripts/setup-github-pages.js');
  log('   • 按照提示启用 GitHub Pages');
  
  log('\n4. 验证部署:');
  log('   • 运行: npm run check:deployment');
  log('   • 访问: https://polibee.github.io/stocktokenhub/');
}

async function main() {
  log('🔧 构建问题自动修复工具', 'magenta');
  log('=' .repeat(50), 'cyan');
  
  let allChecksPass = true;
  
  // 检查各个组件
  allChecksPass &= checkPackageJson();
  allChecksPass &= checkTypeScriptConfig();
  allChecksPass &= checkDocusaurusConfig();
  allChecksPass &= checkStaticFiles();
  
  // 运行构建测试
  const buildSuccess = runBuildTest();
  
  log('\n' + '=' .repeat(50), 'cyan');
  
  if (buildSuccess) {
    log('🎉 所有检查通过，构建成功！', 'green');
  } else {
    log('❌ 构建失败，请查看上方错误信息', 'red');
  }
  
  printNextSteps();
  
  log('\n📚 更多帮助:', 'cyan');
  log('   • 部署指南: DEPLOYMENT-README.md');
  log('   • GitHub Pages 设置: GITHUB-PAGES-SETUP.md');
  log('   • 运行诊断: node scripts/setup-github-pages.js');
}

if (require.main === module) {
  main().catch(error => {
    log('\n💥 脚本执行出错: ' + error.message, 'red');
    process.exit(1);
  });
}

module.exports = { main, checkPackageJson, runBuildTest };