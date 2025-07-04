import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// Detailed platform data
const platforms = [
  {
    id: 'kraken',
    name: 'Kraken',
    description: 'xStocks - Real Stock Tokenization Products',
    logo: '/img/exchanges/kraken-svgrepo-com.svg',
    website: 'https://kraken.pxf.io/c/1356313/1589189/10583',
    type: 'Centralized Exchange (CEX)',
    founded: '2011',
    headquarters: 'United States',
    regulation: 'Multi-jurisdictional regulation',
    kyc: 'Required',
    tradingHours: '24/5',
    minInvestment: '$1',
    supportedAssets: '60 assets (55 stocks + 5 ETFs)',
    fees: {
      trading: 'Free (USDG/USD)',
      deposit: 'Free (bank transfer)',
      withdrawal: 'Varies by asset type',
      spread: 'Market spread'
    },
    features: {
      leverage: 'Up to 5:1',
      orderTypes: ['Market order', 'Limit order', 'Stop loss'],
      api: 'Supported',
      mobile: 'Supported',
      insurance: 'Partial fund insurance'
    },
    pros: [
      'Regulated real stock tokenization',
      '24/5 trading hours',
      'Minimum $1 investment threshold',
      'Multiple fiat deposit options',
      'High liquidity and depth',
      'Strong security measures'
    ],
    cons: [
      'KYC verification required',
      'Relatively high trading fees',
      'Regional restrictions',
      'Longer customer service response time'
    ],
    bestFor: ['Institutional investors', 'Long-term investors', 'Compliance-focused users'],
    riskLevel: 'Low',
    securityFeatures: ['Cold storage', '2FA', 'Insurance fund', 'SOC 2 certification']
  },
  {
    id: 'gate',
    name: 'Gate.io',
    description: 'xStocks - 24/7 Trading & Futures',
    logo: '/img/exchanges/full-gate-io-logo.svg',
    website: 'https://www.gateweb.xyz/share/bvbnafk',
    type: 'Centralized Exchange (CEX)',
    founded: '2013',
    headquarters: 'Cayman Islands',
    regulation: 'Multi-jurisdictional regulation',
    kyc: 'Required',
    tradingHours: '24/7',
    minInvestment: 'No limit',
    supportedAssets: '8+ xStocks tokens (COINX, NVDAX, CRCLX, AAPLX, METAX, HOODX, TSLAX, GOOGLX)',
    fees: {
      trading: '0.2% (Spot Trading)',
      deposit: 'Free',
      withdrawal: 'Based on network fees',
      spread: 'Competitive spreads'
    },
    features: {
      leverage: 'Up to 10:1 (Futures)',
      orderTypes: ['Market order', 'Limit order', 'Stop loss', 'Take profit'],
      api: 'Supported',
      mobile: 'Excellent mobile app',
      insurance: 'Insurance fund'
    },
    pros: [
      '24/7 xStocks trading',
      'Futures and spot trading',
      'Alpha trading support',
      'High trading volume',
      '3600+ digital assets support',
      '100% reserve commitment'
    ],
    cons: [
      'KYC verification required',
      'Limited xStocks selection',
      'Complex interface for beginners',
      'Regional restrictions in some areas'
    ],
    bestFor: ['Active traders', 'Futures traders', 'Professional investors'],
    riskLevel: 'Medium',
    securityFeatures: ['Cold storage', '2FA', 'Insurance fund', 'Multi-signature']
  },
  {
    id: 'bybit',
    name: 'Bybit',
    description: 'xStocks - Tokenized Stock Trading',
    logo: '/img/exchanges/bybit-svgrepo-com.svg',
    website: 'https://www.bybitglobal.com/invite?ref=LG8DXGG',
    type: 'Centralized Exchange (CEX)',
    founded: '2018',
    headquarters: 'Singapore',
    regulation: 'Partial regulation',
    kyc: 'Required',
    tradingHours: '24/7',
    minInvestment: '$1',
    supportedAssets: '100+ stocks and ETFs',
    fees: {
      trading: '0.1% (spot trading)',
      deposit: 'Free',
      withdrawal: 'Based on network fees',
      spread: 'Tight spreads'
    },
    features: {
      leverage: 'Up to 10:1',
      orderTypes: ['Market order', 'Limit order', 'Conditional order', 'Take profit/Stop loss'],
      api: 'Supported',
      mobile: 'Excellent mobile app',
      insurance: 'Insurance fund'
    },
    pros: [
      '24/7 round-the-clock trading',
      'Leverage trading support',
      'Rich stock selection',
      'Professional trading tools',
      'Mobile optimized',
      'Fast execution'
    ],
    cons: [
      'Less comprehensive regulation than Kraken',
      'Inconsistent customer service quality',
      'Some advanced features are complex',
      'Higher risk management requirements'
    ],
    bestFor: ['Active traders', 'Professional investors', 'Low-fee seeking users'],
    riskLevel: 'Medium',
    securityFeatures: ['Cold storage', '2FA', 'Risk control system', 'Insurance fund']
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    description: 'Solana DEX Aggregator',
    logo: '/img/exchanges/jupiter-ag-jup-logo.svg',
    website: 'https://jup.ag',
    type: 'Decentralized Exchange (DEX)',
    founded: '2021',
    headquarters: 'Decentralized',
    regulation: 'Unregulated',
    kyc: 'Not required',
    tradingHours: '24/7',
    minInvestment: 'No limit',
    supportedAssets: 'All Solana tokens',
    fees: {
      trading: '0.04% + Solana fees',
      deposit: 'Network fees only',
      withdrawal: 'Network fees only',
      spread: 'Aggregated best prices'
    },
    features: {
      leverage: 'Not supported',
      orderTypes: ['Instant swap', 'Limit order'],
      api: 'Supported',
      mobile: 'Mobile-optimized web version',
      insurance: 'None'
    },
    pros: [
      'Decentralized trading',
      'Best price routing',
      'No KYC required',
      'Leverage trading support',
      'Low gas fees',
      'Full self-custody'
    ],
    cons: [
      'No customer support',
      'Higher technical barrier',
      'Market-dependent liquidity',
      'No insurance protection',
      'Smart contract risks'
    ],
    bestFor: ['DeFi users', 'Privacy advocates', 'Technically proficient users'],
    riskLevel: 'High',
    securityFeatures: ['Open source code', 'Audit reports', 'Decentralized', 'Self-custody']
  }
];

// Use the platforms data defined above, but need to convert format
const platformsData = platforms.map(platform => ({
  id: platform.id,
  name: platform.name,
  type: platform.type === 'Centralized Exchange (CEX)' ? 'CEX' : platform.type === 'Decentralized Exchange (DEX)' ? 'DEX Aggregator' : platform.type,
  description: platform.description,
  logo: platform.logo,
  url: platform.website,
  fees: {
    trading: platform.fees.trading,
    spread: platform.fees.spread,
    withdrawal: platform.fees.withdrawal,
    deposit: platform.fees.deposit
  },
  features: {
    kyc: platform.kyc,
    tradingHours: platform.tradingHours,
    minInvestment: platform.minInvestment,
    leverage: platform.features?.leverage || 'None',
    custody: platform.id === 'kraken' ? 'Platform custody + Self-custody option' : 
            platform.id === 'jupiter' ? 'Self-custody' : 'Platform custody',
    fiatSupport: platform.id === 'jupiter' ? 'Not supported' : 'Supported',
    insurance: platform.features?.insurance || 'None'
  },
  assets: {
    count: platform.supportedAssets,
    types: platform.id === 'kraken' ? ['55 stocks', '5 ETFs'] : 
           platform.id === 'gate' ? ['xStocks tokens', 'Alpha trading'] :
           platform.id === 'bybit' ? ['Tech stocks', 'Crypto-related stocks'] : 
           ['Tokenized stocks', 'DeFi tokens', 'Meme coins'],
    examples: platform.id === 'kraken' ? ['AAPLx', 'TSLAx', 'MSFTx', 'GOOGLx', 'AMZNx', 'NVDAx'] : 
             platform.id === 'gate' ? ['COINX', 'NVDAX', 'CRCLX', 'AAPLX', 'METAX', 'HOODX'] :
             platform.id === 'bybit' ? ['COINX', 'NVDAX', 'CRCLX', 'AAPLX', 'HOODX', 'METAX'] : 
             ['Best prices through aggregation']
  },
  advantages: platform.pros,
  disadvantages: platform.cons,
  regions: {
      supported: platform.id === 'kraken' ? ['Parts of Asia'] : 
                platform.id === 'gate' ? ['Most regions globally'] :
                platform.id === 'bybit' ? ['Most regions globally'] : 
                ['Global (no regional restrictions)'],
      restricted: platform.id === 'kraken' ? ['United States', 'Canada', 'United Kingdom', 'European Union', 'Australia'] : 
                 platform.id === 'gate' ? ['United States', 'Some restricted regions'] :
                 platform.id === 'bybit' ? ['United States', 'Some restricted regions'] : 
                 ['No restrictions']
    },
  howToTrade: platform.id === 'kraken' ? [
    'Register Kraken account and complete KYC',
    'Deposit USDG or USD',
    'Search for xStock tokens in spot market',
    'Place orders, supports market and limit orders',
    'Optionally withdraw to your own wallet'
  ] : platform.id === 'gate' ? [
    'Register Gate.io account and complete KYC',
    'Deposit USDT to spot account',
    'Go to xStocks trading zone',
    'Choose spot trading or futures trading',
    'Place orders with leverage up to 10x (futures)'
  ] : platform.id === 'bybit' ? [
    'Register Bybit account and complete KYC Level 1',
    'Deposit USDT to spot account',
    'Go to Spot Trading → USDT → Innovation Zone',
    'Search for xStock tokens (e.g., AAPLX)',
    'Select order type and place trade'
  ] : [
    'Connect Solana wallet (e.g., Phantom)',
    'Ensure wallet has SOL for gas fees',
    'Select trading pair on Jupiter',
    'Set slippage and MEV protection',
    'Confirm transaction and sign'
  ]
}));

const comparisonTable = [
  { label: 'Platform Type', kraken: 'CEX', gate: 'CEX', bybit: 'CEX', jupiter: 'DEX Aggregator' },
  { label: 'Trading Fees', kraken: 'Free (USDG/USD)', gate: '0.2%', bybit: '0.2%', jupiter: '~0.25%' },
  { label: 'KYC Required', kraken: 'Required', gate: 'Required', bybit: 'Required', jupiter: 'Not required' },
  { label: 'Trading Hours', kraken: '24/5', gate: '24/7', bybit: '24/7', jupiter: '24/7' },
  { label: 'Minimum Investment', kraken: '$1', gate: 'No limit', bybit: 'No limit', jupiter: 'No limit' },
  { label: 'Fiat Support', kraken: '✅', gate: '✅', bybit: '✅', jupiter: '❌' },
  { label: 'Self-custody', kraken: '✅', gate: '❌', bybit: '❌', jupiter: '✅' },
  { label: 'Leverage Trading', kraken: '❌', gate: '✅', bybit: '❌', jupiter: '✅' },
  { label: 'Regional Restrictions', kraken: 'More', gate: 'Fewer', bybit: 'Fewer', jupiter: 'None' }
];

export default function PlatformsCompare() {
  const [selectedPlatform, setSelectedPlatform] = useState('kraken');
  const [activeTab, setActiveTab] = useState('overview');

  const currentPlatform = platformsData.find(p => p.id === selectedPlatform);

  return (
    <Layout
      title="Detailed Trading Platform Comparison"
      description="Detailed comparison of tokenized stock trading platforms like Kraken, Bybit, Jupiter - features, fees, pros and cons">
      
      {/* Hero Section */}
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            Detailed Trading Platform Comparison
          </Heading>
          <p className="hero__subtitle">
            In-depth analysis of tokenized stock trading platforms' features, fee structures, and use cases
          </p>
        </div>
      </header>

      <main>
        {/* Quick Comparison Table */}
        <section className={clsx(styles.section, styles.comparisonSection)}>
          <div className="container">
            <Heading as="h2" className="text--center margin-bottom--lg">
              Quick Comparison Table
            </Heading>
            <div className={styles.comparisonGrid}>
              {platformsData.map((platform, idx) => (
                <div key={platform.id} className={styles.comparisonCard}>
                  <div className={styles.comparisonCardHeader}>
                    <img src={platform.logo} alt={platform.name} className={styles.comparisonLogo} />
                    <h3>{platform.name}</h3>
                    <span className={styles.platformType}>{platform.type}</span>
                  </div>
                  <div className={styles.comparisonCardBody}>
                    {comparisonTable.map((row, rowIdx) => (
                      <div key={rowIdx} className={styles.comparisonRow}>
                        <span className={styles.comparisonLabel}>{row.label}</span>
                        <span className={styles.comparisonValue}>
                          {platform.id === 'kraken' ? row.kraken : 
                           platform.id === 'gate' ? row.gate :
                           platform.id === 'bybit' ? row.bybit : row.jupiter}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.comparisonCardFooter}>
                    <Link
                      className="button button--primary button--block"
                      href={platform.url}
                      target="_blank">
                      Visit Platform →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Selector */}
        <section className={clsx(styles.section, styles.detailSection)}>
          <div className="container">
            <Heading as="h2" className="text--center margin-bottom--lg">
              Detailed Platform Analysis
            </Heading>
            
            {/* Platform selection buttons */}
            <div className={clsx(styles.platformSelector, "margin-bottom--lg")}>
              {platformsData.map((platform) => (
                <button
                  key={platform.id}
                  className={clsx(
                    styles.platformSelectorBtn,
                    selectedPlatform === platform.id && styles.platformSelectorBtnActive
                  )}
                  onClick={() => setSelectedPlatform(platform.id)}>
                  <img src={platform.logo} alt={platform.name} className={styles.platformSelectorLogo} />
                  <span>{platform.name}</span>
                  <span className={styles.platformSelectorType}>{platform.type}</span>
                </button>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabNavigation}>
              {[
                { key: 'overview', label: 'Overview', icon: '📊' },
                { key: 'fees', label: 'Fees', icon: '💰' },
                { key: 'features', label: 'Features', icon: '⚙️' },
                { key: 'howto', label: 'Trading Guide', icon: '📖' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={clsx(
                    styles.tabBtn,
                    activeTab === tab.key && styles.tabBtnActive
                  )}
                  onClick={() => setActiveTab(tab.key)}>
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Platform details */}
            {currentPlatform && (
              <div className="card">
                <div className="card__header">
                  <div className="text--center">
                    <img src={currentPlatform.logo} alt={currentPlatform.name} style={{width: '40px', marginBottom: '16px'}} />
                    <Heading as="h3">{currentPlatform.name}</Heading>
                    <p>{currentPlatform.description}</p>
                    <Link
                      className="button button--primary"
                      href={currentPlatform.url}
                      target="_blank">
                      Visit Platform →
                    </Link>
                  </div>
                </div>
                
                <div className="card__body">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="row">
                      <div className="col col--6">
                        <h4>✅ Advantages</h4>
                        <ul>
                          {currentPlatform.advantages.map((advantage, idx) => (
                            <li key={idx}>{advantage}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="col col--6">
                        <h4>❌ Disadvantages</h4>
                        <ul>
                          {currentPlatform.disadvantages.map((disadvantage, idx) => (
                            <li key={idx}>{disadvantage}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="col col--12">
                        <h4>🌍 Regional Support</h4>
                        <p><strong>Supported regions:</strong> {currentPlatform.regions.supported.join(', ')}</p>
                        <p><strong>Restricted regions:</strong> {currentPlatform.regions.restricted.join(', ')}</p>
                      </div>
                    </div>
                  )}

                  {/* Fees Tab */}
                  {activeTab === 'fees' && (
                    <div>
                      <h4>💰 Fee Structure</h4>
                      <div className="table-responsive">
                        <table className="table">
                          <tbody>
                            {Object.entries(currentPlatform.fees).map(([key, value]) => (
                              <tr key={key}>
                                <td><strong>{key === 'trading' ? 'Trading Fees' : 
                                           key === 'spread' ? 'Spread' :
                                           key === 'withdrawal' ? 'Withdrawal Fees' :
                                           key === 'deposit' ? 'Deposit Fees' :
                                           key === 'positionLimit' ? 'Position Limit' :
                                           key === 'solanaFees' ? 'Solana Network Fees' :
                                           key === 'jitoTip' ? 'Jito Tips' :
                                           key === 'platformFee' ? 'Platform Fees' : key}</strong></td>
                                <td>{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Features Tab */}
                  {activeTab === 'features' && (
                    <div>
                      <h4>⚙️ Platform Features</h4>
                      <div className="row">
                        <div className="col col--6">
                          <div className="table-responsive">
                            <table className="table">
                              <tbody>
                                <tr><td><strong>KYC Required</strong></td><td>{currentPlatform.features.kyc}</td></tr>
                                <tr><td><strong>Trading Hours</strong></td><td>{currentPlatform.features.tradingHours}</td></tr>
                                <tr><td><strong>Minimum Investment</strong></td><td>{currentPlatform.features.minInvestment}</td></tr>
                                <tr><td><strong>Leverage Support</strong></td><td>{currentPlatform.features.leverage}</td></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col col--6">
                          <div className="table-responsive">
                            <table className="table">
                              <tbody>
                                <tr><td><strong>Asset Custody</strong></td><td>{currentPlatform.features.custody}</td></tr>
                                <tr><td><strong>Fiat Support</strong></td><td>{currentPlatform.features.fiatSupport}</td></tr>
                                <tr><td><strong>Insurance Protection</strong></td><td>{currentPlatform.features.insurance}</td></tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <h4>📊 Supported Assets</h4>
                      <p><strong>Asset Count:</strong> {currentPlatform.assets.count}</p>
                      <p><strong>Asset Types:</strong> {currentPlatform.assets.types.join(', ')}</p>
                      <p><strong>Examples:</strong> {currentPlatform.assets.examples.join(', ')}</p>
                    </div>
                  )}

                  {/* Trading Guide Tab */}
                  {activeTab === 'howto' && (
                    <div>
                      <h4>📖 Trading Steps</h4>
                      <ol>
                        {currentPlatform.howToTrade.map((step, idx) => (
                          <li key={idx} className="margin-bottom--sm">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Selection Recommendations */}
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className="text--center margin-bottom--lg">
              Selection Recommendations
            </Heading>
            <div className="row">
              <div className="col col--4">
                <div className="card">
                  <div className="card__header text--center">
                    <h3>🔰 Beginner Users</h3>
                  </div>
                  <div className="card__body">
                    <p><strong>Recommended: Kraken</strong></p>
                    <ul>
                      <li>Regulatory protection, fund security</li>
                      <li>Customer support, simple operation</li>
                      <li>Fiat deposits, low barrier to entry</li>
                      <li>Minimum $1 investment threshold</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col col--4">
                <div className="card">
                  <div className="card__header text--center">
                    <h3>💰 Active Traders</h3>
                  </div>
                  <div className="card__body">
                    <p><strong>Recommended: Bybit + Jupiter</strong></p>
                    <ul>
                      <li>Bybit: 24/7 trading hours</li>
                      <li>Jupiter: Best price aggregation</li>
                      <li>High liquidity support</li>
                      <li>Multi-platform arbitrage opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col col--4">
                <div className="card">
                  <div className="card__header text--center">
                    <h3>🚀 DeFi Users</h3>
                  </div>
                  <div className="card__body">
                    <p><strong>Recommended: Jupiter</strong></p>
                    <ul>
                      <li>Fully decentralized</li>
                      <li>No KYC verification required</li>
                      <li>Leverage trading support</li>
                      <li>MEV protection features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Cryptocurrency Exchanges */}
        <section className={styles.section}>
          <div className="container">
            <Heading as="h2" className="text--center margin-bottom--lg">
              🏆 Recommended Cryptocurrency Exchanges
            </Heading>
            <p className="text--center margin-bottom--lg text--secondary">
              Below are carefully selected quality cryptocurrency exchanges to provide you with more trading options
            </p>
            <div className="row">
              {/* Binance */}
              <div className="col col--6 margin-bottom--lg">
                <div className="card">
                  <div className="card__header">
                    <div className="avatar">
                      <img
                        className="avatar__photo"
                        src="/img/exchanges/binance-svgrepo-com.svg"
                        alt="Binance"
                      />
                      <div className="avatar__intro">
                        <div className="avatar__name">Binance</div>
                        <small className="avatar__subtitle">World's Largest Cryptocurrency Exchange</small>
                      </div>
                    </div>
                  </div>
                  <div className="card__body">
                    <p>The world's largest cryptocurrency exchange by trading volume, offering spot, futures, options and various trading services. Features BNB ecosystem and supports over 350 cryptocurrency trading pairs.</p>
                    <ul>
                      <li>✅ World's largest trading volume and liquidity</li>
                      <li>✅ Over 350 cryptocurrencies</li>
                      <li>✅ Diversified trading products</li>
                      <li>✅ BNB ecosystem advantages</li>
                    </ul>
                  </div>
                  <div className="card__footer">
                    <Link
                      className="button button--primary button--block"
                      href="https://accounts.marketwebb.org/register?ref=U7SC8VVH"
                      target="_blank">
                      Register Now →
                    </Link>
                  </div>
                </div>
              </div>

              {/* OKX */}
              <div className="col col--6 margin-bottom--lg">
                <div className="card">
                  <div className="card__header">
                    <div className="avatar">
                      <img
                        className="avatar__photo"
                        src="/img/exchanges/okx-1.svg"
                        alt="OKX"
                      />
                      <div className="avatar__intro">
                        <div className="avatar__name">OKX</div>
                        <small className="avatar__subtitle">Global Leading Digital Asset Platform</small>
                      </div>
                    </div>
                  </div>
                  <div className="card__body">
                    <p>Founded in 2017, offering diverse product matrix including spot, leverage, options/delivery/perpetual contracts, DEX trading, covering over 200 countries and regions.</p>
                    <ul>
                      <li>✅ Among the first globally to offer crypto derivatives</li>
                      <li>✅ Web3 wallet integration</li>
                      <li>✅ Covers 200+ countries and regions</li>
                      <li>✅ Diversified product matrix</li>
                    </ul>
                  </div>
                  <div className="card__footer">
                    <Link
                      className="button button--primary button--block"
                      href="https://okx.com/join/4873400"
                      target="_blank">
                      Register Now →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Gate.io */}
              <div className="col col--6 margin-bottom--lg">
                <div className="card">
                  <div className="card__header">
                    <div className="avatar">
                      <img
                        className="avatar__photo"
                        src="/img/exchanges/full-gate-io-logo.svg"
                        alt="Gate.io"
                      />
                      <div className="avatar__intro">
                        <div className="avatar__name">Gate.io</div>
                        <small className="avatar__subtitle">Top 3 Global Real Trading Volume</small>
                      </div>
                    </div>
                  </div>
                  <div className="card__body">
                    <p>Founded in 2013, ranked top 3 globally by real trading volume, supporting over 3600 digital assets, first exchange to commit to 100% reserves.</p>
                    <ul>
                      <li>✅ Supports 3600+ digital assets</li>
                      <li>✅ 100% reserve commitment</li>
                      <li>✅ Top 3 global trading volume</li>
                      <li>✅ 30+ million users</li>
                    </ul>
                  </div>
                  <div className="card__footer">
                    <Link
                      className="button button--primary button--block"
                      href="https://www.gateweb.xyz/share/bvbnafk"
                      target="_blank">
                      Register Now →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pionex */}
              <div className="col col--6 margin-bottom--lg">
                <div className="card">
                  <div className="card__header">
                    <div className="avatar">
                      <img
                        className="avatar__photo"
                        src="/img/exchanges/pionex@logotyp.us.svg"
                        alt="Pionex"
                      />
                      <div className="avatar__intro">
                        <div className="avatar__name">Pionex</div>
                        <small className="avatar__subtitle">World's Largest Quantitative Trading Bot Platform</small>
                      </div>
                    </div>
                  </div>
                  <div className="card__body">
                    <p>World's first cryptocurrency exchange with built-in quantitative trading bots, offering 16 free trading bots and aggregating liquidity from Binance and Huobi.</p>
                    <ul>
                      <li>✅ 16 free trading bots</li>
                      <li>✅ Aggregated top exchange liquidity</li>
                      <li>✅ Grid trading expert</li>
                      <li>✅ 24/7 automated trading</li>
                    </ul>
                  </div>
                  <div className="card__footer">
                    <Link
                      className="button button--primary button--block"
                      href="https://www.pionex.com/zh-CN/signUp?r=01R9g2jyJ5G"
                      target="_blank">
                      Register Now →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Backpack */}
              <div className="col col--6 margin-bottom--lg">
                <div className="card">
                  <div className="card__header">
                    <div className="avatar">
                      <img
                        className="avatar__photo"
                        src="/img/exchanges/backpack-logo.svg"
                        alt="Backpack"
                      />
                      <div className="avatar__intro">
                        <div className="avatar__name">Backpack</div>
                        <small className="avatar__subtitle">CEX + Self-Custody Exchange</small>
                      </div>
                    </div>
                  </div>
                  <div className="card__body">
                    <p>VARA-regulated exchange with self-custody features, supporting Solana ecosystem assets with fast spot and derivatives trading capabilities.</p>
                    <ul>
                      <li>✅ CEX + self-custody wallet integration</li>
                      <li>✅ VARA (Dubai) regulatory authorization</li>
                      <li>✅ $118M asset reserves</li>
                      <li>✅ Solana ecosystem support</li>
                    </ul>
                  </div>
                  <div className="card__footer">
                    <Link
                      className="button button--primary button--block"
                      href="https://backpack.exchange/join/83faf9aa-e6a4-47ec-8f24-fe64708b3cb6"
                      target="_blank">
                      Register Now →
                    </Link>
                  </div>
                </div>
              </div>

              {/* EdgeX */}
              <div className="col col--6 margin-bottom--lg">
                <div className="card">
                  <div className="card__header">
                    <div className="avatar">
                      <img
                        className="avatar__photo"
                        src="/img/exchanges/edgex-logo.svg"
                        alt="EdgeX"
                      />
                      <div className="avatar__intro">
                        <div className="avatar__name">EdgeX</div>
                        <small className="avatar__subtitle">High-Performance Decentralized Derivatives DEX</small>
                      </div>
                    </div>
                  </div>
                  <div className="card__body">
                    <p>2023 launched by Amber Group, high-performance decentralized perpetual DEX with 20,000 TPS, supporting up to 100x leverage trading.</p>
                    <ul>
                      <li>✅ 20,000 TPS high-performance trading</li>
                      <li>✅ Up to 100x leverage support</li>
                      <li>✅ StarkWare zero-knowledge proof technology</li>
                      <li>✅ $350-480M daily trading volume</li>
                    </ul>
                  </div>
                  <div className="card__footer">
                    <Link
                      className="button button--primary button--block"
                      href="https://pro.edgex.exchange/referral/landing/590595640"
                      target="_blank">
                      Register Now →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text--center margin-top--lg">
              <div className="alert alert--info">
                <p><strong>💡 Friendly Reminder:</strong> The above exchanges are all well-known platforms, please choose according to your needs. It is recommended to diversify investments to reduce single platform risk.</p>
              </div>
              <div className="alert alert--warning margin-top--lg">
                <h4>⚠️ Risk Warning</h4>
                <p>
                  Cryptocurrency trading involves high risks with significant price volatility. Please ensure you understand the associated risks and invest cautiously based on your financial situation.
                  The information provided on this site is for reference only and does not constitute investment advice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Warning */}
        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className="container">
            <div className="text--center">
              <Heading as="h2">⚠️ Risk Warning</Heading>
              <div className="row">
                <div className="col col--8 col--offset-2">
                  <div className="alert alert--warning">
                    <h4>Investment Risks</h4>
                    <ul className="text--left">
                      <li>Tokenized stock prices may differ from traditional stocks</li>
                      <li>Centralized exchanges have platform risks</li>
                      <li>Decentralized trading has smart contract risks</li>
                      <li>Cryptocurrency markets are highly volatile</li>
                      <li>Regulatory policies may change</li>
                    </ul>
                    <p><strong>Please invest with full understanding of risks. Diversified investment is recommended to reduce risk.</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}