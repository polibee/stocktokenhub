const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const cheerio = require('cheerio');

// 配置
const BASE_URL = 'http://localhost:3000';
const OUTPUT_FILE = 'scripts/404-report.json';

// 需要检查的页面路径
const PAGES_TO_CHECK = [
  '/',
  '/docs/products/overview',
  '/docs/products/baapl',
  '/docs/products/btsla',
  '/docs/products/bmsft',
  '/docs/products/bgoogl',
  '/docs/products/bnvda',
  '/docs/products/bgme',
  '/docs/products/bmstr',
  '/docs/products/bcoin',
  '/docs/products/bcspx',
  '/docs/products/bib01',
  '/docs/platforms/compare',
  '/docs/tutorials/intro',
  '/docs/tutorials/basics',
  '/docs/tutorials/cex',
  '/docs/tutorials/dex',
  '/docs/tutorials/advanced',
  '/docs/faq',
  '/docs/compliance'
];

// 检查单个页面
async function checkPage(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: function (status) {
        return status < 500; // 只有5xx错误才抛出异常
      }
    });
    
    return {
      url,
      status: response.status,
      statusText: response.statusText,
      isError: response.status >= 400,
      title: extractTitle(response.data)
    };
  } catch (error) {
    return {
      url,
      status: 'ERROR',
      statusText: error.message,
      isError: true,
      title: null
    };
  }
}

// 提取页面标题
function extractTitle(html) {
  try {
    const $ = cheerio.load(html);
    return $('title').text() || $('h1').first().text() || 'No title found';
  } catch (error) {
    return 'Failed to extract title';
  }
}

// 检查所有页面
async function checkAllPages() {
  console.log(`开始检查 ${PAGES_TO_CHECK.length} 个页面...`);
  
  const results = [];
  const errors = [];
  
  for (const pagePath of PAGES_TO_CHECK) {
    const fullUrl = `${BASE_URL}${pagePath}`;
    console.log(`检查: ${fullUrl}`);
    
    const result = await checkPage(fullUrl);
    results.push(result);
    
    if (result.isError) {
      errors.push(result);
      console.log(`❌ ${result.status} - ${pagePath}`);
    } else {
      console.log(`✅ ${result.status} - ${pagePath}`);
    }
    
    // 添加延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return { results, errors };
}

// 生成报告
function generateReport(results, errors) {
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalPages: results.length,
    errorPages: errors.length,
    successPages: results.length - errors.length,
    results: results,
    errors: errors
  };
  
  return report;
}

// 主函数
async function main() {
  try {
    console.log('🔍 开始404页面检测...');
    
    const { results, errors } = await checkAllPages();
    const report = generateReport(results, errors);
    
    // 保存报告
    await fs.ensureDir(path.dirname(OUTPUT_FILE));
    await fs.writeJson(OUTPUT_FILE, report, { spaces: 2 });
    
    console.log('\n📊 检测结果:');
    console.log(`总页面数: ${report.totalPages}`);
    console.log(`成功页面: ${report.successPages}`);
    console.log(`错误页面: ${report.errorPages}`);
    
    if (errors.length > 0) {
      console.log('\n❌ 发现以下错误页面:');
      errors.forEach(error => {
        console.log(`  ${error.url} - ${error.status} ${error.statusText}`);
      });
    }
    
    console.log(`\n📄 详细报告已保存到: ${OUTPUT_FILE}`);
    
    // 如果有错误，退出码为1
    if (errors.length > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('检测过程中发生错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { checkPage, checkAllPages, generateReport };