const fs = require('fs');
const path = require('path');

// SVG文件目录
const svgDir = path.join(__dirname, '..', 'static', 'img', 'tokens');

console.log('Starting SVG filename case fix...');
console.log('SVG directory:', svgDir);

if (!fs.existsSync(svgDir)) {
    console.error('SVG directory does not exist:', svgDir);
    process.exit(1);
}

// 读取目录中的所有文件
const files = fs.readdirSync(svgDir);
const svgFiles = files.filter(file => file.endsWith('.svg'));

console.log(`Found ${svgFiles.length} SVG files`);

let renamedCount = 0;
let errorCount = 0;

svgFiles.forEach(file => {
    const currentPath = path.join(svgDir, file);
    const lowerCaseFileName = file.toLowerCase();
    const tempPath = path.join(svgDir, `temp_${Date.now()}_${lowerCaseFileName}`);
    const finalPath = path.join(svgDir, lowerCaseFileName);
    
    // 如果文件名已经是小写，跳过
    if (file === lowerCaseFileName) {
        console.log(`✓ ${file} - already lowercase, skipping`);
        return;
    }
    
    try {
        // 先重命名到临时文件名（避免Windows大小写不敏感问题）
        fs.renameSync(currentPath, tempPath);
        // 再重命名到最终的小写文件名
        fs.renameSync(tempPath, finalPath);
        
        console.log(`✓ ${file} -> ${lowerCaseFileName}`);
        renamedCount++;
    } catch (error) {
        console.error(`✗ Failed to rename ${file}:`, error.message);
        // 如果临时文件存在，尝试清理
        try {
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        } catch (cleanupError) {
            console.error(`Failed to cleanup temp file:`, cleanupError.message);
        }
        errorCount++;
    }
});

console.log('\n=== Summary ===');
console.log(`Total SVG files: ${svgFiles.length}`);
console.log(`Files renamed: ${renamedCount}`);
console.log(`Errors: ${errorCount}`);

if (renamedCount > 0) {
    console.log('\n✅ SVG filename case fix completed successfully!');
    console.log('You can now run "npm run build" to test the build.');
} else if (errorCount === 0) {
    console.log('\n✅ All SVG files are already in correct case.');
} else {
    console.log('\n❌ Some errors occurred during the process.');
    process.exit(1);
}