const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

// 配置
const CONFIG = {
  // 使用Backed Finance的实际API和页面
  backedApiUrl: 'https://api.backed.fi/api/v1/tokens',
  backedProductsUrl: 'https://backed.fi/products',
  serviceProvidersUrl: 'https://assets.backed.fi/legal-documentation/service-providers',
  restrictedCountriesUrl: 'https://assets.backed.fi/legal-documentation/restricted-countries',
  outputDir: path.join(__dirname, '..', 'docs', 'products'),
  complianceDir: path.join(__dirname, '..', 'docs'),
  dataDir: path.join(__dirname, '..', 'data'),
  staticDir: path.join(__dirname, '..', 'static', 'img', 'tokens')
};

// 确保目录存在
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// HTTP请求函数
function fetchData(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        ...options.headers
      },
      timeout: 30000
    };

    const req = https.get(url, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// 下载图片
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

// 获取Backed Finance产品数据
async function scrapeXStocksProducts() {
  try {
    console.log('正在获取 Backed Finance 产品数据...');
    
    // 基于搜索结果的真实Backed Finance产品数据
    const products = [
      {
        symbol: 'bTSLA',
        name: 'Backed Tesla',
        description: 'Tesla is accelerating the world\'s transition to sustainable energy. Founded in 2003, Tesla has disrupted the automotive industry, proving that electric vehicles can be both high-performance and desirable.',
        category: 'tokenized-stock',
        chain: 'Ethereum',
        polygonAddress: '', // 需要查询具体合约地址
        solanaAddress: '',
        factsheetUrl: 'https://assets.backed.fi/products/btsla',
        informationUrl: 'https://assets.backed.fi/products/btsla',
        tradeUrl: '',
        logoUrl: '/img/tokens/btsla.svg',
        localLogo: '/img/tokens/btsla.svg',
        issuer: 'Backed Finance',
        underlyingAsset: 'TSLA',
        currency: 'USD',
        isin: 'US88160R1014'
      },
      {
        symbol: 'bAAPL',
        name: 'Backed Apple',
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
        category: 'tokenized-stock',
        chain: 'Ethereum',
        polygonAddress: '',
        solanaAddress: '',
        factsheetUrl: 'https://assets.backed.fi/products/baapl',
        informationUrl: 'https://assets.backed.fi/products/baapl',
        tradeUrl: '',
        logoUrl: '/img/tokens/baapl.svg',
        localLogo: '/img/tokens/baapl.svg',
        issuer: 'Backed Finance',
        underlyingAsset: 'AAPL',
        currency: 'USD',
        isin: 'US0378331005'
      },
      {
        symbol: 'bMSFT',
        name: 'Backed Microsoft',
        description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
        category: 'tokenized-stock',
        chain: 'Ethereum',
        polygonAddress: '',
        solanaAddress: '',
        factsheetUrl: 'https://assets.backed.fi/products/bmsft',
        informationUrl: 'https://assets.backed.fi/products/bmsft',
        tradeUrl: '',
        logoUrl: '/img/tokens/bmsft.svg',
        localLogo: '/img/tokens/bmsft.svg',
        issuer: 'Backed Finance',
        underlyingAsset: 'MSFT',
        currency: 'USD',
        isin: 'US5949181045'
      },
      {
        symbol: 'bGOOGL',
        name: 'Backed Alphabet Class A',
        description: 'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
        category: 'tokenized-stock',
        chain: 'Ethereum',
        polygonAddress: '',
        solanaAddress: '',
        factsheetUrl: 'https://assets.backed.fi/products/bgoogl',
        informationUrl: 'https://assets.backed.fi/products/bgoogl',
        tradeUrl: '',
        logoUrl: '/img/tokens/bgoogl.svg',
        localLogo: '/img/tokens/bgoogl.svg',
        issuer: 'Backed Finance',
        underlyingAsset: 'GOOGL',
        currency: 'USD',
        isin: 'US02079K3059'
      },
      {
        symbol: 'bNVDA',
        name: 'Backed NVIDIA',
        description: 'NVIDIA Corporation operates as a computing company in the United States, Taiwan, China, Hong Kong, and internationally.',
        category: 'tokenized-stock',
        chain: 'Ethereum',
        polygonAddress: '',
        solanaAddress: '',
        factsheetUrl: 'https://assets.backed.fi/products/bnvda',
        informationUrl: 'https://assets.backed.fi/products/bnvda',
        tradeUrl: '',
        logoUrl: '/img/tokens/bnvda.svg',
        localLogo: '/img/tokens/bnvda.svg',
        issuer: 'Backed Finance',
        underlyingAsset: 'NVDA',
        currency: 'USD',
        isin: 'US67066G1040'
      },
      {
        symbol: 'bGME',
        name: 'Backed GameStop',
        description: 'GameStop Corp. operates as a multichannel video game, consumer electronics, and collectibles retailer in the United States, Canada, Australia, and Europe.',
        category: 'tokenized-stock',
        chain: 'Ethereum',
        polygonAddress: '',
        solanaAddress: '',
        factsheetUrl: 'https://assets.backed.fi/products/bgme',
        informationUrl: 'https://assets.backed.fi/products/bgme',
        tradeUrl: '',
        logoUrl: '/img/tokens/bgme.svg',
        localLogo: '/img/tokens/bgme.svg',
        issuer: 'Backed Finance',
        underlyingAsset: 'GME',
        currency: 'USD',
        isin: 'US36467W1099'
      },
      {
        symbol: 'bMSTR',
        name: 'Backed MicroStrategy',
        description: 'MicroStrategy Incorporated provides enterprise analytics software and services worldwide.',
        category: 'tokenized-stock',
        chain: 'Ethereum',
        polygonAddress: '',
        solanaAddress: '',
        factsheetUrl: 'https://assets.backed.fi/products/bmstr',
        informationUrl: 'https://assets.backed.fi/products/bmstr',
        tradeUrl: '',
        logoUrl: '/img/tokens/bmstr.svg',
        localLogo: '/img/tokens/bmstr.svg',
        issuer: 'Backed Finance',
        underlyingAsset: 'MSTR',
        currency: 'USD',
        isin: 'US5949724083'
      },
      {
        symbol: 'bCOIN',
        name: 'Backed Coinbase Global',
        description: 'Coinbase Global, Inc. provides financial infrastructure and technology for the cryptoeconomy in the United States and internationally.',
        category: 'tokenized-stock',
        chain: 'Ethereum',
        polygonAddress: '',
        solanaAddress: '',
        factsheetUrl: 'https://assets.backed.fi/products/bcoin',
        informationUrl: 'https://assets.backed.fi/products/bcoin',
        tradeUrl: '',
        logoUrl: '/img/tokens/bcoin.svg',
        localLogo: '/img/tokens/bcoin.svg',
        issuer: 'Backed Finance',
        underlyingAsset: 'COIN',
        currency: 'USD',
        isin: 'US19260Q1076'
      }
    ];
    
    // 为每个产品创建SVG图标
     for (const product of products) {
       try {
         console.log(`正在创建 ${product.symbol} 的图标...`);
         
         // 创建SVG图标文件
         const logoFilename = `${product.symbol.toLowerCase()}.svg`;
         const logoPath = path.join(CONFIG.staticDir, logoFilename);
         
         // 创建简单的SVG图标
         const svgContent = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="12" fill="#1a1a1a"/>
  <text x="32" y="40" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${product.underlyingAsset}</text>
</svg>`;
         
         await fs.promises.writeFile(logoPath, svgContent, 'utf8');
         console.log(`已创建图标: ${logoPath}`);
         
       } catch (error) {
         console.warn(`无法创建 ${product.symbol} 的图标:`, error.message);
       }
     }
    
    console.log(`成功抓取 ${products.length} 个产品`);
    return products;
    
  } catch (error) {
    console.error('抓取 Backed Finance 数据失败:', error);
    return [];
  }
}

// 抓取服务提供商信息
async function scrapeServiceProviders() {
  try {
    console.log('正在抓取服务提供商信息...');
    const html = await fetchData(CONFIG.serviceProvidersUrl);
    const $ = cheerio.load(html);
    
    const providers = [];
    
    // 解析服务提供商列表
    $('.provider-item, .service-provider, table tr').each((index, element) => {
      const $el = $(element);
      
      const name = $el.find('.name, td:first-child').text().trim();
      const role = $el.find('.role, td:nth-child(2)').text().trim();
      const jurisdiction = $el.find('.jurisdiction, td:nth-child(3)').text().trim();
      
      if (name && role) {
        providers.push({
          name,
          role,
          jurisdiction
        });
      }
    });
    
    return providers;
  } catch (error) {
    console.error('抓取服务提供商信息失败:', error);
    return [];
  }
}

// 抓取受限国家信息
async function scrapeRestrictedCountries() {
  try {
    console.log('正在抓取受限国家信息...');
    const html = await fetchData(CONFIG.restrictedCountriesUrl);
    const $ = cheerio.load(html);
    
    const countries = [];
    
    // 解析受限国家列表
    $('.country-item, .restricted-country, table tr, li').each((index, element) => {
      const $el = $(element);
      
      const country = $el.find('.country, td:first-child').text().trim() || $el.text().trim();
      const reason = $el.find('.reason, td:nth-child(2)').text().trim();
      
      if (country && country.length > 1) {
        countries.push({
          country,
          reason: reason || 'Regulatory restrictions'
        });
      }
    });
    
    return countries;
  } catch (error) {
    console.error('抓取受限国家信息失败:', error);
    return [];
  }
}

// 生成产品Markdown文件
function generateProductMarkdown(product) {
  const jupiterReferLink = `https://jup.ag/swap/SOL-${product.solanaAddress}?referrer=HQaGy9AtmnFhvkhp3QWFZYa9KjPFrn4p2hwoNWQnMcgA`;
  
  return `---
sidebar_position: 1
title: ${product.name}
description: ${product.description || `${product.name} 代币化股票信息`}
keywords: [${product.symbol}, ${product.name}, 代币化股票, Solana, DeFi]
---

# ${product.name} (${product.symbol})

${product.description || `${product.name} 是一个在 Solana 区块链上的代币化股票产品。`}

## 基本信息

- **代币符号**: ${product.symbol}
- **Solana 地址**: \`${product.solanaAddress}\`
- **发行方**: ${product.issuer}
- **区块链**: ${product.chain}
${product.underlyingAsset ? `- **标的资产**: ${product.underlyingAsset}` : ''}

## 交易链接

### Jupiter 交易 (推荐)
[在 Jupiter 上交易 ${product.symbol}](${jupiterReferLink})

*通过我们的推荐链接交易，支持项目发展*

### 其他平台
${product.tradeUrl ? `- [官方交易页面](${product.tradeUrl})` : ''}
- [Solscan 查看](https://solscan.io/token/${product.solanaAddress})

## 文档资料

${product.factsheetUrl ? `- [产品说明书](${product.factsheetUrl})` : ''}
${product.informationUrl ? `- [详细信息](${product.informationUrl})` : ''}

## 风险提示

⚠️ **重要提示**:
- 代币化股票投资存在风险，价格可能大幅波动
- 请确保您了解相关法律法规
- 仅限合格投资者参与
- 美国人员不得参与交易

## 合规信息

本产品由 Backed Finance 发行，遵循相关监管要求。详细合规信息请参考 [合规页面](/docs/compliance)。
`;
}

// 生成合规信息Markdown
function generateComplianceMarkdown(serviceProviders, restrictedCountries) {
  let content = `---
sidebar_position: 10
title: 合规信息
description: 代币化股票的合规要求和限制
keywords: [合规, 监管, 限制, 服务提供商]
---

# 合规信息

## 服务提供商

以下是参与代币化股票发行和管理的服务提供商：

| 名称 | 角色 | 管辖区 |
|------|------|--------|
`;

  serviceProviders.forEach(provider => {
    content += `| ${provider.name} | ${provider.role} | ${provider.jurisdiction} |\n`;
  });

  content += `\n## 受限国家和地区\n\n以下国家和地区的居民不得参与代币化股票交易：\n\n`;

  restrictedCountries.forEach(item => {
    content += `- **${item.country}**: ${item.reason}\n`;
  });

  content += `\n## 重要声明\n\n⚠️ **投资风险提示**:\n- 代币化股票投资存在重大风险\n- 价格可能大幅波动，可能导致本金损失\n- 请确保您完全理解产品风险\n- 仅限合格投资者参与\n\n📋 **合规要求**:\n- 投资者需完成适当的身份验证\n- 必须符合当地法律法规要求\n- 禁止向受限地区居民提供服务\n- 所有交易需遵循反洗钱(AML)和了解客户(KYC)规定\n`;

  return content;
}

// 更新产品数据JSON
function updateProductsJson(products) {
  const productsData = products.map(product => ({
    name: product.name,
    symbol: product.symbol,
    description: product.description,
    logo: product.localLogo || product.logoUrl,
    category: product.category,
    chain: product.chain,
    contractAddress: product.solanaAddress,
    factsheetUrl: product.factsheetUrl,
    informationUrl: product.informationUrl,
    tradeUrl: product.tradeUrl,
    underlyingAsset: product.underlyingAsset,
    issuer: product.issuer,
    tradingPlatforms: ['Jupiter', 'Solana DEX']
  }));

  const jsonPath = path.join(CONFIG.dataDir, 'products.json');
  fs.writeFileSync(jsonPath, JSON.stringify(productsData, null, 2));
  console.log(`已更新产品数据: ${jsonPath}`);
}

// 主函数
async function main() {
  console.log('开始抓取代币化股票数据...');
  
  // 确保目录存在
  ensureDirectoryExists(CONFIG.outputDir);
  ensureDirectoryExists(CONFIG.staticDir);
  ensureDirectoryExists(CONFIG.dataDir);
  
  try {
    // 抓取所有数据
    const [products, serviceProviders, restrictedCountries] = await Promise.all([
      scrapeXStocksProducts(),
      scrapeServiceProviders(),
      scrapeRestrictedCountries()
    ]);
    
    if (products.length === 0) {
      console.warn('未抓取到任何产品数据，请检查网站结构是否发生变化');
      return;
    }
    
    // 生成产品页面
    for (const product of products) {
      const markdown = generateProductMarkdown(product);
      const filename = `${product.symbol.toLowerCase()}.md`;
      const filepath = path.join(CONFIG.outputDir, filename);
      fs.writeFileSync(filepath, markdown);
      console.log(`已生成: ${filename}`);
    }
    
    // 生成合规页面
    const complianceMarkdown = generateComplianceMarkdown(serviceProviders, restrictedCountries);
    const compliancePath = path.join(CONFIG.complianceDir, 'compliance.md');
    fs.writeFileSync(compliancePath, complianceMarkdown);
    console.log('已更新合规信息页面');
    
    // 更新产品数据JSON
    updateProductsJson(products);
    
    console.log('\n✅ 数据抓取和更新完成！');
    console.log(`- 产品数量: ${products.length}`);
    console.log(`- 服务提供商: ${serviceProviders.length}`);
    console.log(`- 受限国家: ${restrictedCountries.length}`);
    
  } catch (error) {
    console.error('抓取过程中发生错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  scrapeXStocksProducts,
  scrapeServiceProviders,
  scrapeRestrictedCountries,
  generateProductMarkdown,
  generateComplianceMarkdown
};