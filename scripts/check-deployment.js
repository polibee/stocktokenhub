#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const SITE_URL = 'https://polibee.github.io/stocktokenhub';
const TIMEOUT = 10000; // 10秒超时

// 检查的页面列表
const PAGES_TO_CHECK = [
  '/',
  '/blog/',
  '/docs/',
  '/tutorials/',
  '/sitemap.xml',
  '/robots.txt'
];

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

// 检查单个URL
function checkUrl(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = https.get(url, { timeout: TIMEOUT }, (res) => {
      const responseTime = Date.now() - startTime;
      
      resolve({
        url,
        status: res.statusCode,
        responseTime,
        success: res.statusCode >= 200 && res.statusCode < 400
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        status: 0,
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        responseTime: TIMEOUT,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

// 主检查函数
async function checkDeployment() {
  log('🔍 检查网站部署状态...', 'blue');
  log(`📍 网站地址: ${SITE_URL}`, 'blue');
  log('', 'reset');
  
  const results = [];
  
  for (const page of PAGES_TO_CHECK) {
    const fullUrl = `${SITE_URL}${page}`;
    log(`检查: ${page}`, 'yellow');
    
    const result = await checkUrl(fullUrl);
    results.push(result);
    
    if (result.success) {
      log(`✅ ${page} - ${result.status} (${result.responseTime}ms)`, 'green');
    } else {
      log(`❌ ${page} - ${result.status || 'ERROR'} (${result.error || 'Unknown error'})`, 'red');
    }
  }
  
  log('', 'reset');
  
  // 生成报告
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const successRate = (successCount / totalCount * 100).toFixed(1);
  
  log('📊 部署检查报告:', 'blue');
  log(`✅ 成功: ${successCount}/${totalCount} (${successRate}%)`, successCount === totalCount ? 'green' : 'yellow');
  
  if (successCount === totalCount) {
    log('🎉 网站部署成功，所有页面正常访问！', 'green');
  } else {
    log('⚠️  部分页面无法访问，请检查部署状态', 'yellow');
  }
  
  // 保存检查结果
  const reportPath = path.join(__dirname, '..', 'deployment-check-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    siteUrl: SITE_URL,
    results,
    summary: {
      total: totalCount,
      success: successCount,
      successRate: parseFloat(successRate)
    }
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`📄 详细报告已保存到: ${reportPath}`, 'blue');
  
  // 返回退出码
  process.exit(successCount === totalCount ? 0 : 1);
}

// 运行检查
if (require.main === module) {
  checkDeployment().catch(error => {
    log(`❌ 检查过程中发生错误: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { checkDeployment, checkUrl };