const fs = require('fs');
const path = require('path');

/**
 * 修复 SVG 文件名大小写问题
 * 将 static/img/tokens/ 目录下的 SVG 文件重命名为小写
 */

const tokensDir = path.join(__dirname, '..', 'static', 'img', 'tokens');

console.log('🔧 开始修复 SVG 文件名大小写问题...');
console.log(`📁 目标目录: ${tokensDir}`);

if (!fs.existsSync(tokensDir)) {
    console.error('❌ tokens 目录不存在!');
    process.exit(1);
}

try {
    const files = fs.readdirSync(tokensDir);
    const svgFiles = files.filter(file => file.endsWith('.svg'));
    
    console.log(`📊 找到 ${svgFiles.length} 个 SVG 文件`);
    
    let renamedCount = 0;
    let skippedCount = 0;
    
    for (const file of svgFiles) {
        const oldPath = path.join(tokensDir, file);
        const newFileName = file.toLowerCase();
        const newPath = path.join(tokensDir, newFileName);
        
        if (file !== newFileName) {
            // 需要重命名
            if (fs.existsSync(newPath)) {
                console.log(`⚠️  跳过 ${file} -> ${newFileName} (目标文件已存在)`);
                skippedCount++;
            } else {
                fs.renameSync(oldPath, newPath);
                console.log(`✅ 重命名: ${file} -> ${newFileName}`);
                renamedCount++;
            }
        } else {
            console.log(`✓ 跳过: ${file} (已经是小写)`);
            skippedCount++;
        }
    }
    
    console.log('\n📈 修复完成!');
    console.log(`✅ 成功重命名: ${renamedCount} 个文件`);
    console.log(`⏭️  跳过: ${skippedCount} 个文件`);
    
    if (renamedCount > 0) {
        console.log('\n🎉 SVG 文件名大小写问题已修复!');
        console.log('💡 现在可以重新运行构建命令测试修复效果');
    } else {
        console.log('\n💡 所有文件名已经正确，无需修复');
    }
    
} catch (error) {
    console.error('❌ 修复过程中出现错误:', error.message);
    process.exit(1);
}