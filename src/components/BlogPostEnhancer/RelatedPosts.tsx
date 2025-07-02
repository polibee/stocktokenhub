import React from 'react';
import Link from '@docusaurus/Link';

interface RelatedPost {
  title: string;
  permalink: string;
  excerpt?: string;
  date?: string;
  tags?: string[];
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  currentPostTags?: string[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, currentPostTags = [] }) => {
  // 根据标签相似度排序相关文章
  const sortedPosts = posts
    .map(post => {
      const commonTags = post.tags?.filter(tag => currentPostTags.includes(tag)) || [];
      return {
        ...post,
        relevanceScore: commonTags.length
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3); // 只显示前3篇最相关的文章

  if (sortedPosts.length === 0) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="blog-post-related">
      <h3>相关文章推荐</h3>
      <div className="related-posts-grid">
        {sortedPosts.map((post, index) => (
          <Link
            key={index}
            to={post.permalink}
            className="related-post-card"
          >
            <div className="related-post-title">{post.title}</div>
            {post.excerpt && (
              <div className="related-post-excerpt">
                {post.excerpt.length > 120 
                  ? `${post.excerpt.substring(0, 120)}...` 
                  : post.excerpt
                }
              </div>
            )}
            <div className="related-post-meta">
              {post.date && (
                <span className="related-post-date">
                  {formatDate(post.date)}
                </span>
              )}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="related-post-tags">
                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span key={tagIndex} className="related-post-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;