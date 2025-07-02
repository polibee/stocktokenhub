const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 读取Excel文件
function extractExcelData() {
    try {
        // 读取Excel文件
        const workbook = XLSX.readFile('d:/front/stocktokenhub/资料/product.xlsx');
        
        // 获取第一个工作表
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // 将工作表转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log('Excel数据提取成功:');
        console.log(JSON.stringify(jsonData, null, 2));
        
        // 保存为JSON文件
        const outputPath = path.join(__dirname, '../data/excel-products.json');
        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf8');
        
        console.log(`\n数据已保存到: ${outputPath}`);
        
        // 验证Sol地址和超链接地址一致性
        validateAddresses(jsonData);
        
        return jsonData;
    } catch (error) {
        console.error('提取Excel数据时出错:', error);
        throw error;
    }
}

// 验证Sol地址和超链接中的地址是否一致
function validateAddresses(data) {
    console.log('\n=== 地址一致性验证 ===');
    
    data.forEach((product, index) => {
        console.log(`\n产品 ${index + 1}: ${product.name || product.产品名称 || '未知产品'}`);
        
        // 查找可能的Sol地址字段
        const solAddressFields = Object.keys(product).filter(key => 
            key.toLowerCase().includes('sol') || 
            key.toLowerCase().includes('solana') ||
            key.includes('地址')
        );
        
        // 查找可能的超链接字段
        const linkFields = Object.keys(product).filter(key => 
            key.toLowerCase().includes('link') || 
            key.toLowerCase().includes('url') ||
            key.includes('链接') ||
            key.includes('网址')
        );
        
        console.log('Sol地址相关字段:', solAddressFields);
        console.log('链接相关字段:', linkFields);
        
        // 提取地址进行比较
        solAddressFields.forEach(solField => {
            const solAddress = product[solField];
            if (solAddress) {
                console.log(`${solField}: ${solAddress}`);
                
                // 检查链接中是否包含相同的地址
                linkFields.forEach(linkField => {
                    const linkValue = product[linkField];
                    if (linkValue && typeof linkValue === 'string') {
                        if (linkValue.includes(solAddress)) {
                            console.log(`✅ 地址一致: ${linkField} 包含 ${solField}`);
                        } else {
                            console.log(`❌ 地址不一致: ${linkField} 不包含 ${solField}`);
                            console.log(`   链接内容: ${linkValue}`);
                        }
                    }
                });
            }
        });
    });
}

// 主函数
if (require.main === module) {
    extractExcelData();
}

module.exports = { extractExcelData, validateAddresses };