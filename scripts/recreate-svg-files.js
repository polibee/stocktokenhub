const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// SVG文件目录
const SVG_DIR = path.join(__dirname, '..', 'static', 'img', 'tokens');
const BACKUP_DIR = path.join(__dirname, '..', 'svg-backup');

// 重新创建SVG文件
function recreateSvgFiles() {
    console.log('🔄 重新创建SVG文件以解决GitHub大小写问题...');
    
    try {
        // 1. 创建备份目录
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
            console.log('📁 创建备份目录');
        }
        
        // 2. 获取所有SVG文件
        const files = fs.readdirSync(SVG_DIR);
        const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));
        
        console.log(`📋 找到 ${svgFiles.length} 个SVG文件`);
        
        // 3. 备份所有SVG文件
        console.log('\n💾 备份SVG文件...');
        svgFiles.forEach(file => {
            const srcPath = path.join(SVG_DIR, file);
            const backupPath = path.join(BACKUP_DIR, file);
            fs.copyFileSync(srcPath, backupPath);
            console.log(`   ✅ 备份: ${file}`);
        });
        
        // 4. 从Git中删除所有SVG文件
        console.log('\n🗑️  从Git中删除SVG文件...');
        svgFiles.forEach(file => {
            const filePath = path.join('static', 'img', 'tokens', file);
            try {
                execSync(`git rm "${filePath}"`, { 
                    cwd: path.join(__dirname, '..'),
                    stdio: 'pipe'
                });
                console.log(`   ✅ Git删除: ${file}`);
            } catch (error) {
                console.log(`   ⚠️  删除失败: ${file} - ${error.message}`);
            }
        });
        
        // 5. 物理删除文件
        console.log('\n🗑️  物理删除SVG文件...');
        svgFiles.forEach(file => {
            const filePath = path.join(SVG_DIR, file);
            try {
                fs.unlinkSync(filePath);
                console.log(`   ✅ 物理删除: ${file}`);
            } catch (error) {
                console.log(`   ⚠️  删除失败: ${file} - ${error.message}`);
            }
        });
        
        // 6. 从备份恢复文件（确保小写文件名）
        console.log('\n🔄 从备份恢复文件...');
        svgFiles.forEach(file => {
            const backupPath = path.join(BACKUP_DIR, file);
            const lowerCaseFileName = file.toLowerCase();
            const newPath = path.join(SVG_DIR, lowerCaseFileName);
            
            try {
                fs.copyFileSync(backupPath, newPath);
                console.log(`   ✅ 恢复: ${file} -> ${lowerCaseFileName}`);
            } catch (error) {
                console.log(`   ❌ 恢复失败: ${file} - ${error.message}`);
            }
        });
        
        // 7. 添加所有文件到Git
        console.log('\n➕ 添加文件到Git...');
        try {
            execSync('git add static/img/tokens/*.svg', { 
                cwd: path.join(__dirname, '..'),
                stdio: 'pipe'
            });
            console.log('   ✅ 所有SVG文件已添加到Git');
        } catch (error) {
            console.log(`   ❌ 添加失败: ${error.message}`);
        }
        
        // 8. 检查Git状态
        console.log('\n📋 检查Git状态...');
        const status = execSync('git status --porcelain', { 
            cwd: path.join(__dirname, '..'),
            encoding: 'utf8'
        });
        
        if (status.trim()) {
            console.log('📝 Git状态:');
            console.log(status);
        } else {
            console.log('✅ 没有待提交的更改');
        }
        
        // 9. 清理备份目录
        console.log('\n🧹 清理备份目录...');
        try {
            fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
            console.log('   ✅ 备份目录已清理');
        } catch (error) {
            console.log(`   ⚠️  清理失败: ${error.message}`);
        }
        
        console.log('\n🎉 SVG文件重新创建完成!');
        console.log('\n💡 下一步操作:');
        console.log('   1. 运行: git commit -m "fix: 重新创建SVG文件解决大小写问题"');
        console.log('   2. 运行: git push origin master');
        console.log('   3. 等待GitHub Actions重新构建');
        
    } catch (error) {
        console.error('❌ 操作失败:', error.message);
        
        // 尝试从备份恢复
        if (fs.existsSync(BACKUP_DIR)) {
            console.log('\n🔄 尝试从备份恢复...');
            try {
                const backupFiles = fs.readdirSync(BACKUP_DIR);
                backupFiles.forEach(file => {
                    const backupPath = path.join(BACKUP_DIR, file);
                    const restorePath = path.join(SVG_DIR, file);
                    fs.copyFileSync(backupPath, restorePath);
                    console.log(`   ✅ 恢复: ${file}`);
                });
                console.log('✅ 从备份恢复成功');
            } catch (restoreError) {
                console.error('❌ 备份恢复失败:', restoreError.message);
            }
        }
    }
}

// 主函数
function main() {
    console.log('🚀 SVG文件重新创建工具');
    console.log('========================\n');
    
    console.log('⚠️  警告: 此操作将删除并重新创建所有SVG文件');
    console.log('📋 这将解决GitHub上的文件大小写问题\n');
    
    recreateSvgFiles();
}

main();