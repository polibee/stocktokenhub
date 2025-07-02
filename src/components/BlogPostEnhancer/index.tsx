import React from 'react';
import GlobalShare from '../GlobalShare';


interface BlogPostEnhancerProps {
  children?: React.ReactNode;
}

const BlogPostEnhancer: React.FC<BlogPostEnhancerProps> = ({ children }) => {
  // Get current page info from window location
  const getCurrentPageInfo = () => {
    if (typeof window === 'undefined') return null;
    
    const pathname = window.location.pathname;
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    return {
      url: window.location.href,
      title,
      description,
      isBlogPost: pathname.startsWith('/blog/')
    };
  };
  
  const pageInfo = getCurrentPageInfo();
  
  // Only render on blog posts
  if (!pageInfo?.isBlogPost) {
    return <>{children}</>;
  }
  
  return (
    <>
      <div className="blog-post-enhancer">
        <GlobalShare />
      </div>
      {children}
    </>
  );
};

export default BlogPostEnhancer;