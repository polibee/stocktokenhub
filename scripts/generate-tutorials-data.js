const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 博客文件夹路径
const BLOG_DIR = path.join(__dirname, '..', 'blog');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'tutorials.json');

// 确保输出目录存在
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 根据分类获取难度
function getDifficultyFromCategory(category) {
  const difficultyMap = {
    'tutorial': '初级',
    'basics': '入门', 
    'trading': '中级',
    'advanced': '高级'
  };
  return difficultyMap[category] || '初级';
}

// 根据分类获取缩略图
function getThumbnailFromCategory(category) {
  const thumbnailMap = {
    'tutorial': '/img/tutorials/intro.svg',
    'basics': '/img/tutorials/basics.svg',
    'trading': '/img/tutorials/cex.svg', 
    'advanced': '/img/tutorials/advanced.svg'
  };
  return thumbnailMap[category] || '/img/tutorials/default.svg';
}

// 估算阅读时间（基于字数）
function estimateReadTime(content) {
  const wordsPerMinute = 200; // 中文阅读速度
  const wordCount = content.length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(readTime, 1); // 至少1分钟
}

// 递归扫描目录获取所有markdown文件
function scanDirectory(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 递归扫描子目录
      files.push(...scanDirectory(fullPath, baseDir));
    } else if (item.endsWith('.md') && item !== 'README.md') {
      // 获取相对路径作为分类
      const relativePath = path.relative(baseDir, fullPath);
      const category = path.dirname(relativePath).replace(/\\/g, '/');
      
      files.push({
        filePath: fullPath,
        relativePath: relativePath.replace(/\\/g, '/'),
        category: category === '.' ? 'tutorial' : category,
        fileName: item
      });
    }
  }
  
  return files;
}

// 处理单个markdown文件
function processMarkdownFile(fileInfo) {
  try {
    const content = fs.readFileSync(fileInfo.filePath, 'utf8');
    const { data: frontmatter, content: markdownContent } = matter(content);
    
    // 获取文件统计信息
    const fileStat = fs.statSync(fileInfo.filePath);
    
    // 提取基本信息
    const slug = frontmatter.slug || path.basename(fileInfo.fileName, '.md');
    const title = frontmatter.title || slug;
    const description = frontmatter.description || frontmatter.excerpt || '';
    const tags = frontmatter.tags || [];
    // 优先使用frontmatter中的date，其次使用文件的创建时间，最后使用修改时间
    const date = frontmatter.date ? 
      new Date(frontmatter.date) : 
      (fileStat.birthtime || fileStat.mtime);
    const image = frontmatter.image || getThumbnailFromCategory(fileInfo.category);
    
    // 生成URL
    const url = `/blog/${slug}`;
    
    // 估算阅读时间
    const readTime = estimateReadTime(markdownContent);
    
    // 获取难度
    const difficulty = getDifficultyFromCategory(fileInfo.category);
    
    return {
      id: `${fileInfo.category}/${slug}`,
      title,
      description,
      category: fileInfo.category,
      difficulty,
      readTime,
      date: date.toISOString(),
      thumbnail: image,
      url,
      tags,
      slug,
      filePath: fileInfo.relativePath
    };
  } catch (error) {
    console.error(`Error processing file ${fileInfo.filePath}:`, error);
    return null;
  }
}

// 主函数
function generateTutorialsData() {
  console.log('🔍 Scanning blog directory for tutorials...');
  
  try {
    // 扫描blog目录
    const markdownFiles = scanDirectory(BLOG_DIR);
    console.log(`📁 Found ${markdownFiles.length} markdown files`);
    
    // 处理每个文件
    const tutorials = [];
    for (const fileInfo of markdownFiles) {
      const tutorial = processMarkdownFile(fileInfo);
      if (tutorial) {
        tutorials.push(tutorial);
        console.log(`✅ Processed: ${tutorial.title}`);
      }
    }
    
    // 按日期排序（最新的在前）
    tutorials.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // 生成统计信息
    const stats = {
      total: tutorials.length,
      byCategory: {},
      lastUpdated: new Date().toISOString()
    };
    
    tutorials.forEach(tutorial => {
      stats.byCategory[tutorial.category] = (stats.byCategory[tutorial.category] || 0) + 1;
    });
    
    // 输出数据
    const outputData = {
      tutorials,
      stats
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');
    
    console.log('\n📊 Generation Summary:');
    console.log(`📝 Total tutorials: ${stats.total}`);
    console.log('📂 By category:');
    Object.entries(stats.byCategory).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });
    console.log(`💾 Data saved to: ${OUTPUT_FILE}`);
    console.log('✨ Tutorials data generation completed!');
    
  } catch (error) {
    console.error('❌ Error generating tutorials data:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  generateTutorialsData();
}

module.exports = { generateTutorialsData };