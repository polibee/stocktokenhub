import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// 从数据文件导入真实的代币化股票数据
import productsData from '../../data/products.json';

// 生成Jupiter交易链接
function generateJupiterUrl(stock: any): string {
  const jupiterAccount = 'HQaGy9AtmnFhvkhp3QWFZYa9KjPFrn4p2hwoNWQnMcgA';
  const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC on Solana
  
  // 使用产品数据中的合约地址
  const tokenMint = stock.contractAddress;
  
  if (!tokenMint) {
    // 如果没有合约地址，返回Jupiter主页
    return `https://jup.ag/?referrer=${jupiterAccount}`;
  }
  
  // 使用查询参数格式的Jupiter交换链接
  return `https://jup.ag/swap?inputMint=${usdcMint}&outputMint=${tokenMint}&referrer=${jupiterAccount}`;
}

function TokenCard({stock}) {
  const jupiterUrl = generateJupiterUrl(stock);

  return (
    <div className={clsx('col col--3', styles.showcaseCard)}>
      <div className={clsx('card', styles.showcaseCardInner)}>
        <div className={styles.showcaseCardHeader}>
          <div className={styles.showcaseCardImage}>
            {stock.logo ? (
              <img src={stock.logo} alt={`${stock.name} logo`} />
            ) : (
              <div className={styles.placeholderLogo}>{stock.symbol}</div>
            )}
          </div>
          <div className={styles.showcaseCardTitle}>
            <h3>{stock.symbol}</h3>
            <p>{stock.fullName}</p>
          </div>
        </div>
        <div className={styles.showcaseCardBody}>
          <p className={styles.showcaseCardDescription}>
            {stock.keyBenefits || stock.description}
          </p>
          <div className={styles.showcaseCardTags}>
            <span className={styles.showcaseTag}>
              {stock.chain === 'solana' ? (
                <span className={styles.chainWithLogo}>
                  <img src="/img/tokens/solana-sol-logo.svg" alt="Solana" className={styles.chainLogo} />
                  Solana
                </span>
              ) : (
                stock.chain
              )}
            </span>
            {stock.issuer && (
              <span className={styles.showcaseTag}>
                {stock.issuer}
              </span>
            )}
          </div>
        </div>
        <div className={styles.showcaseCardFooter}>
          <Link
            className={clsx('button button--primary', styles.showcaseButton)}
            href={jupiterUrl}
            target="_blank"
            rel="noopener noreferrer">
            <img src="/img/exchanges/jupiter-ag-jup-logo.svg" alt="Jupiter" style={{width: '16px', height: '16px', marginRight: '4px'}} />
            Trade Now
          </Link>
          <Link
            className={clsx('button button--outline button--primary', styles.showcaseButton)}
            to={`/docs/products/xstocks/${stock.id}`}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductsOverviewPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter products - support fuzzy search
  const filteredProducts = useMemo(() => {
    return productsData.filter(product => {
      if (!searchTerm) {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesCategory;
      }
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.symbol.toLowerCase().includes(searchLower) ||
        product.fullName.toLowerCase().includes(searchLower) ||
        (product.keyBenefits && product.keyBenefits.toLowerCase().includes(searchLower)) ||
        (product.underlyingAsset && product.underlyingAsset.name.toLowerCase().includes(searchLower)) ||
        product.description.toLowerCase().includes(searchLower);
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <Layout
      title="Tokenized Stocks Overview"
      description="Explore all available tokenized stock products">
      <main>
        {/* Hero Section */}
        <section className={clsx('hero hero--primary', styles.heroBanner)}>
          <div className="container">
            <Heading as="h1" className="hero__title">
              Tokenized Stocks Overview
            </Heading>
            <p className="hero__subtitle">
              Explore all available tokenized stock products
            </p>
            <p className="hero__description">
              Trade traditional stocks 24/7, enjoy the convenience and innovation of DeFi
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className={styles.searchSection}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search tokenized stocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                  <div className={styles.filterContainer}>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={styles.categorySelect}
                    >
                      <option value="all">All Categories</option>
                      <option value="tokenized-stocks">Tokenized Stocks</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className={styles.section}>
          <div className="container">
            <div className="text--center margin-bottom--lg">
              <Heading as="h2">Tokenized Stock Products</Heading>
              <p>Found {filteredProducts.length} tokenized stock products</p>
              <div className={styles.providerNote}>
                <p><small>🏢 Issued by Backed Finance | More tokenized stock providers will be supported in the future</small></p>
              </div>
            </div>
            
            <div className={clsx("row", styles.showcaseGrid)}>
              {filteredProducts.map((stock, idx) => (
                <TokenCard key={idx} stock={stock} />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text--center">
                <p>No matching products found, please try other search terms.</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <div className="text--center margin-bottom--lg">
              <Heading as="h2">Product Features</Heading>
            </div>
            <div className="row">
              <div className="col col--3">
                <div className="text--center">
                  <h3>🔒 Compliant & Secure</h3>
                  <p>Fully compliant tokenized stocks issued and custodied by renowned financial institutions</p>
                </div>
              </div>
              <div className="col col--3">
                <div className="text--center">
                  <h3>⚡ 24/7 Trading</h3>
                  <p>Break traditional stock market time limits with round-the-clock liquidity and instant settlement</p>
                </div>
              </div>
              <div className="col col--3">
                <div className="text--center">
                  <h3>💰 Low Cost</h3>
                  <p>Lower fees compared to traditional stock trading, no need for traditional brokerage accounts</p>
                </div>
              </div>
              <div className="col col--3">
                <div className="text--center">
                  <h3>🌍 Global Access</h3>
                  <p>Support global investors with high-performance trading based on Solana blockchain</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Warning */}
        <section className={styles.section}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <div className="admonition admonition-warning">
                  <div className="admonition-heading">
                    <h5>⚠️ Risk Warning</h5>
                  </div>
                  <div className="admonition-content">
                    <ul>
                      <li>This product is not sold to US persons</li>
                      <li>Token prices will fluctuate with underlying stock prices</li>
                      <li>Please carefully read relevant legal documents before investing</li>
                      <li>Past performance does not represent future returns</li>
                      <li>Please invest cautiously according to your risk tolerance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <div className="text--center">
              <Heading as="h2">Start Trading</Heading>
              <p className="margin-bottom--lg">
                Choose the tokenized stocks you're interested in and start trading immediately
              </p>
              <div className={styles.buttons}>
                <Link
                  className="button button--primary button--lg"
                  to="/blog/tutorial-intro">
                  📚 Learning Tutorials
                </Link>
                <Link
                  className="button button--outline button--primary button--lg"
                  to="/platforms-compare">
                  🔍 Platform Comparison
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default ProductsOverviewPage;