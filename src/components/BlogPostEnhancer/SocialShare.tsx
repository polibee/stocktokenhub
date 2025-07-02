import React, { useEffect } from 'react';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ title, url, description = '' }) => {
  useEffect(() => {
    // 检查是否已经加载过脚本
    const existingScript = document.querySelector('script[src="https://static.addtoany.com/menu/page.js"]');
    
    if (!existingScript) {
      // 设置AddToAny配置（在脚本加载前设置）
      (window as any).a2a_config = {
        linkname: title,
        linkurl: url,
        locale: 'zh-CN',
        num_services: 20,
        prioritize: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'reddit']
      };

      // 动态加载AddToAny脚本
      const script = document.createElement('script');
      script.src = 'https://static.addtoany.com/menu/page.js';
      script.async = true;
      script.onload = () => {
        console.log('AddToAny script loaded successfully');
        // 强制重新初始化AddToAny
        if ((window as any).a2a) {
          (window as any).a2a.init_all();
        }
      };
      script.onerror = () => {
        console.error('Failed to load AddToAny script');
      };
      document.head.appendChild(script);
    } else {
      // 如果脚本已存在，更新配置并重新初始化
      (window as any).a2a_config = {
        linkname: title,
        linkurl: url,
        locale: 'zh-CN',
        num_services: 20,
        prioritize: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'reddit']
      };
      
      if ((window as any).a2a) {
        (window as any).a2a.init_all();
      }
    }
  }, [title, url]);

  return (
    <div className="blog-post-social">
      <div 
        className="a2a_kit a2a_kit_size_32 a2a_default_style"
        data-a2a-url={url}
        data-a2a-title={title}
      >
        <a className="a2a_button_facebook" title="分享到Facebook"></a>
        <a className="a2a_button_twitter" title="分享到Twitter"></a>
        <a className="a2a_button_linkedin" title="分享到LinkedIn"></a>
        <a className="a2a_button_wechat" title="分享到微信"></a>
        <a className="a2a_button_sina_weibo" title="分享到微博"></a>
        <a className="a2a_button_telegram" title="分享到Telegram"></a>
        <a className="a2a_button_copy_link" title="复制链接"></a>
        <a className="a2a_dd" href="https://www.addtoany.com/share" title="更多分享选项">⋯</a>
      </div>
    </div>
  );
};

export default SocialShare;