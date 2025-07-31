export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Blog specific events
export const trackBlogRead = (articleTitle: string, readPercentage: number) => {
  event({
    action: 'blog_read',
    category: 'engagement',
    label: articleTitle,
    value: readPercentage,
  });
};

export const trackSearchUsed = (searchTerm: string) => {
  event({
    action: 'search_used',
    category: 'engagement',
    label: searchTerm,
  });
};

export const trackCardHover = (articleTitle: string) => {
  event({
    action: 'card_hover',
    category: 'engagement',
    label: articleTitle,
  });
};

export const trackCitationClick = (url: string) => {
  event({
    action: 'citation_click',
    category: 'engagement',
    label: url,
  });
}; 

export const trackEvent = (eventName: string, parameters: any = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'blog',
      ...parameters
    });
  }
};

export const trackReadingProgress = (progress: number) => {
  if (progress % 25 === 0) {
    trackEvent('reading_progress', {
      event_label: `${progress}%`,
      value: progress
    });
  }
};

export const trackArticleView = (articleSlug: string, title: string) => {
  trackEvent('article_view', {
    event_label: title,
    custom_parameter: articleSlug
  });
}; 