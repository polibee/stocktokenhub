const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://stocktokenhub.github.io';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// Search engine submission URLs
const SEARCH_ENGINES = {
  google: 'https://www.google.com/ping?sitemap=',
  bing: 'https://www.bing.com/ping?sitemap=',
  yandex: 'https://webmaster.yandex.com/ping?sitemap='
};

/**
 * Submit sitemap to search engines
 */
async function submitSitemap() {
  console.log('🚀 Starting sitemap submission to search engines...');
  
  for (const [engine, url] of Object.entries(SEARCH_ENGINES)) {
    try {
      const submissionUrl = `${url}${encodeURIComponent(SITEMAP_URL)}`;
      console.log(`📤 Submitting to ${engine}: ${submissionUrl}`);
      
      await new Promise((resolve, reject) => {
        https.get(submissionUrl, (res) => {
          if (res.statusCode === 200) {
            console.log(`✅ Successfully submitted to ${engine}`);
            resolve();
          } else {
            console.log(`⚠️  ${engine} responded with status: ${res.statusCode}`);
            resolve(); // Don't fail the entire process
          }
        }).on('error', (err) => {
          console.log(`❌ Error submitting to ${engine}:`, err.message);
          resolve(); // Don't fail the entire process
        });
      });
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error with ${engine}:`, error.message);
    }
  }
  
  console.log('🎉 Sitemap submission completed!');
}

/**
 * Generate robots.txt file
 */
function generateRobotsTxt() {
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITEMAP_URL}

# Disallow crawling of search results
Disallow: /search

# Disallow crawling of tag pages
Disallow: /tags/

# Allow crawling of blog and docs
Allow: /blog/
Allow: /docs/
Allow: /tutorials/`;
  
  const robotsPath = path.join(__dirname, '../build/robots.txt');
  
  try {
    fs.writeFileSync(robotsPath, robotsContent);
    console.log('✅ robots.txt generated successfully');
  } catch (error) {
    console.log('❌ Error generating robots.txt:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔧 Starting SEO automation tasks...');
  
  // Generate robots.txt
  generateRobotsTxt();
  
  // Submit sitemap to search engines
  await submitSitemap();
  
  console.log('✨ All SEO tasks completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { submitSitemap, generateRobotsTxt };