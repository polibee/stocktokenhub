const fs = require('fs');
const path = require('path');

// 读取Excel提取的JSON数据
function loadExcelData() {
    const dataPath = path.join(__dirname, '../data/excel-products.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
}

// 清理和格式化产品名称，用于文件名
function sanitizeFileName(productName) {
    if (!productName) return 'unknown';
    
    // 提取产品代码（如 AAPLx, TSLAx 等）
    const match = productName.match(/([A-Z]+\.?[A-Z]*x?)/);
    if (match) {
        return match[1].toLowerCase().replace('.', '');
    }
    
    // 如果没有匹配到，使用清理后的产品名
    return productName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
}

// 获取SVG图标文件名（保持原始大小写）
function getSvgFileName(productName) {
    if (!productName) return 'unknown';
    
    // 提取产品代码（如 AAPLx, TSLAx 等）
    const match = productName.match(/([A-Z]+\.?[A-Z]*x?)/);
    if (match) {
        return match[1]; // 保持原始大小写
    }
    
    return 'unknown';
}

// 提取产品符号（如 AAPL, TSLA 等）
function extractSymbol(productName, information) {
    if (!productName) return 'UNKNOWN';
    
    // 从产品名称中提取
    const nameMatch = productName.match(/([A-Z]+\.?[A-Z]*?)x?\s/);
    if (nameMatch) {
        return nameMatch[1];
    }
    
    // 从信息中提取Symbol
    if (information) {
        const symbolMatch = information.match(/Symbol\s*\r?\n([A-Z\.]+)/i);
        if (symbolMatch) {
            return symbolMatch[1];
        }
    }
    
    return 'UNKNOWN';
}

// 提取公司名称
function extractCompanyName(productName, information) {
    if (!productName) return 'Unknown Company';
    
    // 从产品名称中提取（第二行通常是公司名）
    const lines = productName.split('\r\n');
    if (lines.length > 1) {
        return lines[1].replace(' xStock', '').trim();
    }
    
    // 从信息中提取Name
    if (information) {
        const nameMatch = information.match(/Name\s*\r?\n([^\r\n]+)/i);
        if (nameMatch) {
            return nameMatch[1].trim();
        }
    }
    
    return 'Unknown Company';
}

// 提取ISIN
function extractISIN(information) {
    if (!information) return '';
    
    const isinMatch = information.match(/ISIN\s*\r?\n([A-Z0-9]{12})/i);
    return isinMatch ? isinMatch[1] : '';
}

// 提取管理费信息
function extractManagementFee(information) {
    if (!information) return '目前免费，未来可能收取最高 0.25% 年费';
    
    const feeMatch = information.match(/Management Fee\s*\r?\n([^\r\n]+(?:\r?\n[^\r\n]+)*?)(?=\r?\n[A-Z]|\r?\n\r?\n|$)/i);
    if (feeMatch) {
        return feeMatch[1].replace(/\r?\n/g, ' ').trim();
    }
    
    return '目前免费，未来可能收取最高 0.25% 年费';
}

// 提取申购/赎回费信息
function extractIssuanceRedemptionFee(information) {
    if (!information) return '最高 0.50%';
    
    const feeMatch = information.match(/Issuance \/ Redemption Fee\s*\r?\n([^\r\n]+(?:\r?\n[^\r\n]+)*?)(?=\r?\n[A-Z]|\r?\n\r?\n|$)/i);
    if (feeMatch) {
        return feeMatch[1].replace(/\r?\n/g, ' ').trim();
    }
    
    return '最高 0.50%';
}

// 提取投资目标
function extractInvestmentObjective(information) {
    if (!information) return '';
    
    const objectiveMatch = information.match(/Investment Objective\s*\r?\n([^\r\n]+(?:\r?\n[^\r\n]+)*?)(?=\r?\n\r?\n|Key Benefits)/i);
    if (objectiveMatch) {
        return objectiveMatch[1].replace(/\r?\n/g, ' ').trim();
    }
    
    return '';
}

// 提取关键优势
function extractKeyBenefits(information) {
    if (!information) return '';
    
    const benefitsMatch = information.match(/Key Benefits\s*\r?\n([^\r\n]+(?:\r?\n[^\r\n]+)*?)(?=\r?\n\r?\n|View|Product Details)/i);
    if (benefitsMatch) {
        return benefitsMatch[1].replace(/\r?\n/g, ' ').trim();
    }
    
    return '';
}

// 提取底层资产信息
function extractUnderlyingInformation(information) {
    if (!information) return {};
    
    const underlyingSection = information.match(/Underlying Information\s*\r?\n([\s\S]*?)(?=Service Providers|Product Downloads|$)/i);
    if (!underlyingSection) return {};
    
    const underlyingText = underlyingSection[1];
    
    const result = {};
    
    // 提取发行方
    const issuerMatch = underlyingText.match(/Issuer\s*\r?\n([^\r\n]+(?:\r?\n[^\r\n]+)*?)(?=\r?\n[A-Z]|\r?\n\r?\n|$)/i);
    if (issuerMatch) {
        result.issuer = issuerMatch[1].replace(/\r?\n/g, ' ').trim();
    }
    
    // 提取ISIN
    const isinMatch = underlyingText.match(/ISIN\s*\r?\n([A-Z0-9]{12})/i);
    if (isinMatch) {
        result.isin = isinMatch[1];
    }
    
    // 提取符号
    const symbolMatch = underlyingText.match(/Symbol\s*\r?\n([A-Z\.]+)/i);
    if (symbolMatch) {
        result.symbol = symbolMatch[1];
    }
    
    // 提取名称
    const nameMatch = underlyingText.match(/Name\s*\r?\n([^\r\n]+)/i);
    if (nameMatch) {
        result.name = nameMatch[1].trim();
    }
    
    return result;
}

// 提取服务提供商
function extractServiceProviders(information) {
    if (!information) return {};
    
    const serviceSection = information.match(/Service Providers\s*\r?\n([\s\S]*?)(?=Product Downloads|$)/i);
    if (!serviceSection) return {};
    
    const serviceText = serviceSection[1];
    
    const result = {};
    
    // 提取代币化服务商
    const tokenizerMatch = serviceText.match(/Tokenizer\s*\r?\n([^\r\n]+)/i);
    if (tokenizerMatch) {
        result.tokenizer = tokenizerMatch[1].trim();
    }
    
    // 提取经纪商
    const brokerMatch = serviceText.match(/Broker\s*\r?\n([^\r\n]+(?:\r?\n[^\r\n]+)*?)(?=\r?\nCustodian|\r?\nSecurity Agent|$)/i);
    if (brokerMatch) {
        result.broker = brokerMatch[1].replace(/\r?\n/g, ', ').trim();
    }
    
    // 提取托管方
    const custodianMatch = serviceText.match(/Custodian\s*\r?\n([^\r\n]+(?:\r?\n[^\r\n]+)*?)(?=\r?\nSecurity Agent|$)/i);
    if (custodianMatch) {
        result.custodian = custodianMatch[1].replace(/\r?\n/g, ', ').trim();
    }
    
    // 提取安全代理
    const securityAgentMatch = serviceText.match(/Security Agent\s*\r?\n([^\r\n]+)/i);
    if (securityAgentMatch) {
        result.securityAgent = securityAgentMatch[1].trim();
    }
    
    return result;
}

// 提取投资目标描述
function extractDescription(information) {
    if (!information) return 'Tokenized equity tracking the underlying stock price.';
    
    // 提取Investment Objective部分
    const objectiveMatch = information.match(/Investment Objective\s*\r?\n([^\r\n]+(?:\r?\n[^\r\n]+)*?)(?=\r?\n\r?\n|Key Benefits)/i);
    if (objectiveMatch) {
        return objectiveMatch[1].replace(/\r?\n/g, ' ').trim();
    }
    
    // 提取Key Benefits部分
    const benefitsMatch = information.match(/Key Benefits\s*\r?\n([^\r\n]+(?:\r?\n[^\r\n]+)*?)(?=\r?\n\r?\n|View)/i);
    if (benefitsMatch) {
        return benefitsMatch[1].replace(/\r?\n/g, ' ').trim();
    }
    
    return 'Tokenized equity tracking the underlying stock price.';
}

// 生成产品Markdown文件
function generateProductMarkdown(product) {
    const fileName = sanitizeFileName(product.Product);
    const svgFileName = getSvgFileName(product.Product);
    const symbol = extractSymbol(product.Product, product.information);
    const companyName = extractCompanyName(product.Product, product.information);
    const description = extractDescription(product.information);
    const isin = extractISIN(product.information);
    const managementFee = extractManagementFee(product.information);
    const issuanceRedemptionFee = extractIssuanceRedemptionFee(product.information);
    const solanaAddress = product['Solana Address'] || '';
    
    // 提取新的详细信息
    const investmentObjective = extractInvestmentObjective(product.information);
    const keyBenefits = extractKeyBenefits(product.information);
    const underlyingInfo = extractUnderlyingInformation(product.information);
    const serviceProviders = extractServiceProviders(product.information);
    
    // 构建服务提供商部分
    let serviceProvidersSection = '';
    if (serviceProviders && Object.keys(serviceProviders).length > 0) {
        serviceProvidersSection = `
## 服务提供商

| 角色 | 提供商 |
|------|----|`;
        
        if (serviceProviders.tokenizer) {
            serviceProvidersSection += `
| **代币化服务商** | ${serviceProviders.tokenizer} |`;
        }
        
        if (serviceProviders.broker) {
            serviceProvidersSection += `
| **经纪商** | ${serviceProviders.broker} |`;
        }
        
        if (serviceProviders.custodian) {
            serviceProvidersSection += `
| **托管方** | ${serviceProviders.custodian} |`;
        }
        
        if (serviceProviders.securityAgent) {
            serviceProvidersSection += `
| **安全代理** | ${serviceProviders.securityAgent} |`;
        }
    }
    
    // 构建底层资产信息部分
    let underlyingInfoSection = '';
    if (underlyingInfo && Object.keys(underlyingInfo).length > 0) {
        underlyingInfoSection = `
## 底层资产详情

| 属性 | 值 |
|------|----|`;
        
        if (underlyingInfo.name) {
            underlyingInfoSection += `
| **名称** | ${underlyingInfo.name} |`;
        }
        
        if (underlyingInfo.symbol) {
            underlyingInfoSection += `
| **交易代码** | ${underlyingInfo.symbol} |`;
        }
        
        if (underlyingInfo.isin) {
            underlyingInfoSection += `
| **ISIN** | ${underlyingInfo.isin} |`;
        }
        
        if (underlyingInfo.issuer) {
            underlyingInfoSection += `
| **发行方** | ${underlyingInfo.issuer} |`;
        }
    }
    
    const markdown = `---
sidebar_position: ${product['序号'] || 1}
---

# ${symbol}x - ${companyName}

![${symbol}x Logo](/img/tokens/${svgFileName}.svg)

## 产品概述

**${symbol}x** 是基于 Solana 区块链发行的代币化股票，追踪 ${companyName} (${symbol}) 的股价表现。

${investmentObjective || description}

${keyBenefits ? `## 主要优势

${keyBenefits}
` : ''}

## 基本信息

| 属性 | 值 |
|------|----|${isin ? `
| **代币符号** | ${symbol}x |
| **底层资产** | ${companyName} (${symbol}) |
| **区块链** | Solana |
| **合约地址** | \`${solanaAddress}\` |
| **ISIN** | ${isin} |` : `
| **代币符号** | ${symbol}x |
| **底层资产** | ${companyName} (${symbol}) |
| **区块链** | Solana |
| **合约地址** | \`${solanaAddress}\` |`}
| **发行方** | Backed Assets (JE) Limited |

## 产品特点

- ✅ **合规性**: 完全符合监管要求的代币化股票
- ✅ **透明度**: 实时追踪底层股票价格
- ✅ **流动性**: 24/7 交易，无传统股市时间限制
- ✅ **低费用**: 相比传统股票交易更低的费用结构
- ✅ **全球访问**: 支持全球投资者参与（美国投资者除外）

## 费用结构

- **管理费**: ${managementFee}
- **申购/赎回费**: ${issuanceRedemptionFee}
${underlyingInfoSection}
${serviceProvidersSection}

## 风险提示

:::warning 重要提示
- 本产品不向美国人士销售
- 代币价格会跟随底层股票价格波动
- 投资前请仔细阅读相关法律文件
- 过往表现不代表未来收益
:::

## 相关链接

- [CoinGecko 页面](https://www.coingecko.com/)
- [TradingView 图表](https://www.tradingview.com/)
- [Backed Finance 官网](https://backed.fi/)

---

*最后更新: ${new Date().toLocaleDateString('zh-CN')}*
`;

    return { fileName, markdown, symbol, companyName, solanaAddress, isin, description };
}

// 验证Sol地址和超链接一致性
function validateAddressConsistency(products) {
    console.log('\n=== Sol地址和超链接一致性验证 ===');
    
    const inconsistencies = [];
    
    products.forEach((product, index) => {
        const solanaAddress = product['Solana Address'];
        const information = product.information || '';
        const productName = product.Product || `产品${index + 1}`;
        
        if (solanaAddress && information) {
            // 检查信息中是否包含相同的地址
            if (!information.includes(solanaAddress)) {
                inconsistencies.push({
                    product: productName,
                    solanaAddress,
                    issue: '信息内容中未找到对应的Solana地址'
                });
                console.log(`❌ ${productName}: 地址不一致`);
                console.log(`   Solana地址: ${solanaAddress}`);
                console.log(`   信息中未找到此地址`);
            } else {
                console.log(`✅ ${productName}: 地址一致`);
            }
        } else {
            if (!solanaAddress) {
                inconsistencies.push({
                    product: productName,
                    issue: '缺少Solana地址'
                });
                console.log(`⚠️  ${productName}: 缺少Solana地址`);
            }
        }
    });
    
    console.log(`\n验证完成: ${inconsistencies.length} 个问题`);
    return inconsistencies;
}

// 生成产品JSON数据
function generateProductsJson(products) {
    const productsData = products
        .filter(product => product.Product && product['Solana Address']) // 过滤有效产品
        .map(product => {
            const fileName = sanitizeFileName(product.Product);
            const symbol = extractSymbol(product.Product, product.information);
            const companyName = extractCompanyName(product.Product, product.information);
            const description = extractDescription(product.information);
            const isin = extractISIN(product.information);
            const solanaAddress = product['Solana Address'];
            
            // 提取新的详细信息
            const investmentObjective = extractInvestmentObjective(product.information);
            const keyBenefits = extractKeyBenefits(product.information);
            const underlyingInfo = extractUnderlyingInformation(product.information);
            const serviceProviders = extractServiceProviders(product.information);
            const managementFee = extractManagementFee(product.information);
            const issuanceRedemptionFee = extractIssuanceRedemptionFee(product.information);
            
            return {
                id: fileName,
                name: `${symbol}x`,
                fullName: `${companyName} xStock`,
                symbol: symbol,
                description: description,
                logo: `/img/tokens/${fileName}.svg`,
                category: 'tokenized-stocks',
                chain: 'solana',
                contractAddress: solanaAddress,
                isin: isin,
                issuer: 'Backed Assets (JE) Limited',
                factsheetUrl: `https://backed.fi/`,
                informationUrl: `https://backed.fi/`,
                tradeUrl: `https://backed.fi/`,
                underlyingAsset: {
                    name: underlyingInfo.name || companyName,
                    symbol: underlyingInfo.symbol || symbol,
                    isin: underlyingInfo.isin || extractISIN(product.information),
                    issuer: underlyingInfo.issuer || ''
                },
                tradingPlatforms: ['Backed Finance'],
                // 新增的详细信息
                investmentObjective: investmentObjective,
                keyBenefits: keyBenefits,
                fees: {
                    managementFee: managementFee,
                    issuanceRedemptionFee: issuanceRedemptionFee
                },
                serviceProviders: serviceProviders
            };
        });
    
    return productsData;
}

// 检查SVG图标是否存在
function checkSvgIcons(products) {
    console.log('\n=== 检查SVG图标文件 ===');
    const tokensDir = path.join(__dirname, '../static/img/tokens');
    const missingIcons = [];
    
    products.forEach(product => {
        if (product.Product && product['Solana Address']) {
            const svgFileName = getSvgFileName(product.Product);
            const svgPath = path.join(tokensDir, `${svgFileName}.svg`);
            
            if (!fs.existsSync(svgPath)) {
                missingIcons.push(svgFileName);
                console.log(`❌ 缺少图标: ${svgFileName}.svg`);
            } else {
                console.log(`✅ 图标存在: ${svgFileName}.svg`);
            }
        }
    });
    
    console.log(`\n图标检查完成: ${missingIcons.length} 个缺失`);
    return missingIcons;
}

// 主迁移函数
function migrateExcelToDocusaurus() {
    try {
        console.log('开始迁移Excel数据到Docusaurus...');
        
        // 1. 加载Excel数据
        const excelData = loadExcelData();
        console.log(`加载了 ${excelData.length} 个产品数据`);
        
        // 2. 验证地址一致性
        const inconsistencies = validateAddressConsistency(excelData);
        
        // 3. 检查SVG图标
        const missingIcons = checkSvgIcons(excelData);
        
        // 4. 生成产品Markdown文件
        console.log('\n=== 生成产品Markdown文件 ===');
        const docsDir = path.join(__dirname, '../docs/products');
        
        // 确保目录存在
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }
        
        const generatedFiles = [];
        excelData.forEach(product => {
            if (product.Product && product['Solana Address']) {
                const { fileName, markdown, symbol } = generateProductMarkdown(product);
                const filePath = path.join(docsDir, `${fileName}.md`);
                
                fs.writeFileSync(filePath, markdown, 'utf8');
                generatedFiles.push(`${fileName}.md`);
                console.log(`✅ 生成: ${fileName}.md (${symbol})`);
            }
        });
        
        // 5. 生成产品JSON数据
        console.log('\n=== 生成产品JSON数据 ===');
        const productsData = generateProductsJson(excelData);
        const jsonPath = path.join(__dirname, '../data/products.json');
        
        fs.writeFileSync(jsonPath, JSON.stringify(productsData, null, 2), 'utf8');
        console.log(`✅ 生成: products.json (${productsData.length} 个产品)`);
        
        // 6. 生成迁移报告
        const report = {
            timestamp: new Date().toISOString(),
            totalProducts: excelData.length,
            validProducts: productsData.length,
            generatedFiles: generatedFiles.length,
            inconsistencies: inconsistencies.length,
            missingIcons: missingIcons.length,
            details: {
                inconsistencies,
                missingIcons,
                generatedFiles
            }
        };
        
        const reportPath = path.join(__dirname, '../data/migration-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
        
        console.log('\n=== 迁移完成 ===');
        console.log(`总产品数: ${report.totalProducts}`);
        console.log(`有效产品数: ${report.validProducts}`);
        console.log(`生成文件数: ${report.generatedFiles}`);
        console.log(`地址不一致: ${report.inconsistencies}`);
        console.log(`缺失图标: ${report.missingIcons}`);
        console.log(`\n报告已保存到: ${reportPath}`);
        
        return report;
        
    } catch (error) {
        console.error('迁移过程中出错:', error);
        throw error;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    migrateExcelToDocusaurus();
}

module.exports = {
    migrateExcelToDocusaurus,
    validateAddressConsistency,
    generateProductsJson,
    checkSvgIcons
};