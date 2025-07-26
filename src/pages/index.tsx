import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import { ReactNode } from 'react';

import styles from './index.module.css';

// Import real tokenized stock data from data file
import productsData from '../../data/products.json';

// Product data
const tokenStocks = productsData; // Only show first 12 products



// Generate Jupiter trading link
function generateJupiterUrl(stock: any): string {
  const jupiterAccount = 'HQaGy9AtmnFhvkhp3QWFZYa9KjPFrn4p2hwoNWQnMcgA';
  const usdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC on Solana
  
  // Use contract address from product data
  const tokenMint = stock.contractAddress;
  
  if (!tokenMint) {
    // If no contract address, return Jupiter homepage
    return `https://jup.ag/?referrer=${jupiterAccount}`;
  }
  
  // Use sell/buy parameters format for Jupiter swap (USDC to stock token)
  return `https://jup.ag/swap?sell=${usdcMint}&buy=${tokenMint}&referrer=${jupiterAccount}`;
}

// Platform comparison data
const platforms = [
  {
    name: 'Kraken',
    description: 'xStocks - Real Stock Tokenization Products',
    fee: 'Free (USDG/USD)',
    kyc: 'Required',
    advantages: [
      'Regulated real stock tokenization',
      '24/5 trading hours',
      'Minimum $1 investment threshold'
    ],
    logo: '/img/exchanges/kraken-svgrepo-com.svg',
    url: 'https://kraken.pxf.io/c/1356313/1589189/10583',
    tradingHours: '24/5',
    minInvestment: '$1',
    assets: '60 assets (55 stocks + 5 ETFs)',
    regions: 'Parts of Asia (excluding US, Canada, UK, EU, Australia)'
  },
  {
    name: 'Bybit',
    description: 'xStocks - Tokenized Stock Trading',
    fee: '0.1% (Spot Trading)',
    kyc: 'Required',
    advantages: [
      '24/7 round-the-clock trading',
      'Low trading fees',
      'Spot and innovation zone support'
    ],
    logo: '/img/exchanges/bybit-svgrepo-com.svg',
    url: 'https://www.bybitglobal.com/invite?ref=LG8DXGG',
    tradingHours: '24/7',
    minInvestment: 'No limit',
    assets: 'Tokenized stocks',
    regions: 'Most regions globally'
  },
  {
    name: 'Gate.io',
    description: 'xStocks - 24/7 Trading & Futures',
    fee: '0.2% (Spot Trading)',
    kyc: 'Required',
    advantages: [
      '24/7 xStocks trading',
      'Futures & spot trading',
      'Alpha trading support'
    ],
    logo: '/img/exchanges/full-gate-io-logo.svg',
    url: 'https://www.gateweb.xyz/share/bvbnafk',
    tradingHours: '24/7',
    minInvestment: 'No limit',
    assets: '8+ xStocks tokens',
    regions: 'Most regions globally'
  },
  {
    name: 'Jupiter',
    description: 'Solana DEX Aggregator',
    fee: '0.04% + Solana fees',
    kyc: 'Not required',
    advantages: [
      'Decentralized trading',
      'Best price routing',
      'No KYC required'
    ],
    logo: '/img/exchanges/jupiter-ag-jup-logo.svg',
    url: 'https://jup.ag',
    tradingHours: '24/7',
    minInvestment: 'No limit',
    assets: 'All Solana tokens',
    regions: 'Global (no regional restrictions)'
  }
];

// Tutorial data
const tutorials = [
  {
    title: 'How to Buy Token Stocks on Kraken',
    description: 'Complete Kraken trading guide',
    icon: '🏦',
    url: '/blog/tutorial-cex'
  },
  {
    title: 'Using Jupiter for Token Swaps',
    description: 'Trade tokenized stocks on Solana',
    icon: '🪐',
    url: '/blog/tutorial-dex'
  },
  {
    title: 'Bridging Assets to Solana',
    description: 'Bridge from Ethereum to Solana network',
    icon: '🌉',
    url: '/blog/tutorial-advanced'
  },
  {
    title: 'Wallet Setup Guide',
    description: 'Set up and connect cryptocurrency wallets',
    icon: '👛',
    url: '/blog/tutorial-basics'
  }
];

// FAQ data
const faqs = [
  {
    question: 'Are tokenized stocks compliant?',
    answer: 'Yes, the tokenized stocks we feature come from regulated issuers such as Backed Finance and others.'
  },
  {
    question: 'Is trading safe?',
    answer: 'Trading safety depends on the platform you choose. Centralized exchanges like Kraken are strictly regulated, while DEXs require you to manage your own private keys.'
  },
  {
    question: 'How do prices sync with traditional stocks?',
    answer: 'Tokenized stocks maintain price synchronization with traditional stocks through arbitrage mechanisms, with typically minimal differences.'
  }
];

function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className="hero__description">
          Explore the world of tokenized US stocks - trade traditional stocks 24/7, enjoy the convenience and innovation of DeFi
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/blog/tutorial-intro">
            Start Learning 📚
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/products-overview">
            Browse Products 🔍
          </Link>
        </div>
      </div>
    </header>
  );
}

function TokenCard({stock}) {
  const jupiterUrl = generateJupiterUrl(stock);

  return (
    <div className={clsx('col col--2', styles.tokenCard)}> {/* Changed to col--2 to make cards smaller */}
      <div className="card">
        <div className="card__header">
          <div className={styles.tokenLogo}>
            {stock.logo ? (
              <img src={stock.logo} alt={`${stock.name} logo`} />
            ) : (
              <div className={styles.placeholderLogo}>{stock.symbol}</div>
            )}
          </div>
          <h4>{stock.symbol}</h4> {/* Changed to h4 to reduce title size */}
          <p className={styles.tokenName}>{stock.name}</p>
        </div>
        <div className="card__body">
          <p className={styles.tokenDescription}>{stock.description}</p>
          <div className={styles.platforms}>
            <strong>Chain:</strong> {stock.chain}
          </div>
        </div>
        <div className="card__footer">
          <div className={styles.cardActions}>
            <Link
              className="button button--primary button--sm"
              href={jupiterUrl}
              target="_blank"
              rel="noopener noreferrer">
              <img src="/img/exchanges/jupiter-ag-jup-logo.svg" alt="Jupiter" style={{width: '16px', height: '16px', marginRight: '4px'}} />
              Trade
            </Link>
            <Link
              className="button button--outline button--primary button--sm"
              to={`/docs/products/xstocks/${stock.id}`}>
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenizedStocksSection() {
  // Only show first 12 products (2 rows)
  const displayedStocks = tokenStocks.slice(0, 12);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">
            Xstock Tokenized Stocks
          </Heading>
          <p>
            Explore our supported tokenized stocks, enjoy 24/7 trading experience
          </p>
          <div className={styles.providerNote}>
            <p><small>
              🏢 Currently showcasing Xstock tokenized stock products, more issuers will be supported in the future
            </small></p>
          </div>
        </div>
        <div className="row">
          {displayedStocks.map((stock, idx) => (
            <TokenCard key={idx} stock={stock} />
          ))}
        </div>
        <div className="text--center margin-top--lg">
          <Link
            className="button button--outline button--primary button--lg"
            to="/products-overview">
            View All Products ({tokenStocks.length}) →
          </Link>
        </div>
      </div>
    </section>
  );
}

function PlatformCard({platform}) {
  return (
    <div className={clsx('col col--3', styles.platformCard)}>
      <div className="card">
        <div className="card__header text--center">
          <div className={styles.platformLogo}>
            {platform.logo ? (
              <img src={platform.logo} alt={`${platform.name} logo`} style={{width: '40px', height: '40px'}} />
            ) : (
              <div className={styles.placeholderLogo}>{platform.name[0]}</div>
            )}
          </div>
          <h3>{platform.name}</h3>
          <p>{platform.description}</p>
        </div>
        <div className="card__body">
          <div className={styles.platformStats}>
            <div className={styles.stat}>
              <strong>Fees:</strong> {platform.fee}
            </div>
            <div className={styles.stat}>
              <strong>Trading Hours:</strong> {platform.tradingHours}
            </div>
            <div className={styles.stat}>
              <strong>Min Investment:</strong> {platform.minInvestment}
            </div>
            <div className={styles.stat}>
              <strong>KYC Required:</strong> {platform.kyc}
            </div>
          </div>
          <div className={styles.advantages}>
            <strong>Advantages:</strong>
            <ul>
              {platform.advantages.map((advantage, idx) => (
                <li key={idx}>{advantage}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card__footer">
          <Link
            className="button button--outline button--primary button--block"
            href={platform.url}
            target="_blank">
            Visit Platform
          </Link>
        </div>
      </div>
    </div>
  );
}

function PlatformComparisonSection() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">
            Platform Comparison
          </Heading>
          <p>
            Choose the trading platform that suits you best
          </p>
        </div>
        <div className="row">
          {platforms.map((platform, idx) => (
            <PlatformCard key={idx} platform={platform} />
          ))}
        </div>
        <div className="text--center margin-top--lg">
          <Link
            className="button button--primary button--lg"
            to="/platforms-compare">
            Detailed Comparison →
          </Link>
        </div>
      </div>
    </section>
  );
}

function TutorialCard({tutorial}) {
  return (
    <div className={clsx('col col--3', styles.tutorialCard)}>
      <Link to={tutorial.url} className="card">
        <div className="card__header text--center">
          <div className={styles.tutorialIcon}>{tutorial.icon}</div>
          <h4>{tutorial.title}</h4>
        </div>
        <div className="card__body">
          <p>{tutorial.description}</p>
        </div>
      </Link>
    </div>
  );
}

function TutorialsSection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">
            Learning Tutorials
          </Heading>
          <p>
            Learn tokenized stock trading from scratch
          </p>
        </div>
        <div className="row">
          {tutorials.map((tutorial, idx) => (
            <TutorialCard key={idx} tutorial={tutorial} />
          ))}
        </div>
        <div className="text--center margin-top--lg">
          <Link
            className="button button--outline button--primary button--lg"
            to="/tutorials">
            View All Tutorials →
          </Link>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">
            Frequently Asked Questions
          </Heading>
          <p>
            Quickly understand key information about tokenized stocks
          </p>
        </div>
        <div className="row">
          <div className="col col--8 col--offset-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="text--center margin-top--lg">
          <Link
            className="button button--primary button--lg"
            to="/docs/faq">
            View More FAQ →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className="text--center">
          <Heading as="h2">
            Join Our Community
          </Heading>
          <p className="margin-bottom--lg">
            Get the latest news and exchange experiences with other traders
          </p>
          <div className={styles.communityButtons}>
            <Link
              className="button button--primary button--lg margin--sm"
              href="https://t.me/+C8ooNbjmPgtjNTA1"
              target="_blank">
              📱 Telegram
            </Link>
            <Link
              className="button button--outline button--primary button--lg margin--sm"
              href="https://x.com/Coinowodrop"
              target="_blank">
              🐦 X (Twitter)
            </Link>
            <Link
              className="button button--outline button--primary button--lg margin--sm"
              href="#"
              target="_blank">
              💻 GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Tokenized Stock Trading Platform`}
      description="Explore the world of tokenized US stock trading, trade traditional stocks 24/7, enjoy DeFi convenience. Support tokenized versions of well-known stocks like Apple, Tesla, Microsoft and more.">
      <HeroSection />
      <main>
        <TokenizedStocksSection />
        <PlatformComparisonSection />
        <TutorialsSection />
        <FAQSection />
        <CommunitySection />
      </main>
    </Layout>
  );
}
