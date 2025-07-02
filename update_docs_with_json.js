const fs = require('fs');
const path = require('path');

// 读取products.json数据
const productsData = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));

// 创建产品ID到数据的映射
const productMap = {};
productsData.forEach(product => {
    productMap[product.id] = product;
});

// 获取所有产品文档文件
const docsDir = './docs/products';
const files = fs.readdirSync(docsDir).filter(file => file.endsWith('.md'));

console.log(`Found ${files.length} product documents to update`);

files.forEach(file => {
    const filePath = path.join(docsDir, file);
    const productId = file.replace('.md', '');
    
    if (!productMap[productId]) {
        console.log(`No data found for ${productId}, skipping...`);
        return;
    }
    
    const product = productMap[productId];
    console.log(`Updating ${file}...`);
    
    // 读取现有文档内容
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 提取frontmatter和标题部分
    const lines = content.split('\n');
    let frontmatterEnd = -1;
    let titleLine = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('---') && i > 0) {
            frontmatterEnd = i;
        }
        if (lines[i].startsWith('# ')) {
            titleLine = i;
            break;
        }
    }
    
    // 构建新的文档内容
    const newContent = `---
sidebar_position: ${lines[1].split(': ')[1]}
---

# ${product.name} - ${product.symbol}

![${product.name} Logo](${product.logo})

## Product Overview

**${product.name}** ${product.description}

${product.investmentObjective}

## Key Benefits

${product.keyBenefits}

## Basic Information

| Attribute | Value |
|------|----|
| **Token Symbol** | ${product.name} |
| **Underlying Asset** | ${product.underlyingAsset.name} (${product.symbol}) |
| **Blockchain** | ${product.chain.charAt(0).toUpperCase() + product.chain.slice(1)} |
| **Contract Address** | \`${product.contractAddress}\` |
| **ISIN** | ${product.isin} |
| **Issuer** | ${product.issuer} |

## Product Features

- ✅ **Compliance**: Fully compliant tokenized stock meeting regulatory requirements
- ✅ **Transparency**: Real-time tracking of underlying stock price
- ✅ **Liquidity**: 24/7 trading without traditional stock market time restrictions
- ✅ **Low Fees**: Lower fee structure compared to traditional stock trading
- ✅ **Global Access**: Supports global investors (excluding US investors)

## Fee Structure

- **Management Fee**: ${product.fees.managementFee}
- **Issuance/Redemption Fee**: ${product.fees.issuanceRedemptionFee}

## Underlying Asset Details

| Attribute | Value |
|------|----|
| **Name** | ${product.underlyingAsset.name} |
| **Trading Symbol** | ${product.underlyingAsset.symbol} |
| **ISIN** | ${product.underlyingAsset.isin} |
| **Issuer** | ${product.underlyingAsset.issuer} |

## Service Providers

| Role | Provider |
|------|----|
| **Tokenization Service** | ${product.serviceProviders.tokenizer} |
| **Broker** | ${product.serviceProviders.broker} |
| **Custodian** | ${product.serviceProviders.custodian} |
| **Security Agent** | ${product.serviceProviders.securityAgent} |

## Risk Warning

:::warning Important Notice
- This product is not sold to US persons
- Token prices will fluctuate with underlying stock price movements
- Please carefully read relevant legal documents before investing
- Past performance does not represent future returns
:::

## Related Links

- [CoinGecko Page](https://www.coingecko.com/)
- [TradingView Chart](https://www.tradingview.com/)
- [Backed Finance Official Website](https://backed.fi/)

---

*Last Updated: 2025/7/2*
`;
    
    // 写入新内容
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Updated ${file}`);
});

console.log('\n🎉 All product documents have been updated with English content!');
console.log('📝 All Chinese content has been replaced with data from products.json');