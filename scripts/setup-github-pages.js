#!/usr/bin/env node

/**
 * GitHub Pages 自动设置和故障排除脚本
 * 帮助用户诊断和解决 GitHub Actions 部署问题
 */

const https = require('https');
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

function getRepoInfo() {
  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const match = remoteUrl.match(/github\.com[:\/]([^/]+)\/([^/\.]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  } catch (error) {
    log('❌ 无法获取 Git 仓库信息', 'red');
  }
  return null;
}

function checkGitHubAPI(path, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname: 'api.github.com',
      path: path,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'GitHub-Pages-Setup-Script',
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers
      }
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function checkWorkflowRuns(owner, repo) {
  log('\n🔍 检查最近的工作流运行...', 'blue');
  
  try {
    const response = await checkGitHubAPI(`/repos/${owner}/${repo}/actions/runs?per_page=5`);
    
    if (response.status === 200 && response.data.workflow_runs) {
      const runs = response.data.workflow_runs;
      
      if (runs.length === 0) {
        log('📝 没有找到工作流运行记录', 'yellow');
        return;
      }
      
      log('\n📊 最近的工作流运行:', 'cyan');
      runs.forEach((run, index) => {
        const status = run.conclusion || run.status;
        const statusColor = status === 'success' ? 'green' : 
                           status === 'failure' ? 'red' : 'yellow';
        const date = new Date(run.created_at).toLocaleString('zh-CN');
        
        log(`${index + 1}. ${run.name} - ${status}`, statusColor);
        log(`   📅 ${date}`);
        log(`   🔗 ${run.html_url}`);
        
        if (status === 'failure') {
          log(`   💡 建议: 点击链接查看详细错误信息`, 'yellow');
        }
        log('');
      });
    }
  } catch (error) {
    log('❌ 检查工作流运行失败: ' + error.message, 'red');
  }
}

async function checkGitHubPages(owner, repo) {
  log('\n📄 检查 GitHub Pages 状态...', 'blue');
  
  try {
    const response = await checkGitHubAPI(`/repos/${owner}/${repo}/pages`);
    
    if (response.status === 200) {
      log('✅ GitHub Pages 已启用', 'green');
      log(`🌐 网站地址: ${response.data.html_url}`, 'cyan');
      log(`📦 构建类型: ${response.data.build_type || 'legacy'}`);
      
      if (response.data.source) {
        log(`📂 源分支: ${response.data.source.branch || 'N/A'}`);
        log(`📁 源路径: ${response.data.source.path || '/'}`);
      }
      
      return true;
    } else if (response.status === 404) {
      log('❌ GitHub Pages 未启用', 'red');
      return false;
    } else {
      log(`⚠️  GitHub Pages 状态未知 (HTTP ${response.status})`, 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ 检查 GitHub Pages 失败: ' + error.message, 'red');
    return false;
  }
}

function printSetupInstructions(owner, repo) {
  log('\n🛠️  GitHub Pages 设置步骤:', 'magenta');
  log('\n1. 启用 GitHub Pages:');
  log(`   🔗 访问: https://github.com/${owner}/${repo}/settings/pages`, 'cyan');
  log('   📝 在 "Build and deployment" 部分');
  log('   ⚙️  Source 选择: "GitHub Actions"');
  log('   💾 点击 "Save"');
  
  log('\n2. 检查 Actions 权限:');
  log(`   🔗 访问: https://github.com/${owner}/${repo}/settings/actions`, 'cyan');
  log('   ✅ 选择: "Allow all actions and reusable workflows"');
  log('   🔐 Workflow permissions: "Read and write permissions"');
  log('   ☑️  勾选: "Allow GitHub Actions to create and approve pull requests"');
  
  log('\n3. 验证部署:');
  log('   ⏳ 等待 2-3 分钟让工作流完成');
  log('   🔍 运行: npm run check:deployment');
  log('   🌐 访问: https://' + owner + '.github.io/' + repo + '/');
}

function printTroubleshootingGuide() {
  log('\n🔧 常见问题排除:', 'magenta');
  
  log('\n❌ 构建失败:');
  log('   • 检查 package.json 中的 scripts');
  log('   • 确保 typecheck 脚本存在: "typecheck": "tsc"');
  log('   • 检查 TypeScript 配置文件');
  log('   • 查看工作流日志中的具体错误信息');
  
  log('\n🔐 权限错误:');
  log('   • 确保仓库是公开的或有 GitHub Pro');
  log('   • 检查 Actions 权限设置');
  log('   • 验证 GITHUB_TOKEN 权限');
  
  log('\n🌐 网站无法访问:');
  log('   • 确认 GitHub Pages 已启用');
  log('   • 检查 DNS 传播 (可能需要几分钟)');
  log('   • 验证构建产物在 build/ 目录');
  log('   • 检查 .nojekyll 文件是否存在');
  
  log('\n📱 移动端问题:');
  log('   • 清除浏览器缓存');
  log('   • 检查 PWA 配置');
  log('   • 验证响应式设计');
}

function checkLocalFiles() {
  log('\n📁 检查本地文件...', 'blue');
  
  const requiredFiles = [
    '.github/workflows/deploy.yml',
    'package.json',
    'docusaurus.config.ts',
    'static/.nojekyll'
  ];
  
  const fs = require('fs');
  const path = require('path');
  
  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      log(`✅ ${file}`, 'green');
    } else {
      log(`❌ ${file} (缺失)`, 'red');
      
      if (file === 'static/.nojekyll') {
        log('   💡 创建 .nojekyll 文件...', 'yellow');
        try {
          fs.mkdirSync(path.dirname(filePath), { recursive: true });
          fs.writeFileSync(filePath, '');
          log('   ✅ .nojekyll 文件已创建', 'green');
        } catch (error) {
          log('   ❌ 创建失败: ' + error.message, 'red');
        }
      }
    }
  });
}

async function main() {
  log('🚀 GitHub Pages 设置和故障排除工具', 'magenta');
  log('=' .repeat(50), 'cyan');
  
  // 检查本地文件
  checkLocalFiles();
  
  // 获取仓库信息
  const repoInfo = getRepoInfo();
  if (!repoInfo) {
    log('\n❌ 无法获取 GitHub 仓库信息', 'red');
    log('请确保在 Git 仓库目录中运行此脚本', 'yellow');
    return;
  }
  
  log(`\n📦 仓库: ${repoInfo.owner}/${repoInfo.repo}`, 'cyan');
  
  // 检查 GitHub Pages 状态
  const pagesEnabled = await checkGitHubPages(repoInfo.owner, repoInfo.repo);
  
  // 检查工作流运行
  await checkWorkflowRuns(repoInfo.owner, repoInfo.repo);
  
  // 提供设置指导
  if (!pagesEnabled) {
    printSetupInstructions(repoInfo.owner, repoInfo.repo);
  }
  
  // 故障排除指南
  printTroubleshootingGuide();
  
  log('\n' + '=' .repeat(50), 'cyan');
  log('🎯 下一步操作:', 'magenta');
  
  if (!pagesEnabled) {
    log('1. 按照上述步骤启用 GitHub Pages', 'yellow');
    log('2. 等待工作流完成 (2-3 分钟)', 'yellow');
    log('3. 重新运行此脚本验证: node scripts/setup-github-pages.js', 'yellow');
  } else {
    log('1. 检查最新的工作流运行状态', 'yellow');
    log('2. 如有失败，查看详细日志', 'yellow');
    log('3. 运行部署检查: npm run check:deployment', 'yellow');
  }
  
  log('\n📚 更多帮助: 查看 GITHUB-PAGES-SETUP.md', 'cyan');
}

if (require.main === module) {
  main().catch(error => {
    log('\n💥 脚本执行出错: ' + error.message, 'red');
    process.exit(1);
  });
}

module.exports = { main, checkGitHubPages, checkWorkflowRuns };