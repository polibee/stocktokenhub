const fs = require('fs');
const path = require('path');

// 检查SVG文件状态
function checkSVGFiles() {
    const svgDir = path.join(__dirname, '..', 'static', 'img', 'tokens');
    
    console.log('🔍 检查SVG文件状态...');
    console.log(`📁 目录: ${svgDir}`);
    
    if (!fs.existsSync(svgDir)) {
        console.log('❌ SVG目录不存在');
        return;
    }
    
    const files = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));
    console.log(`📊 总计SVG文件: ${files.length}个`);
    
    let lowercaseCount = 0;
    let uppercaseCount = 0;
    let mixedCount = 0;
    
    const problematicFiles = [];
    
    files.forEach(file => {
        const basename = path.parse(file).name;
        if (basename === basename.toLowerCase()) {
            lowercaseCount++;
        } else if (basename === basename.toUpperCase()) {
            uppercaseCount++;
            problematicFiles.push(file);
        } else {
            mixedCount++;
            problematicFiles.push(file);
        }
    });
    
    console.log(`✅ 小写文件: ${lowercaseCount}个`);
    console.log(`❌ 大写文件: ${uppercaseCount}个`);
    console.log(`⚠️  混合大小写: ${mixedCount}个`);
    
    if (problematicFiles.length > 0) {
        console.log('\n🚨 问题文件:');
        problematicFiles.forEach(file => {
            console.log(`   - ${file}`);
        });
    } else {
        console.log('\n✅ 所有SVG文件名都是小写，符合要求！');
    }
    
    return problematicFiles.length === 0;
}

// 检查MDX文件中的引用
function checkMDXReferences() {
    console.log('\n🔍 检查MDX文件中的SVG引用...');
    
    const docsDir = path.join(__dirname, '..', 'docs');
    const problematicRefs = [];
    
    function scanDirectory(dir) {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanDirectory(fullPath);
            } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const svgRefs = content.match(/static\/img\/tokens\/[^\s)]+\.svg/g);
                
                if (svgRefs) {
                    svgRefs.forEach(ref => {
                        const filename = path.basename(ref);
                        const basename = path.parse(filename).name;
                        
                        if (basename !== basename.toLowerCase()) {
                            problematicRefs.push({
                                file: fullPath,
                                reference: ref,
                                suggested: ref.replace(filename, basename.toLowerCase() + '.svg')
                            });
                        }
                    });
                }
            }
        });
    }
    
    if (fs.existsSync(docsDir)) {
        scanDirectory(docsDir);
    }
    
    if (problematicRefs.length > 0) {
        console.log('❌ 发现大写SVG引用:');
        problematicRefs.forEach(ref => {
            console.log(`   📄 ${path.relative(process.cwd(), ref.file)}`);
            console.log(`      ❌ ${ref.reference}`);
            console.log(`      ✅ ${ref.suggested}`);
        });
        return false;
    } else {
        console.log('✅ 所有MDX文件中的SVG引用都是小写！');
        return true;
    }
}

// 本地构建测试
function testLocalBuild() {
    console.log('\n🔍 测试本地构建...');
    
    const { execSync } = require('child_process');
    
    try {
        console.log('🏗️  运行 npm run build...');
        execSync('npm run build', { stdio: 'pipe' });
        console.log('✅ 本地构建成功！');
        return true;
    } catch (error) {
        console.log('❌ 本地构建失败:');
        console.log(error.stdout?.toString() || error.message);
        return false;
    }
}

// 主函数
function main() {
    console.log('🔍 SVG文件修复最终验证\n');
    
    const svgOk = checkSVGFiles();
    const mdxOk = checkMDXReferences();
    const buildOk = testLocalBuild();
    
    console.log('\n📋 验证结果:');
    console.log(`   SVG文件名: ${svgOk ? '✅' : '❌'}`);
    console.log(`   MDX引用: ${mdxOk ? '✅' : '❌'}`);
    console.log(`   本地构建: ${buildOk ? '✅' : '❌'}`);
    
    if (svgOk && mdxOk && buildOk) {
        console.log('\n🎉 所有检查通过！问题应该已经解决。');
        console.log('💡 如果GitHub Actions仍然失败，可能是以下原因:');
        console.log('   1. GitHub缓存问题');
        console.log('   2. 需要手动启用GitHub Pages');
        console.log('   3. 构建环境配置问题');
    } else {
        console.log('\n🚨 仍有问题需要解决！');
    }
}

if (require.main === module) {
    main();
}

module.exports = { checkSVGFiles, checkMDXReferences, testLocalBuild };