#!/usr/bin/env node

const https = require('https');

// GitHub API 配置
const REPO_OWNER = 'polibee';
const REPO_NAME = 'stocktokenhub';
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/pages`;

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 检查 GitHub Pages 状态
function checkGitHubPages() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/pages`,
      method: 'GET',
      headers: {
        'User-Agent': 'stocktokenhub-deployment-checker',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const pagesInfo = JSON.parse(data);
            resolve({
              enabled: true,
              status: res.statusCode,
              data: pagesInfo
            });
          } else if (res.statusCode === 404) {
            resolve({
              enabled: false,
              status: res.statusCode,
              message: 'GitHub Pages not enabled for this repository'
            });
          } else {
            resolve({
              enabled: false,
              status: res.statusCode,
              message: data
            });
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// 检查工作流状态
function checkWorkflowRuns() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs?per_page=5`,
      method: 'GET',
      headers: {
        'User-Agent': 'stocktokenhub-deployment-checker',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const workflowData = JSON.parse(data);
            resolve({
              success: true,
              data: workflowData
            });
          } else {
            resolve({
              success: false,
              status: res.statusCode,
              message: data
            });
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// 主检查函数
async function main() {
  log('🔍 检查 GitHub Pages 和工作流状态...', 'blue');
  log(`📦 仓库: ${REPO_OWNER}/${REPO_NAME}`, 'blue');
  log('', 'reset');
  
  try {
    // 检查 GitHub Pages 状态
    log('📄 检查 GitHub Pages 状态...', 'yellow');
    const pagesStatus = await checkGitHubPages();
    
    if (pagesStatus.enabled) {
      log('✅ GitHub Pages 已启用', 'green');
      log(`📍 网站 URL: ${pagesStatus.data.html_url}`, 'green');
      log(`🔧 构建类型: ${pagesStatus.data.build_type}`, 'blue');
      log(`📊 状态: ${pagesStatus.data.status}`, 'blue');
      
      if (pagesStatus.data.source) {
        log(`🌿 源分支: ${pagesStatus.data.source.branch}`, 'blue');
        log(`📁 源路径: ${pagesStatus.data.source.path}`, 'blue');
      }
    } else {
      log('❌ GitHub Pages 未启用', 'red');
      log('💡 请按照以下步骤启用 GitHub Pages:', 'yellow');
      log('   1. 进入仓库 Settings', 'yellow');
      log('   2. 找到 Pages 部分', 'yellow');
      log('   3. 在 Source 中选择 "GitHub Actions"', 'yellow');
    }
    
    log('', 'reset');
    
    // 检查工作流状态
    log('⚙️ 检查最近的工作流运行...', 'yellow');
    const workflowStatus = await checkWorkflowRuns();
    
    if (workflowStatus.success && workflowStatus.data.workflow_runs.length > 0) {
      const recentRuns = workflowStatus.data.workflow_runs.slice(0, 3);
      
      recentRuns.forEach((run, index) => {
        const status = run.status === 'completed' ? 
          (run.conclusion === 'success' ? '✅' : '❌') : '🔄';
        const statusColor = run.status === 'completed' ? 
          (run.conclusion === 'success' ? 'green' : 'red') : 'yellow';
        
        log(`${status} ${run.name} - ${run.conclusion || run.status}`, statusColor);
        log(`   📅 ${new Date(run.created_at).toLocaleString()}`, 'blue');
        log(`   🔗 ${run.html_url}`, 'blue');
        
        if (index < recentRuns.length - 1) log('', 'reset');
      });
    } else {
      log('❌ 无法获取工作流信息', 'red');
    }
    
    log('', 'reset');
    
    // 提供建议
    if (!pagesStatus.enabled) {
      log('🚨 需要手动启用 GitHub Pages', 'red');
      log('📖 详细指南请查看: GITHUB-PAGES-SETUP.md', 'blue');
    } else if (pagesStatus.data.status !== 'built') {
      log('⏳ GitHub Pages 正在构建中，请稍等...', 'yellow');
      log('💡 通常需要 2-10 分钟完成首次部署', 'blue');
    } else {
      log('🎉 GitHub Pages 配置正确！', 'green');
      log('🔍 如果网站仍无法访问，可能是 DNS 传播延迟', 'blue');
    }
    
  } catch (error) {
    log(`❌ 检查过程中发生错误: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 运行检查
if (require.main === module) {
  main();
}

module.exports = { checkGitHubPages, checkWorkflowRuns };