import React, {type ReactNode} from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import type BlogPostPageType from '@theme/BlogPostPage';
import type {WrapperProps} from '@docusaurus/types';
import BlogPostEnhancer from '../../components/BlogPostEnhancer';

type Props = WrapperProps<typeof BlogPostPageType>;

export default function BlogPostPageWrapper(props: Props): ReactNode {
  return (
    <BlogPostEnhancer>
      <BlogPostPage {...props} />
    </BlogPostEnhancer>
  );
}
