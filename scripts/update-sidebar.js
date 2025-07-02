const fs = require('fs');
const path = require('path');

// 读取产品JSON数据
function loadProductsData() {
    const dataPath = path.join(__dirname, '../data/products.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
}

// 生成侧边栏配置
function generateSidebarConfig() {
    const products = loadProductsData();
    
    // 按字母顺序排序产品
    const sortedProducts = products.sort((a, b) => a.symbol.localeCompare(b.symbol));
    
    // 生成产品项目列表
    const productItems = ['products/overview', ...sortedProducts.map(product => `products/${product.id}`)];
    
    const sidebarConfig = `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
  // 手动定义侧边栏结构
  tutorialSidebar: [
    {
      type: 'category',
      label: '代币化股票产品',
      items: [
        ${productItems.map(item => `'${item}'`).join(',\n        ')},
      ],
    },
    {
      type: 'category',
      label: '平台对比',
      items: [
        'platforms/compare',
      ],
    },
    {
      type: 'category',
      label: '交易教程',
      items: [
        'tutorials/intro',
        'tutorials/basics',
        'tutorials/cex',
        'tutorials/dex',
        'tutorials/advanced',
      ],
    },
    'faq',
    'compliance',
  ],
};

export default sidebars;
`;
    
    return sidebarConfig;
}

// 更新侧边栏文件
function updateSidebar() {
    try {
        console.log('开始更新侧边栏配置...');
        
        const products = loadProductsData();
        console.log(`加载了 ${products.length} 个产品`);
        
        const sidebarConfig = generateSidebarConfig();
        const sidebarPath = path.join(__dirname, '../sidebars.ts');
        
        // 备份原文件
        const backupPath = path.join(__dirname, '../sidebars.ts.backup');
        if (fs.existsSync(sidebarPath)) {
            fs.copyFileSync(sidebarPath, backupPath);
            console.log('✅ 已备份原侧边栏配置');
        }
        
        // 写入新配置
        fs.writeFileSync(sidebarPath, sidebarConfig, 'utf8');
        console.log('✅ 侧边栏配置已更新');
        
        console.log(`\n更新完成: 添加了 ${products.length} 个产品到侧边栏`);
        
        return {
            success: true,
            productsCount: products.length,
            backupCreated: fs.existsSync(backupPath)
        };
        
    } catch (error) {
        console.error('更新侧边栏时出错:', error);
        throw error;
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    updateSidebar();
}

module.exports = {
    updateSidebar,
    generateSidebarConfig,
    loadProductsData
};