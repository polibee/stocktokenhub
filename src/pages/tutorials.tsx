import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import { ReactNode } from 'react';
import { formatDistance } from 'date-fns';
import { zhCN } from 'date-fns/locale';

import styles from './tutorials.module.css';

// 分类数据
const categories = [
  { id: 'all', name: 'All Tutorials', icon: '📚' },
  { id: 'tutorial', name: 'Tutorial Guide', icon: '🚀' },
  { id: 'basics', name: 'Basic Knowledge', icon: '📖' },
  { id: 'trading', name: 'Trading Platforms', icon: '💱' },
  { id: 'advanced', name: 'Advanced Strategies', icon: '🎯' }
];

// 难度映射
const difficultyMap = {
  'tutorial': 'Beginner',
  'basics': 'Elementary', 
  'trading': 'Intermediate',
  'advanced': 'Advanced'
};

// 分类映射
const categoryMap = {
  'tutorial': 'Tutorial Guide',
  'basics': 'Basic Knowledge',
  'trading': 'Trading Platforms', 
  'advanced': 'Advanced Strategies'
};

// 难度颜色映射
const difficultyColors = {
  'Elementary': 'success',
  'Intermediate': 'warning', 
  'Advanced': 'danger'
};

function HeroSection() {
  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            Learning Tutorials
          </Heading>
          <p className={styles.heroSubtitle}>
            Learn tokenized stock trading from scratch, master various trading strategies and techniques
          </p>
        </div>
      </div>
    </header>
  );
}

function CategoryFilter({ activeCategory, onCategoryChange, searchTerm, onSearchChange, categoriesWithCount }: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoriesWithCount: Array<{id: string, name: string, icon: string, count: number}>;
}) {
  return (
    <section className={styles.categoryFilter}>
      <div className="container">
        {/* 搜索框 */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className={styles.clearButton}
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {/* 分类过滤器 */}
        <div className={styles.filterButtons}>
          {categoriesWithCount.map((category) => (
            <button
              key={category.id}
              className={clsx(
                styles.filterButton,
                activeCategory === category.id && styles.filterButtonActive
              )}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span className={styles.categoryName}>{category.name}</span>
              <span className={styles.categoryCount}>({category.count})</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TutorialCard({ tutorial }: { tutorial: any }) {
  const relativeTime = formatDistance(tutorial.date, new Date(), { 
    addSuffix: true, 
    locale: zhCN 
  });

  return (
    <Link to={tutorial.url} className={styles.tutorialCardLink}>
      <article className={styles.tutorialCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardImageContainer}>
          <img 
            src={tutorial.thumbnail} 
            alt={tutorial.title}
            className={styles.cardThumbnail}
            loading="lazy"
          />
          <div className={styles.cardOverlay}>
            <span className={clsx(
              styles.difficultyBadge,
              styles[`difficulty${tutorial.difficulty.replace(/级/, '')}`]
            )}>
              {tutorial.difficulty}
            </span>
          </div>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.cardMeta}>
          <span className={styles.category}>
            {categoryMap[tutorial.category] || tutorial.category}
          </span>
          <span className={styles.readTime}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {tutorial.readTime}
          </span>
        </div>
        
        <h3 className={styles.cardTitle}>
          <Link to={tutorial.url} className={styles.titleLink}>
            {tutorial.title}
          </Link>
        </h3>
        
        <p className={styles.cardDescription}>{tutorial.description}</p>
        
        <div className={styles.cardTags}>
          {tutorial.tags.slice(0, 4).map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.cardInfo}>
          <time className={styles.lastUpdated} dateTime={tutorial.date.toISOString()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {relativeTime}
          </time>
        </div>
        <Link to={tutorial.url} className={styles.cardButton}>
          Start Learning
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
      </article>
    </Link>
  );
}

function TutorialsGrid({ tutorials }: { tutorials: any[] }) {
  if (tutorials.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📚</div>
        <h3>No Tutorials</h3>
        <p>No tutorial content available in this category</p>
      </div>
    );
  }

  return (
    <div className={styles.tutorialsGrid}>
      {tutorials.map((tutorial) => (
        <TutorialCard key={tutorial.id} tutorial={tutorial} />
      ))}
    </div>
  );
}



const staticTutorialsData = [
  {
    id: 'tutorial-intro',
    title: 'Getting Started with Tokenized Stocks',
    description: 'Learn the basics of tokenized stocks and how to get started with trading on Solana.',
    category: 'basics',
    difficulty: 'beginner',
    readTime: 5,
    date: new Date('2024-01-15'),
    thumbnail: '/img/tutorials/intro.svg',
    url: '/blog/tutorial-intro',
    tags: ['basics', 'getting-started']
  },
  {
    id: 'tutorial-basics',
    title: 'Understanding Stock Tokenization',
    description: 'Deep dive into how traditional stocks are tokenized on the blockchain.',
    category: 'basics',
    difficulty: 'beginner',
    readTime: 8,
    date: new Date('2024-01-10'),
    thumbnail: '/img/tutorials/basics.svg',
    url: '/blog/tutorial-basics',
    tags: ['basics', 'tokenization']
  },
  {
    id: 'tutorial-dex',
    title: 'Trading on Decentralized Exchanges',
    description: 'Learn how to trade tokenized stocks on DEXs like Jupiter.',
    category: 'trading',
    difficulty: 'intermediate',
    readTime: 12,
    date: new Date('2024-01-08'),
    thumbnail: '/img/tutorials/dex.svg',
    url: '/blog/tutorial-dex',
    tags: ['trading', 'dex']
  },
  {
    id: 'tutorial-cex',
    title: 'Centralized vs Decentralized Trading',
    description: 'Compare trading on centralized and decentralized platforms.',
    category: 'trading',
    difficulty: 'intermediate',
    readTime: 10,
    date: new Date('2024-01-05'),
    thumbnail: '/img/tutorials/cex.svg',
    url: '/blog/tutorial-cex',
    tags: ['trading', 'comparison']
  },
  {
    id: 'tutorial-advanced',
    title: 'Advanced Trading Strategies',
    description: 'Explore advanced strategies for tokenized stock trading.',
    category: 'advanced',
    difficulty: 'advanced',
    readTime: 15,
    date: new Date('2024-01-03'),
    thumbnail: '/img/tutorials/advanced.svg',
    url: '/blog/tutorial-advanced',
    tags: ['advanced', 'strategies']
  }
];

// 注意：这些数据应该与 /blog/ 文件夹中的实际MDX文件保持同步
// 当添加新的博客文章时，请同时更新这个数组

export default function TutorialsPage(): ReactNode {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 使用静态教程数据
  const tutorialsData = useMemo(() => {
    return staticTutorialsData.map(tutorial => {
        return {
           id: tutorial.id,
           title: tutorial.title,
           description: tutorial.description || '',
           category: tutorial.category,
          readTime: `${tutorial.readTime} min`,
           lastUpdated: tutorial.date.toLocaleDateString('zh-CN'),
          thumbnail: tutorial.thumbnail || '/img/tutorials/default.svg',
           url: tutorial.url,
          difficulty: difficultyMap[tutorial.category] || 'Elementary',
           tags: tutorial.tags,
          date: tutorial.date
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, []);

  // 更新分类数据以包含计数
  const categoriesWithCount = useMemo(() => {
    return categories.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? tutorialsData.length : tutorialsData.filter(t => t.category === cat.id).length
    }));
  }, [tutorialsData]);

  // 过滤教程
  const filteredTutorials = tutorialsData.filter(tutorial => {
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout
      title="Learning Tutorials"
      description="Learn tokenized stock trading from scratch, master various trading strategies and techniques">
      <HeroSection />
      <CategoryFilter 
        activeCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoriesWithCount={categoriesWithCount}
      />
      <main>
        <section className="container margin-vert--lg">
          {filteredTutorials.length > 0 ? (
            <>
              <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>
                  {searchTerm ? (
                    <>Search Results <span className={styles.searchTerm}>"{searchTerm}"</span></>
                  ) : (
                    selectedCategory === 'all' ? 'All Tutorials' : categoriesWithCount.find(c => c.id === selectedCategory)?.name
                  )}
                </h2>
                <span className={styles.resultsCount}>
                  {filteredTutorials.length} tutorials found
                </span>
              </div>
              <TutorialsGrid tutorials={filteredTutorials} />
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📚</div>
              <h3 className={styles.emptyTitle}>
                {searchTerm ? 'No Related Tutorials Found' : 'No Tutorials'}
              </h3>
              <p className={styles.emptyDescription}>
                {searchTerm ? (
                  <>Try searching with other keywords, or <button onClick={() => setSearchTerm('')} className={styles.clearSearchButton}>clear search conditions</button></>
                ) : (
                  'Tutorials are being prepared, stay tuned'
                )}
              </p>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}