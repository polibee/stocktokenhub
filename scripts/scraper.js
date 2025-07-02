const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');

// 配置
const BASE_URL = 'https://assets.backed.fi';
const DATA_DIR = path.join(__dirname, '../data');
const DOCS_PRODUCTS_DIR = path.join(__dirname, '../docs/products');
const DOCS_COMPLIANCE_DIR = path.join(__dirname, '../docs/compliance');

// 确保目录存在
async function ensureDirectories() {
  await fs.ensureDir(DATA_DIR);
  await fs.ensureDir(DOCS_PRODUCTS_DIR);
  await fs.ensureDir(DOCS_COMPLIANCE_DIR);
}

// 模拟浏览器请求头
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

// 获取产品列表
async function fetchProductList() {
  try {
    console.log('正在获取产品列表...');
    const response = await axios.get(BASE_URL, { headers });
    const $ = cheerio.load(response.data);
    
    const products = [];
    
    // 根据网站结构解析产品信息
    $('.product-card, .asset-card, [data-testid="asset-card"]').each((index, element) => {
      const $el = $(element);
      
      const product = {
        name: $el.find('.product-name, .asset-name, h3, h4').first().text().trim(),
        symbol: $el.find('.symbol, .ticker, .asset-symbol').first().text().trim(),
        description: $el.find('.description, .asset-description, p').first().text().trim(),
        logo: $el.find('img').first().attr('src') || '',
        detailUrl: $el.find('a').first().attr('href') || '',
        category: 'stock', // 默认分类
        chain: 'ethereum', // 默认链
        contractAddress: '',
        factsheetUrl: '',
        complianceInfo: ''
      };
      
      if (product.name && product.symbol) {
        products.push(product);
      }
    });
    
    // 如果没有找到产品卡片，尝试其他选择器
    if (products.length === 0) {
      $('a[href*="/assets/"], a[href*="/products/"]').each((index, element) => {
        const $el = $(element);
        const href = $el.attr('href');
        const text = $el.text().trim();
        
        if (text && href) {
          const product = {
            name: text,
            symbol: text.split(' ')[0] || text,
            description: '',
            logo: '',
            detailUrl: href.startsWith('http') ? href : BASE_URL + href,
            category: 'stock',
            chain: 'ethereum',
            contractAddress: '',
            factsheetUrl: '',
            complianceInfo: ''
          };
          products.push(product);
        }
      });
    }
    
    console.log(`找到 ${products.length} 个产品`);
    return products;
  } catch (error) {
    console.error('获取产品列表失败:', error.message);
    return [];
  }
}

// 获取产品详细信息
async function fetchProductDetails(product) {
  if (!product.detailUrl) return product;
  
  try {
    console.log(`正在获取 ${product.name} 的详细信息...`);
    
    const url = product.detailUrl.startsWith('http') ? product.detailUrl : BASE_URL + product.detailUrl;
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    
    // 提取详细信息
    const description = $('.description, .asset-description, .product-description, .overview').first().text().trim() || product.description;
    const contractAddress = $('[data-testid="contract-address"], .contract-address, .address').first().text().trim();
    const factsheetUrl = $('a[href*="factsheet"], a[href*=".pdf"]').first().attr('href') || '';
    
    // 提取合规信息
    const complianceInfo = $('.compliance, .regulatory, .legal-info').first().text().trim();
    
    // 提取logo
    let logo = $('.logo img, .asset-logo img, .product-logo img').first().attr('src') || product.logo;
    if (logo && !logo.startsWith('http')) {
      logo = BASE_URL + logo;
    }
    
    return {
      ...product,
      description: description || product.description,
      logo: logo,
      contractAddress: contractAddress,
      factsheetUrl: factsheetUrl.startsWith('http') ? factsheetUrl : (factsheetUrl ? BASE_URL + factsheetUrl : ''),
      complianceInfo: complianceInfo
    };
  } catch (error) {
    console.error(`获取 ${product.name} 详细信息失败:`, error.message);
    return product;
  }
}

// 生成产品Markdown文件
function generateProductMarkdown(product) {
  const slug = product.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  return `---
sidebar_position: 1
title: ${product.name}
description: ${product.description || `${product.name} (${product.symbol}) 代币化股票详细信息`}
keywords: [${product.symbol}, ${product.name}, 代币化股票, tokenized stock]
---

# ${product.name} (${product.symbol})

${product.logo ? `![${product.name} Logo](${product.logo})` : ''}

## 基本信息

- **代币名称**: ${product.name}
- **代币符号**: ${product.symbol}
- **类型**: 代币化股票
- **区块链**: ${product.chain}
${product.contractAddress ? `- **合约地址**: \`${product.contractAddress}\`` : ''}

## 产品描述

${product.description || '暂无描述信息'}

## 交易信息

### 支持的交易平台

- [Kraken](https://kraken.com) - 中心化交易所
- [Jupiter](https://jup.ag/swap/SOL-${product.symbol}) - Solana DEX 聚合器
- [Raydium](https://raydium.io) - Solana DEX

### 手续费对比

| 平台 | 手续费 | KYC要求 | 优势 |
|------|--------|---------|------|
| Kraken | 0.16% | 是 | 合规交易所，受监管 |
| Jupiter | ~0.25% | 否 | 去中心化，最佳价格 |
| Raydium | 0.25% | 否 | 高流动性 |

## 合规信息

${product.complianceInfo || '请查看官方合规文档了解详细信息。'}

${product.factsheetUrl ? `## 相关文档\n\n- [产品说明书](${product.factsheetUrl})` : ''}

## 风险提示

⚠️ **投资风险提示**：
- 代币化股票存在价格波动风险
- 请确保了解相关法律法规
- 投资前请仔细阅读产品说明书
- 本信息仅供参考，不构成投资建议

---

*最后更新: ${new Date().toISOString().split('T')[0]}*
`;
}

// 生成产品概览页面
function generateProductsOverview(products) {
  const content = `---
sidebar_position: 1
title: 代币化股票产品
description: 查看所有支持的代币化股票产品
---

# 代币化股票产品

欢迎来到代币化股票产品中心。这里汇集了所有支持的代币化股票信息，包括详细的产品介绍、交易平台对比和合规信息。

## 产品列表

${products.map(product => `### [${product.name} (${product.symbol})](${product.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-')})

${product.description || '代币化股票产品'}

**交易平台**: Kraken, Jupiter, Raydium

---
`).join('\n')}

## 如何选择交易平台

### 中心化交易所 (CEX)
- **Kraken**: 受监管，需要KYC，手续费较低
- 适合：新手用户，大额交易

### 去中心化交易所 (DEX)
- **Jupiter**: Solana生态最佳价格聚合
- **Raydium**: 高流动性AMM
- 适合：有DeFi经验的用户

## 开始交易

1. [查看平台对比](/docs/platforms/compare)
2. [阅读交易教程](/docs/tutorials/intro)
3. [了解合规信息](/docs/compliance)

---

*数据更新时间: ${new Date().toISOString().split('T')[0]}*
`;
  
  return content;
}

// 主函数
async function main() {
  try {
    console.log('开始爬取数据...');
    
    // 确保目录存在
    await ensureDirectories();
    
    // 获取产品列表
    const products = await fetchProductList();
    
    if (products.length === 0) {
      console.log('未找到任何产品，可能需要调整选择器');
      return;
    }
    
    // 获取详细信息
    const detailedProducts = [];
    for (const product of products.slice(0, 10)) { // 限制前10个产品避免过度请求
      const detailed = await fetchProductDetails(product);
      detailedProducts.push(detailed);
      
      // 添加延迟避免被封IP
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // 保存原始数据
    await fs.writeJson(path.join(DATA_DIR, 'products.json'), detailedProducts, { spaces: 2 });
    console.log('原始数据已保存到 data/products.json');
    
    // 生成Markdown文件
    for (const product of detailedProducts) {
      const slug = product.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const markdown = generateProductMarkdown(product);
      await fs.writeFile(path.join(DOCS_PRODUCTS_DIR, `${slug}.md`), markdown);
    }
    
    // 生成产品概览页面
    const overviewMarkdown = generateProductsOverview(detailedProducts);
    await fs.writeFile(path.join(DOCS_PRODUCTS_DIR, 'overview.md'), overviewMarkdown);
    
    console.log(`成功生成 ${detailedProducts.length} 个产品页面`);
    console.log('数据爬取完成！');
    
  } catch (error) {
    console.error('爬取过程中出现错误:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { main, fetchProductList, fetchProductDetails };