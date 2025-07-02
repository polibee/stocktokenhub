import React, { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import RelatedPosts from './RelatedPosts';

interface BlogPostEnhancerProps {
  children: React.ReactNode;
}

const BlogPostEnhancer: React.FC<BlogPostEnhancerProps> = ({ children }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const location = useLocation();
  
  // 博客文章数据现在通过其他方式获取
  const blogPostData = null;

  // 计算阅读进度
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // 获取相关文章
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // 模拟相关文章数据，实际项目中应该从API或静态数据获取
        const mockRelatedPosts = [
          {
            title: "代币化股票交易基础教程",
            permalink: "/blog/tutorial-basics",
            excerpt: "了解代币化股票交易的基本概念和操作流程，为新手投资者提供全面的入门指导。",
            date: "2025-01-01",
            tags: ["教程", "基础", "代币化股票"]
          },
          {
            title: "高级交易策略与技巧",
            permalink: "/blog/tutorial-advanced",
            excerpt: "深入探讨代币化股票的高级交易策略，包括风险管理和投资组合优化。",
            date: "2025-01-02",
            tags: ["高级", "策略", "风险管理"]
          },
          {
            title: "中心化交易所使用指南",
            permalink: "/blog/tutorial-cex",
            excerpt: "详细介绍如何在中心化交易所进行代币化股票交易，包括注册、验证和交易流程。",
            date: "2025-01-03",
            tags: ["CEX", "交易所", "教程"]
          }
        ];
        setRelatedPosts(mockRelatedPosts);
      } catch (error) {
        console.error('Failed to fetch related posts:', error);
      }
    };

    fetchRelatedPosts();
  }, [location.pathname]);

  // 返回顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 检查是否为博客相关页面
  const isBlogPost = location.pathname.startsWith('/blog/') && location.pathname !== '/blog/' && location.pathname !== '/blog';
  const isBlogPage = location.pathname.startsWith('/blog');

  // 如果不是博客相关页面，只返回子组件
  if (!isBlogPage) {
    return <>{children}</>;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const currentTitle = typeof document !== 'undefined' ? document.title : '';
  const currentTags = blogPostData?.metadata?.tags?.map(tag => tag.label) || [];

  return (
    <>
      {/* 阅读进度条 - 只在博客文章页面显示 */}
      {isBlogPost && (
        <div className="reading-progress">
          <div 
            className="reading-progress-bar" 
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {children}

      {/* 社交分享功能已移至全局组件 */}

      {/* 相关文章推荐 - 只在博客文章页面显示 */}
      {isBlogPost && (
        <RelatedPosts 
          posts={relatedPosts}
          currentPostTags={currentTags}
        />
      )}

      {/* 返回顶部按钮 */}
      {showBackToTop && (
        <button 
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="返回顶部"
        >
          ↑
        </button>
      )}
    </>
  );
};

export default BlogPostEnhancer;