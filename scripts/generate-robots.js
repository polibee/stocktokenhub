const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://stocktokenhub.com';
const BUILD_DIR = path.join(__dirname, '../build');
const ROBOTS_PATH = path.join(BUILD_DIR, 'robots.txt');

/**
 * Generate robots.txt file
 */
function generateRobotsTxt() {
  console.log('🤖 Generating robots.txt...');
  
  const robotsContent = `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Disallow crawling of search results
Disallow: /search
Disallow: /search/

# Disallow crawling of tag pages (but allow specific tags)
Disallow: /tags/
Disallow: /blog/tags/

# Allow crawling of important content
Allow: /blog/
Allow: /docs/
Allow: /tutorials/
Allow: /products-overview
Allow: /platforms-compare
Allow: /compliance

# Disallow crawling of build artifacts
Disallow: /assets/
Disallow: /*.js$
Disallow: /*.css$
Disallow: /*.json$

# Allow crawling of images
Allow: /img/
Allow: /static/

# Crawl delay (optional)
Crawl-delay: 1

# Specific rules for different bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`;
  
  try {
    // Ensure build directory exists
    if (!fs.existsSync(BUILD_DIR)) {
      fs.mkdirSync(BUILD_DIR, { recursive: true });
    }
    
    fs.writeFileSync(ROBOTS_PATH, robotsContent);
    console.log('✅ robots.txt generated successfully at:', ROBOTS_PATH);
    console.log('📍 Content preview:');
    console.log(robotsContent.split('\n').slice(0, 10).join('\n') + '\n...');
  } catch (error) {
    console.error('❌ Error generating robots.txt:', error.message);
    process.exit(1);
  }
}

/**
 * Validate robots.txt content
 */
function validateRobotsTxt() {
  console.log('🔍 Validating robots.txt...');
  
  try {
    if (!fs.existsSync(ROBOTS_PATH)) {
      throw new Error('robots.txt file not found');
    }
    
    const content = fs.readFileSync(ROBOTS_PATH, 'utf8');
    
    // Basic validation checks
    const checks = [
      { test: content.includes('User-agent: *'), message: 'Contains User-agent directive' },
      { test: content.includes('Sitemap:'), message: 'Contains Sitemap directive' },
      { test: content.includes(SITE_URL), message: 'Contains correct site URL' },
      { test: content.includes('Allow: /'), message: 'Contains Allow directive' },
      { test: content.includes('Disallow:'), message: 'Contains Disallow directive' }
    ];
    
    let allPassed = true;
    checks.forEach(check => {
      if (check.test) {
        console.log(`✅ ${check.message}`);
      } else {
        console.log(`❌ ${check.message}`);
        allPassed = false;
      }
    });
    
    if (allPassed) {
      console.log('🎉 robots.txt validation passed!');
    } else {
      console.log('⚠️  robots.txt validation failed!');
    }
    
  } catch (error) {
    console.error('❌ Error validating robots.txt:', error.message);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting robots.txt generation...');
  generateRobotsTxt();
  validateRobotsTxt();
  console.log('✨ Robots.txt generation completed!');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateRobotsTxt, validateRobotsTxt };