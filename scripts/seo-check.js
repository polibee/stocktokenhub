const fs = require('fs');
const path = require('path');
const https = require('https');
const { JSDOM } = require('jsdom');

// Configuration
const SITE_URL = 'https://stocktokenhub.github.io';
const BUILD_DIR = path.join(__dirname, '../build');

/**
 * Check if required SEO files exist
 */
function checkSEOFiles() {
  console.log('📁 Checking SEO files...');
  
  const requiredFiles = [
    { path: path.join(BUILD_DIR, 'sitemap.xml'), name: 'sitemap.xml' },
    { path: path.join(BUILD_DIR, 'robots.txt'), name: 'robots.txt' }
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(`✅ ${file.name} exists`);
      
      // Check file size
      const stats = fs.statSync(file.path);
      console.log(`   📊 Size: ${stats.size} bytes`);
      
      if (stats.size === 0) {
        console.log(`   ⚠️  ${file.name} is empty!`);
      }
    } else {
      console.log(`❌ ${file.name} missing`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

/**
 * Analyze HTML files for SEO
 */
function analyzeSEOInHTML() {
  console.log('🔍 Analyzing HTML files for SEO...');
  
  const htmlFiles = [];
  
  // Find HTML files recursively
  function findHTMLFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findHTMLFiles(filePath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(filePath);
      }
    });
  }
  
  if (fs.existsSync(BUILD_DIR)) {
    findHTMLFiles(BUILD_DIR);
  }
  
  console.log(`📄 Found ${htmlFiles.length} HTML files`);
  
  // Analyze first few HTML files
  const filesToAnalyze = htmlFiles.slice(0, 5);
  
  filesToAnalyze.forEach(filePath => {
    const relativePath = path.relative(BUILD_DIR, filePath);
    console.log(`\n🔍 Analyzing: ${relativePath}`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(content);
      const document = dom.window.document;
      
      // Check essential SEO elements
      const checks = [
        {
          element: document.querySelector('title'),
          name: 'Title tag',
          getValue: (el) => el?.textContent?.trim()
        },
        {
          element: document.querySelector('meta[name="description"]'),
          name: 'Meta description',
          getValue: (el) => el?.getAttribute('content')
        },
        {
          element: document.querySelector('meta[name="keywords"]'),
          name: 'Meta keywords',
          getValue: (el) => el?.getAttribute('content')
        },
        {
          element: document.querySelector('meta[property="og:title"]'),
          name: 'Open Graph title',
          getValue: (el) => el?.getAttribute('content')
        },
        {
          element: document.querySelector('meta[property="og:description"]'),
          name: 'Open Graph description',
          getValue: (el) => el?.getAttribute('content')
        },
        {
          element: document.querySelector('meta[property="og:image"]'),
          name: 'Open Graph image',
          getValue: (el) => el?.getAttribute('content')
        },
        {
          element: document.querySelector('meta[name="twitter:card"]'),
          name: 'Twitter card',
          getValue: (el) => el?.getAttribute('content')
        },
        {
          element: document.querySelector('link[rel="canonical"]'),
          name: 'Canonical URL',
          getValue: (el) => el?.getAttribute('href')
        },
        {
          element: document.querySelector('script[type="application/ld+json"]'),
          name: 'Structured data',
          getValue: (el) => el ? 'Present' : null
        }
      ];
      
      checks.forEach(check => {
        const value = check.getValue(check.element);
        if (value) {
          console.log(`   ✅ ${check.name}: ${value.length > 50 ? value.substring(0, 50) + '...' : value}`);
        } else {
          console.log(`   ❌ ${check.name}: Missing`);
        }
      });
      
      // Check heading structure
      const h1s = document.querySelectorAll('h1');
      console.log(`   📝 H1 tags: ${h1s.length}`);
      if (h1s.length !== 1) {
        console.log(`   ⚠️  Should have exactly 1 H1 tag, found ${h1s.length}`);
      }
      
      // Check images without alt text
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      if (imagesWithoutAlt.length > 0) {
        console.log(`   ⚠️  ${imagesWithoutAlt.length} images without alt text`);
      } else {
        console.log(`   ✅ All images have alt text`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error analyzing ${relativePath}: ${error.message}`);
    }
  });
}

/**
 * Check sitemap validity
 */
function checkSitemap() {
  console.log('\n🗺️  Checking sitemap...');
  
  const sitemapPath = path.join(BUILD_DIR, 'sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.log('❌ Sitemap not found');
    return;
  }
  
  try {
    const content = fs.readFileSync(sitemapPath, 'utf8');
    
    // Basic XML validation
    if (!content.includes('<?xml')) {
      console.log('❌ Invalid XML format');
      return;
    }
    
    // Count URLs
    const urlMatches = content.match(/<url>/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    console.log(`✅ Sitemap contains ${urlCount} URLs`);
    
    // Check for required elements
    if (content.includes('<loc>')) {
      console.log('✅ Contains location elements');
    } else {
      console.log('❌ Missing location elements');
    }
    
    if (content.includes('<lastmod>')) {
      console.log('✅ Contains last modified dates');
    } else {
      console.log('⚠️  Missing last modified dates');
    }
    
    // Check for site URL
    if (content.includes(SITE_URL)) {
      console.log('✅ Contains correct site URL');
    } else {
      console.log('❌ Missing or incorrect site URL');
    }
    
  } catch (error) {
    console.log(`❌ Error reading sitemap: ${error.message}`);
  }
}

/**
 * Generate SEO report
 */
function generateSEOReport() {
  console.log('\n📊 Generating SEO Report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    site_url: SITE_URL,
    files_checked: {
      sitemap: fs.existsSync(path.join(BUILD_DIR, 'sitemap.xml')),
      robots: fs.existsSync(path.join(BUILD_DIR, 'robots.txt'))
    },
    recommendations: [
      '1. Ensure all pages have unique title tags',
      '2. Add meta descriptions to all pages',
      '3. Optimize images with descriptive alt text',
      '4. Use structured data for better search results',
      '5. Monitor Core Web Vitals performance',
      '6. Submit sitemap to Google Search Console',
      '7. Set up Google Analytics tracking',
      '8. Monitor search rankings and traffic'
    ]
  };
  
  const reportPath = path.join(BUILD_DIR, 'seo-report.json');
  
  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`✅ SEO report saved to: ${reportPath}`);
  } catch (error) {
    console.log(`❌ Error saving SEO report: ${error.message}`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting SEO check...');
  console.log(`🌐 Site URL: ${SITE_URL}`);
  console.log(`📁 Build directory: ${BUILD_DIR}`);
  
  checkSEOFiles();
  checkSitemap();
  
  // Only analyze HTML if JSDOM is available
  try {
    require('jsdom');
    analyzeSEOInHTML();
  } catch (error) {
    console.log('⚠️  JSDOM not available, skipping HTML analysis');
    console.log('   Install with: npm install jsdom --save-dev');
  }
  
  generateSEOReport();
  
  console.log('\n✨ SEO check completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Replace G-XXXXXXXXXX with your actual Google Analytics ID');
  console.log('2. Submit sitemap to Google Search Console');
  console.log('3. Monitor search performance and rankings');
  console.log('4. Regularly update content and check for broken links');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { checkSEOFiles, analyzeSEOInHTML, checkSitemap, generateSEOReport };