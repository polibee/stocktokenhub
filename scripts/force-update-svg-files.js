const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// SVG文件目录
const SVG_DIR = path.join(__dirname, '..', 'static', 'img', 'tokens');

// 强制更新SVG文件到Git
function forceUpdateSvgFiles() {
    console.log('🔍 强制更新SVG文件到Git...');
    
    try {
        // 获取所有SVG文件
        const files = fs.readdirSync(SVG_DIR);
        const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));
        
        console.log(`📁 找到 ${svgFiles.length} 个SVG文件`);
        
        // 强制添加每个SVG文件
        svgFiles.forEach(file => {
            const filePath = path.join('static', 'img', 'tokens', file);
            try {
                // 使用git add -f强制添加文件
                execSync(`git add -f "${filePath}"`, { 
                    cwd: path.join(__dirname, '..'),
                    stdio: 'pipe'
                });
                console.log(`✅ 强制添加: ${file}`);
            } catch (error) {
                console.log(`❌ 添加失败: ${file} - ${error.message}`);
            }
        });
        
        // 检查Git状态
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
        
        // 显示SVG文件列表
        console.log('\n📋 当前SVG文件列表:');
        svgFiles.forEach(file => {
            console.log(`   📄 ${file}`);
        });
        
        console.log('\n💡 下一步操作:');
        console.log('   1. 运行: git commit -m "fix: 强制更新SVG文件大小写"');
        console.log('   2. 运行: git push origin master');
        console.log('   3. 等待GitHub Actions重新构建');
        
    } catch (error) {
        console.error('❌ 操作失败:', error.message);
    }
}

// 检查SVG文件大小写一致性
function checkSvgCaseConsistency() {
    console.log('\n🔍 检查SVG文件大小写一致性...');
    
    try {
        const files = fs.readdirSync(SVG_DIR);
        const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));
        
        const caseIssues = [];
        
        svgFiles.forEach(file => {
            const lowerCase = file.toLowerCase();
            if (file !== lowerCase) {
                caseIssues.push({
                    current: file,
                    expected: lowerCase
                });
            }
        });
        
        if (caseIssues.length > 0) {
            console.log(`❌ 发现 ${caseIssues.length} 个大小写问题:`);
            caseIssues.forEach(issue => {
                console.log(`   📄 ${issue.current} -> ${issue.expected}`);
            });
            return false;
        } else {
            console.log('✅ 所有SVG文件名都是小写');
            return true;
        }
        
    } catch (error) {
        console.error('❌ 检查失败:', error.message);
        return false;
    }
}

// 主函数
function main() {
    console.log('🚀 SVG文件强制更新工具');
    console.log('========================\n');
    
    // 检查大小写一致性
    const isConsistent = checkSvgCaseConsistency();
    
    if (!isConsistent) {
        console.log('\n⚠️  发现大小写问题，请先运行 fix-svg-lowercase.js');
        return;
    }
    
    // 强制更新文件
    forceUpdateSvgFiles();
}

main();