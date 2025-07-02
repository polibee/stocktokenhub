const fs = require('fs-extra');
const path = require('path');

// 读取产品数据
const productsData = require('../data/products.json');

// 目录路径
const DOCS_PRODUCTS_DIR = path.join(__dirname, '../docs/products');

// 确保目录存在
async function ensureDirectories() {
  await fs.ensureDir(DOCS_PRODUCTS_DIR);
}

// 生成产品Markdown文件
function generateProductMarkdown(product) {
  const slug = product.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  return `---
sidebar_position: 1
title: ${product.name} (${product.symbol})
description: ${product.description}
keywords: [${product.symbol}, ${product.name}, 代币化股票, tokenized stock, backed finance]
---

# ${product.name} (${product.symbol})

${product.logo ? `<div style={{textAlign: 'center', marginBottom: '2rem'}}>
  <img src="${product.logo}" alt="${product.name} Logo" style={{width: '80px', height: '80px', borderRadius: '12px'}} />
</div>` : ''}

## 📊 基本信息

| 项目 | 详情 |
|------|------|
| **代币名称** | ${product.name} |
| **代币符号** | ${product.symbol} |
| **类型** | ${product.category === 'etf' ? 'ETF代币化' : '股票代币化'} |
| **底层资产** | ${product.underlyingAsset} |
| **区块链** | ${product.chain} |
| **发行方** | ${product.issuer} |
${product.contractAddress ? `| **合约地址** | \`${product.contractAddress}\` |` : ''}

## 📝 产品描述

${product.description}

### 🔑 核心特性

- **1:1 支持**: 每个代币都由相应的底层股票/ETF完全支持
- **24/7 交易**: 突破传统市场时间限制，随时交易
- **自托管**: 完全控制您的资产，无需第三方托管
- **DeFi 集成**: 可用作抵押品参与去中心化金融
- **合规发行**: 在欧盟监管框架下发行

## 💼 交易平台

### 中心化交易所 (CEX)

| 平台 | 手续费 | KYC要求 | 优势 |
|------|--------|---------|------|
| **INX** | 0.25% | 是 | 受监管，专业投资者平台 |
| **Kraken** | 0.16% | 是 | 老牌交易所，高流动性 |

### 去中心化交易所 (DEX)

| 平台 | 手续费 | KYC要求 | 优势 |
|------|--------|---------|------|
| **Jupiter** | ~0.25% | 否 | Solana最佳价格聚合 |
| **Uniswap** | 0.3% | 否 | 以太坊最大DEX |
| **SushiSwap** | 0.25% | 否 | 多链支持 |

### 🔗 快速交易链接

- [在 Jupiter 上交易](https://jup.ag/swap/USDC-${product.symbol})
- [在 Uniswap 上交易](https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=${product.symbol})
- [在 INX 上交易](https://trading.inx.co/)

## ⚖️ 合规信息

${product.complianceInfo}

### 📋 重要合规要点

- ✅ **欧盟监管**: 在欧盟证券法框架下发行
- ✅ **合格投资者**: 仅向合格投资者提供
- ❌ **美国限制**: 不向美国人员提供
- ❌ **英国限制**: 不向英国客户提供
- ✅ **透明度**: 完整的法律文档可供查阅

### 📄 法律文档

- [产品说明书](${product.factsheetUrl})
- [合规文档](https://assets.backed.fi/legal-documentation)
- [风险披露](https://assets.backed.fi/legal-documentation)

## 🛡️ 安全与托管

### 资产安全
- **持牌托管**: 底层资产由持牌托管机构安全保管
- **账户控制协议**: 通过账户控制协议确保资产安全
- **区块链透明**: 所有交易在区块链上公开透明
- **法律保护**: 代币持有者对抵押品价值享有直接权利

### 风险管理
- **实时监控**: 24/7 监控底层资产和代币价格
- **流动性管理**: 确保充足的市场流动性
- **合规监督**: 持续的合规监督和报告

## 📈 使用场景

### 传统投资者
- 获得传统股票敞口的同时享受区块链优势
- 24/7 交易灵活性
- 自托管控制权

### DeFi 用户
- 将代币化股票用作DeFi协议中的抵押品
- 参与流动性挖矿
- 构建多元化的链上投资组合

### 机构投资者
- 高效的资产配置工具
- 降低运营成本
- 增强投资组合流动性

## ⚠️ 风险提示

:::warning 投资风险警示

- **市场风险**: 代币价格会跟随底层资产波动
- **流动性风险**: 某些时段可能存在流动性不足
- **技术风险**: 智能合约和区块链技术相关风险
- **监管风险**: 监管政策变化可能影响产品可用性
- **汇率风险**: 涉及不同货币的汇率波动风险

**投资前请务必**:
- 仔细阅读产品说明书和风险披露
- 确保您符合合格投资者要求
- 了解相关法律法规
- 考虑您的风险承受能力

:::

## 📞 获取帮助

如果您对 ${product.symbol} 有任何疑问，请查看:

- [常见问题](/docs/faq)
- [交易教程](/docs/tutorials/intro)
- [合规信息](/docs/compliance)
- [联系我们](https://backed.fi/contact)

---

*最后更新: ${new Date().toISOString().split('T')[0]}*
*数据来源: Backed Finance*
`;
}

// 生成产品概览页面
function generateProductsOverview(products) {
  const stockProducts = products.filter(p => p.category === 'stock');
  const etfProducts = products.filter(p => p.category === 'etf');
  
  const content = `---
sidebar_position: 1
title: 代币化资产产品
description: 查看所有支持的代币化股票和ETF产品
keywords: [代币化股票, tokenized stocks, backed finance, 区块链投资]
---

# 代币化资产产品

欢迎来到代币化资产产品中心！这里汇集了由 [Backed Finance](https://backed.fi) 发行的所有代币化股票和ETF产品。

## 🌟 产品特色

- **🔒 1:1 资产支持**: 每个代币都由相应的底层资产完全支持
- **⏰ 24/7 交易**: 突破传统市场时间限制
- **🔐 自托管**: 完全控制您的数字资产
- **🌐 全球访问**: 为合格的非美国投资者提供服务
- **⚖️ 合规发行**: 在欧盟监管框架下发行

## 📈 代币化股票

<div className="product-grid">

${stockProducts.map(product => `### [${product.name}](${product.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-')})

<div className="product-card">
  <div className="product-header">
    ${product.logo ? `<img src="${product.logo}" alt="${product.name}" className="product-logo" />` : ''}
    <div>
      <h4>${product.symbol}</h4>
      <p>${product.underlyingAsset}</p>
    </div>
  </div>
  <p>${product.description}</p>
  <div className="product-actions">
    <a href="https://jup.ag/swap/USDC-${product.symbol}" target="_blank" className="btn-primary">在 Jupiter 交易</a>
    <a href="/docs/products/${product.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-')}" className="btn-secondary">查看详情</a>
  </div>
</div>
`).join('\n')}

</div>

## 🏦 代币化ETF

<div className="product-grid">

${etfProducts.map(product => `### [${product.name}](${product.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-')})

<div className="product-card">
  <div className="product-header">
    ${product.logo ? `<img src="${product.logo}" alt="${product.name}" className="product-logo" />` : ''}
    <div>
      <h4>${product.symbol}</h4>
      <p>${product.underlyingAsset}</p>
    </div>
  </div>
  <p>${product.description}</p>
  <div className="product-actions">
    <a href="https://jup.ag/swap/USDC-${product.symbol}" target="_blank" className="btn-primary">在 Jupiter 交易</a>
    <a href="/docs/products/${product.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-')}" className="btn-secondary">查看详情</a>
  </div>
</div>
`).join('\n')}

</div>

## 🚀 如何开始

### 1. 了解基础知识
- [什么是代币化股票？](/docs/tutorials/basics)
- [区块链和钱包基础](/docs/tutorials/basics#区块链基础)
- [合规要求](/docs/compliance)

### 2. 选择交易平台
- [平台对比分析](/docs/platforms/compare)
- [中心化 vs 去中心化](/docs/tutorials/intro)

### 3. 开始交易
- [CEX 交易教程](/docs/tutorials/cex)
- [DEX 交易教程](/docs/tutorials/dex)
- [高级交易策略](/docs/tutorials/advanced)

## 📊 平台对比

| 特性 | 中心化交易所 (CEX) | 去中心化交易所 (DEX) |
|------|-------------------|---------------------|
| **KYC要求** | ✅ 需要 | ❌ 不需要 |
| **手续费** | 0.16% - 0.25% | 0.25% - 0.3% |
| **流动性** | 🟢 高 | 🟡 中等 |
| **用户体验** | 🟢 简单 | 🟡 需要技术知识 |
| **资产控制** | ❌ 平台托管 | ✅ 自托管 |
| **交易时间** | ⏰ 24/7 | ⏰ 24/7 |

## ⚠️ 重要提示

:::warning 投资前必读

- **合格投资者**: 仅向符合条件的合格投资者提供
- **地域限制**: 不向美国人员和英国客户提供
- **风险提示**: 投资有风险，请仔细阅读风险披露
- **合规要求**: 请确保遵守当地法律法规

:::

## 📞 需要帮助？

- 📚 [常见问题解答](/docs/faq)
- 🎓 [交易教程](/docs/tutorials/intro)
- ⚖️ [合规信息](/docs/compliance)
- 💬 [社区支持](https://t.me/stocktokenhub)

---

<style>
{
\`.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.product-card {
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--ifm-background-surface-color);
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: var(--ifm-color-primary);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.product-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--ifm-color-primary);
  color: white;
}

.btn-secondary {
  background: transparent;
  color: var(--ifm-color-primary);
  border: 1px solid var(--ifm-color-primary);
}

.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-1px);
  text-decoration: none;
}
\`
}
</style>

*数据更新时间: ${new Date().toISOString().split('T')[0]}*
*数据来源: [Backed Finance](https://backed.fi)*
`;
  
  return content;
}

// 主函数
async function main() {
  try {
    console.log('开始生成产品文档...');
    
    // 确保目录存在
    await ensureDirectories();
    
    // 生成各个产品的Markdown文件
    for (const product of productsData) {
      const slug = product.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const markdown = generateProductMarkdown(product);
      await fs.writeFile(path.join(DOCS_PRODUCTS_DIR, `${slug}.md`), markdown);
      console.log(`生成产品页面: ${slug}.md`);
    }
    
    // 生成产品概览页面
    const overviewMarkdown = generateProductsOverview(productsData);
    await fs.writeFile(path.join(DOCS_PRODUCTS_DIR, 'overview.md'), overviewMarkdown);
    console.log('生成产品概览页面: overview.md');
    
    console.log(`\n✅ 成功生成 ${productsData.length} 个产品页面 + 1 个概览页面`);
    
  } catch (error) {
    console.error('生成文档过程中出现错误:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { main, generateProductMarkdown, generateProductsOverview };