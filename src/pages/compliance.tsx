import React, { useState } from 'react';
import type { JSX } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

// 定义公司数据类型
interface CompanyData {
  id: string;
  name: string;
  logo: string;
  description: string;
  issuer: {
    name: string;
    location: string;
    regulator: string;
    license: string[];
  };
  custodians: Array<{
    name: string;
    location: string;
    role: string;
  }>;
  prohibitedCountries: Array<{
    flag: string;
    name: string;
    reason: string;
  }>;
  restrictedCountries: string[];
  contactInfo: {
    email: string;
    website: string;
    address: string;
  };
  legalDocs: Array<{
    title: string;
    url: string;
  }>;
}

// 公司数据
const companiesData: CompanyData[] = [
  {
    id: 'xstock',
    name: 'xStock (Backed Assets)',
    logo: '🏢',
    description: 'Tokenized stock services provided by Backed Assets',
    issuer: {
      name: 'Backed Assets (JE) Limited',
      location: 'Jersey, Channel Islands',
      regulator: 'JFSC',
      license: ['Financial Services License', 'Digital Asset Custody License']
    },
    custodians: [
      {
        name: 'Alpaca Securities LLC',
        location: 'New York, USA',
        role: 'Primary Custodian'
      },
      {
        name: 'InCore Bank AG',
        location: 'Switzerland',
        role: 'Custodian Bank'
      },
      {
        name: 'Maerki Baumann & Co. AG',
        location: 'Zurich, Switzerland',
        role: 'Private Bank'
      }
    ],
    prohibitedCountries: [
      { flag: '🇮🇷', name: 'Iran', reason: 'International Sanctions' },
      { flag: '🇰🇵', name: 'North Korea', reason: 'International Sanctions' },
      { flag: '🇸🇾', name: 'Syria', reason: 'International Sanctions' },
      { flag: '🇺🇸', name: 'United States', reason: 'Unregistered Securities' },
    ],
    restrictedCountries: [
      '🇦🇫 Afghanistan', '🇧🇾 Belarus', '🇨🇫 Central African Republic', '🇨🇩 Democratic Republic of Congo',
      '🇨🇺 Cuba', '🇪🇹 Ethiopia', '🇭🇹 Haiti', '🇮🇶 Iraq',
      '🇱🇧 Lebanon', '🇱🇾 Libya', '🇲🇱 Mali', '🇲🇿 Mozambique',
      '🇲🇲 Myanmar', '🇳🇮 Nicaragua', '🇳🇬 Nigeria', '🇺🇦 Ukraine Occupied Areas',
      '🇷🇺 Russia', '🇸🇴 Somalia', '🇸🇸 South Sudan', '🇸🇩 Sudan',
      '🇹🇷 Turkey', '🇻🇪 Venezuela', '🇾🇪 Yemen', '🇿🇼 Zimbabwe'
    ],
    contactInfo: {
      email: 'contact@backedassets.fi',
      website: 'https://assets.backed.fi',
      address: 'First Floor, La Chasse Chambers, Ten La Chasse,St. Helier, Jersey, JE2 4UE',
    },
    legalDocs: [
      { title: 'Legal Documentation', url: 'https://assets.backed.fi/legal-documentation' },
      { title: 'Service Providers', url: 'https://assets.backed.fi/legal-documentation/service-providers' },
      { title: 'Restricted Countries', url: 'https://assets.backed.fi/legal-documentation/restricted-countries' }
    ]
  },
  // 可以在这里添加更多公司数据
  {
    id: 'future-company',
    name: 'Future Partners',
    logo: '🚀',
    description: 'More tokenized stock providers coming soon',
    issuer: {
      name: 'Coming Soon',
      location: 'Global',
      regulator: 'TBD',
      license: ['To Be Announced']
    },
    custodians: [
      {
        name: 'To Be Announced',
        location: 'Global',
        role: 'Custody Services'
      }
    ],
    prohibitedCountries: [],
    restrictedCountries: [],
    contactInfo: {
      email: 'coming-soon@example.com',
      website: '#',
      address: 'Coming Soon'
    },
    legalDocs: []
  }
];

function ComplianceHeader({ selectedCompany, onCompanyChange }: { selectedCompany: string, onCompanyChange: (companyId: string) => void }) {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <h1 className="hero__title">Compliance Information Center</h1>
        <p className="hero__subtitle">
          Understand the complete compliance framework, regulatory requirements and geographical restrictions for tokenized stocks
        </p>
        
        {/* 公司选择器 */}
        <div className="margin-bottom--lg">
          <div className="tabs tabs--block">
            {companiesData.map((company) => (
              <div
                key={company.id}
                className={`tabs__item ${
                  selectedCompany === company.id ? 'tabs__item--active' : ''
                }`}
                onClick={() => onCompanyChange(company.id)}
                style={{
                  cursor: 'pointer',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  margin: '0 8px',
                  backgroundColor: selectedCompany === company.id ? 'var(--ifm-color-primary)' : 'var(--ifm-background-surface-color)',
                  color: selectedCompany === company.id ? 'white' : 'var(--ifm-color-content)',
                  border: '2px solid',
                  borderColor: selectedCompany === company.id ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-300)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '1.2em', marginRight: '8px' }}>{company.logo}</span>
                <strong>{company.name}</strong>
                <div style={{ fontSize: '0.85em', opacity: 0.8, marginTop: '4px' }}>
                  {company.description}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/compliance">
            View Detailed Compliance Documentation 📋
          </Link>
        </div>
      </div>
    </header>
  );
}

function ComplianceOverview({ company }: { company: CompanyData }) {
  const features = [
    {
      icon: '🏢',
      title: 'Issuer Information',
      description: company.issuer.name,
      details: [
        `Registered in ${company.issuer.location}`,
        `Regulated by ${company.issuer.regulator}`,
        ...company.issuer.license
      ]
    },
    {
      icon: '🌍',
      title: 'Custody Services',
      description: company.custodians.length > 0 ? 'Custody provided by multiple renowned international institutions' : 'Custody information to be announced',
      details: company.custodians.map(custodian => custodian.name)
    },
    {
      icon: '⚖️',
      title: 'Compliance Framework',
      description: 'Strictly adheres to international financial regulations',
      details: ['Regular audit reports', 'Transparency disclosure', 'Investor protection measures']
    },
    {
      icon: '🔒',
      title: 'Asset Security',
      description: 'Multiple security protection mechanisms',
      details: ['Cold storage protection', 'Insurance coverage', 'Risk management system']
    }
  ];

  return (
    <section className={styles.complianceOverview}>
      <div className="container">
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              <ul className={styles.featureDetails}>
                {feature.details.map((detail, detailIdx) => (
                  <li key={detailIdx}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RestrictedCountries({ company }: { company: CompanyData }) {
  const prohibitedCountries = company.prohibitedCountries;
  const restrictedCountries = company.restrictedCountries;

  return (
    <section className={styles.restrictionsSection}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <h2>🚫 Regional Restriction Information</h2>
          <p className={styles.sectionSubtitle}>Understand service availability and regional restrictions</p>
        </div>
        
        <div className={styles.restrictionsGrid}>
          <div className={styles.restrictionCard}>
            <div className={styles.restrictionCardHeader}>
              <div className={styles.restrictionIcon}>❌</div>
              <h3>Completely Prohibited Regions</h3>
              <p>Residents of the following regions cannot use this service</p>
            </div>
            <div className={styles.restrictionCardBody}>
              {prohibitedCountries.length > 0 ? (
                prohibitedCountries.map((country, idx) => (
                  <div key={idx} className={styles.countryItem}>
                    <span className={styles.countryFlag}>{country.flag}</span>
                    <div className={styles.countryInfo}>
                      <strong>{country.name}</strong>
                      <small>{country.reason}</small>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-600)', fontStyle: 'italic' }}>
                  No prohibited region information available
                </p>
              )}
            </div>
          </div>
          
          <div className={styles.restrictionCard}>
            <div className={styles.restrictionCardHeader}>
              <div className={styles.restrictionIcon}>⚠️</div>
              <h3>Restricted Regions</h3>
              <p>The following regions may have additional restrictions or requirements</p>
            </div>
            <div className={styles.restrictionCardBody}>
              {restrictedCountries.length > 0 ? (
                <div className={styles.countriesGrid}>
                  {restrictedCountries.map((country, idx) => (
                    <div key={idx} className={styles.countryTag}>
                      {country}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-600)', fontStyle: 'italic' }}>
                  No restricted region information available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceProviders({ company }: { company: CompanyData }) {
  const custodians = company.custodians;

  return (
    <section className="margin-top--lg margin-bottom--lg">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <h2 className="text--center margin-bottom--lg">🏢 Core Service Providers</h2>
          </div>
        </div>
        
        <div className="row">
          {custodians.length > 0 ? (
            custodians.map((provider, index) => (
              <div key={index} className="col col--4">
                <div className="card">
                  <div className="card__header">
                    <h3>{provider.name}</h3>
                  </div>
                  <div className="card__body">
                    <p><strong>Location:</strong> {provider.location}</p>
                    <p><strong>Role:</strong> {provider.role}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col col--12">
              <div className="card">
                <div className="card__body text--center">
                  <p style={{ color: 'var(--ifm-color-emphasis-600)', fontStyle: 'italic' }}>
                    Service provider information to be announced
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {company.legalDocs.length > 0 && (
          <div className="row margin-top--md">
            <div className="col col--12 text--center">
              <Link
                className="button button--secondary button--lg"
                to="/docs/compliance#-service-providers">
                View the complete list of service providers →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function RiskWarning() {
  return (
    <section className="margin-top--lg margin-bottom--lg">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="card" style={{border: '2px solid #ff6b6b'}}>
              <div className="card__header" style={{backgroundColor: '#ffe0e0'}}>
                <h2>⚠️ Important Risk Warning</h2>
              </div>
              <div className="card__body">
                <div className="row">
                  <div className="col col--6">
                    <h3>Investment Risks</h3>
                    <ul>
                      <li>💰 <strong>Price Volatility</strong>: Investment value may fluctuate significantly</li>
                      <li>🔻 <strong>Principal Risk</strong>: May lose entire investment</li>
                      <li>💧 <strong>Liquidity Risk</strong>: May not be able to liquidate in time</li>
                      <li>⚙️ <strong>Technical Risk</strong>: Blockchain and smart contract risks</li>
                    </ul>
                  </div>
                  <div className="col col--6">
                    <h3>Product Characteristics</h3>
                    <ul>
                      <li>🗳️ <strong>No Shareholder Rights</strong>: Does not grant voting rights or dividend rights</li>
                      <li>📈 <strong>Price Tracking</strong>: Only provides exposure to underlying asset prices</li>
                      <li>🔄 <strong>Automatic Reinvestment</strong>: Dividends automatically reinvested into more tokens</li>
                      <li>⚖️ <strong>Regulatory Risk</strong>: Regulatory changes may affect the product</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComplianceActions() {
  return (
    <section className="margin-top--lg margin-bottom--lg">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <h2 className="text--center margin-bottom--lg">📋 Compliance Action Guidelines</h2>
          </div>
        </div>
        
        <div className="row">
          <div className="col col--6">
            <div className="card">
              <div className="card__header">
                <h3>👤 Investor Obligations</h3>
              </div>
              <div className="card__body">
                <ol>
                  <li><strong>Identity Verification</strong>: Complete KYC/AML verification</li>
                  <li><strong>Suitability Assessment</strong>: Ensure product fits investment objectives</li>
                  <li><strong>Legal Compliance</strong>: Comply with local laws and regulations</li>
                  <li><strong>Tax Reporting</strong>: Report taxes according to local requirements</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="col col--6">
            <div className="card">
              <div className="card__header">
                <h3>🏛️ Platform Obligations</h3>
              </div>
              <div className="card__body">
                <ol>
                  <li><strong>Customer Due Diligence</strong>: Implement strict KYC procedures</li>
                  <li><strong>Anti-Money Laundering</strong>: Monitor suspicious trading activities</li>
                  <li><strong>Geographic Restrictions</strong>: Block access from restricted regions</li>
                  <li><strong>Risk Disclosure</strong>: Provide complete risk information</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfo({ company }: { company: CompanyData }) {
  return (
    <section className="margin-top--lg margin-bottom--lg">
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <div className="card">
              <div className="card__header">
                <h2>📞 Compliance Contact Information</h2>
              </div>
              <div className="card__body">
                <div className="row">
                  <div className="col col--6">
                    <h3>联系信息</h3>
                    <ul>
                      <li>📧 <strong>Email</strong>: {company.contactInfo.email}</li>
                      <li>🏢 <strong>Company</strong>: {company.issuer.name}</li>
                      <li>📍 <strong>Address</strong>: {company.contactInfo.address}</li>
                      {company.contactInfo.website !== '#' && (
                        <li>🌐 <strong>Website</strong>: <a href={company.contactInfo.website} target="_blank">{company.contactInfo.website}</a></li>
                      )}
                    </ul>
                  </div>
                  <div className="col col--6">
                    <h3>Related Links</h3>
                    {company.legalDocs.length > 0 ? (
                      <ul>
                        {company.legalDocs.map((doc, index) => (
                          <li key={index}>
                            📋 <a href={doc.url} target="_blank">{doc.title}</a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: 'var(--ifm-color-emphasis-600)', fontStyle: 'italic' }}>
                        Legal documents to be announced
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Compliance(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const [selectedCompany, setSelectedCompany] = useState<string>('xstock');
  
  const currentCompany = companiesData.find(company => company.id === selectedCompany) || companiesData[0];
  
  return (
    <Layout
      title="Compliance Information Center"
      description="Understand the complete compliance framework, regulatory requirements and geographical restrictions for tokenized stocks">
      <ComplianceHeader 
        selectedCompany={selectedCompany} 
        onCompanyChange={setSelectedCompany} 
      />
      <main>
        <ComplianceOverview company={currentCompany} />
        <RestrictedCountries company={currentCompany} />
        <ServiceProviders company={currentCompany} />
        <RiskWarning />
        <ComplianceActions />
        <ContactInfo company={currentCompany} />
      </main>
    </Layout>
  );
}