// Improved article extraction with multiple proxy fallbacks and timeout handling
const PROXY_SERVICES = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/get?url=',
  'https://thingproxy.freeboard.io/fetch/'
];

const TIMEOUT_DURATION = 15000; // 15 seconds timeout

// Create a timeout promise
const timeoutPromise = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
};

// Fetch with timeout
const fetchWithTimeout = async (url, timeout = TIMEOUT_DURATION) => {
  return Promise.race([
    fetch(url),
    timeoutPromise(timeout)
  ]);
};

// Try multiple proxy services
const fetchThroughProxy = async (url) => {
  const encodedUrl = encodeURIComponent(url);
  
  for (let i = 0; i < PROXY_SERVICES.length; i++) {
    const proxy = PROXY_SERVICES[i];
    let proxyUrl;
    
    try {
      // Different proxy services have different URL formats
      if (proxy.includes('allorigins')) {
        proxyUrl = `${proxy}${encodedUrl}`;
      } else if (proxy.includes('corsproxy')) {
        proxyUrl = `${proxy}${url}`;
      } else {
        proxyUrl = `${proxy}${url}`;
      }
      
      console.log(`Trying proxy ${i + 1}/${PROXY_SERVICES.length}: ${proxy}`);
      
      const response = await fetchWithTimeout(proxyUrl, 10000); // 10 second timeout per proxy
      
      if (response.ok) {
        // Handle different response formats
        if (proxy.includes('allorigins')) {
          const data = await response.json();
          return data.contents;
        } else {
          return await response.text();
        }
      }
    } catch (error) {
      console.log(`Proxy ${i + 1} failed:`, error.message);
      if (i === PROXY_SERVICES.length - 1) {
        throw new Error('All proxy services failed');
      }
      continue;
    }
  }
  
  throw new Error('No proxy service available');
};

// Simplified extraction for better reliability
export const extractArticleFromUrl = async (url) => {
  try {
    console.log('Starting extraction for:', url);
    
    // Fetch the webpage content
    const htmlContent = await fetchThroughProxy(url);
    
    if (!htmlContent || htmlContent.length < 100) {
      throw new Error('No content received from URL');
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract title - simplified approach
    let title = '';
    const titleElement = doc.querySelector('title') || 
                        doc.querySelector('h1') || 
                        doc.querySelector('[property="og:title"]');
    
    if (titleElement) {
      title = titleElement.textContent || titleElement.getAttribute('content') || '';
      title = title.trim();
    }
    
    if (!title) {
      const domain = new URL(url).hostname.replace('www.', '');
      title = `Article from ${domain}`;
    }
    
    // Extract content - simplified approach
    let content = '';
    
    // Try common content selectors
    const contentSelectors = [
      'article',
      '[class*="content"]',
      '[class*="post"]',
      '[class*="article"]',
      'main',
      '.entry-content',
      '.post-content',
      '.article-content'
    ];
    
    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        // Remove unwanted elements
        const unwanted = element.querySelectorAll('script, style, nav, header, footer, aside, .ad, .advertisement');
        unwanted.forEach(el => el.remove());
        
        content = element.textContent || element.innerText || '';
        content = content.replace(/\s+/g, ' ').trim();
        
        if (content.length > 200) break;
      }
    }
    
    // Fallback: get all paragraphs
    if (!content || content.length < 200) {
      const paragraphs = Array.from(doc.querySelectorAll('p'))
        .map(p => p.textContent?.trim())
        .filter(text => text && text.length > 20)
        .join('\n\n');
      
      if (paragraphs.length > content.length) {
        content = paragraphs;
      }
    }
    
    // Final validation
    if (!content || content.length < 100) {
      content = `Content from this website could not be extracted automatically. 

This might be because:
- The website blocks automated access
- Content is loaded dynamically with JavaScript
- The website structure is not supported

Original URL: ${url}

Please visit the original URL to read the full article.`;
    }
    
    // Extract basic metadata
    const domain = new URL(url).hostname.replace('www.', '');
    const author = doc.querySelector('[rel="author"]')?.textContent?.trim() || 
                  doc.querySelector('[class*="author"]')?.textContent?.trim() || 
                  'Unknown Author';
    
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    const excerpt = content.length > 200 
      ? content.substring(0, 200).trim() + '...'
      : content;
    
    // Simple tag extraction based on domain
    const tags = [];
    const domainTags = {
      'medium.com': ['Medium', 'Article'],
      'dev.to': ['Development', 'Programming'],
      'github.com': ['GitHub', 'Code'],
      'wikipedia.org': ['Wikipedia', 'Reference'],
      'reddit.com': ['Reddit', 'Discussion'],
      'stackoverflow.com': ['Programming', 'Q&A']
    };
    
    if (domainTags[domain]) {
      tags.push(...domainTags[domain]);
    }
    
    console.log('Extraction successful:', { title, contentLength: content.length, domain });
    
    return {
      title: title.substring(0, 200),
      content,
      excerpt,
      author,
      domain,
      url,
      readTime,
      tags,
      dateAdded: new Date().toISOString(),
      publishDate: new Date().toISOString(),
      wordCount
    };
    
  } catch (error) {
    console.error('Article extraction failed:', error);
    
    // Return a meaningful fallback
    const domain = new URL(url).hostname.replace('www.', '');
    
    return {
      title: `Article from ${domain}`,
      content: `Dieser Artikel von ${domain} konnte nicht automatisch extrahiert werden.

Mögliche Gründe:
• Die Website blockiert automatisierte Zugriffe
• Der Inhalt wird dynamisch mit JavaScript geladen
• Die Website-Struktur wird nicht unterstützt
• Netzwerk-Zeitüberschreitung

Original-URL: ${url}

Tipp: Versuche es mit der Reader-Ansicht deines Browsers oder kopiere den Text manuell.`,
      excerpt: `Artikel von ${domain} - automatische Extraktion fehlgeschlagen`,
      author: 'Unknown Author',
      domain,
      url,
      readTime: 1,
      tags: ['Manual', 'Error'],
      dateAdded: new Date().toISOString(),
      publishDate: new Date().toISOString(),
      wordCount: 0
    };
  }
};

// Alternative method for specific sites
export const extractFromSpecificSite = async (url) => {
  return await extractArticleFromUrl(url);
};

// Quick accessibility test
export const testUrlAccessibility = async (url) => {
  try {
    // Just try to fetch the first few bytes quickly
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`https://corsproxy.io/?${url}`, {
      signal: controller.signal,
      method: 'HEAD' // Just check if accessible
    });
    
    clearTimeout(timeoutId);
    
    return {
      accessible: response.ok,
      status: response.status,
      message: response.ok ? 'URL is accessible' : 'URL may not be accessible'
    };
  } catch (error) {
    return {
      accessible: false,
      status: 'error',
      message: 'Could not test URL accessibility'
    };
  }
};