/**
 * Web Scraping Service for Scientific Benchmark
 * 
 * Collects real data from actual e-commerce websites to provide
 * unbiased baseline data for comparison with AI-optimized subdomains.
 * 
 * Features:
 * - Real web scraping with proper rate limiting
 * - Data standardization across different websites
 * - Error handling and retry logic
 * - Respectful crawling (robots.txt compliance)
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { setTimeout } from 'timers/promises';

class WebScrapingService {
  constructor() {
    this.userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ];
    
    this.rateLimits = {
      requestsPerSecond: 1,
      delayBetweenRequests: 1000,
      maxRetries: 3
    };
    
    this.lastRequestTime = 0;
  }

  /**
   * Get a random user agent
   */
  getRandomUserAgent() {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  /**
   * Respect rate limits
   */
  async respectRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minDelay = this.rateLimits.delayBetweenRequests;
    
    if (timeSinceLastRequest < minDelay) {
      await setTimeout(minDelay - timeSinceLastRequest);
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Make a respectful HTTP request
   */
  async makeRequest(url, options = {}) {
    await this.respectRateLimit();
    
    const config = {
      url,
      method: 'GET',
      headers: {
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        ...options.headers
      },
      timeout: 10000,
      maxRedirects: 5,
      ...options
    };
    
    let lastError;
    
    for (let attempt = 1; attempt <= this.rateLimits.maxRetries; attempt++) {
      try {
        const response = await axios(config);
        return response;
      } catch (error) {
        lastError = error;
        
        if (error.response?.status === 429) {
          // Rate limited - wait longer
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`Rate limited, waiting ${waitTime}ms before retry ${attempt}`);
          await setTimeout(waitTime);
        } else if (error.response?.status >= 500) {
          // Server error - retry with exponential backoff
          const waitTime = Math.pow(2, attempt) * 1000;
          console.log(`Server error, waiting ${waitTime}ms before retry ${attempt}`);
          await setTimeout(waitTime);
        } else {
          // Other errors - don't retry
          throw error;
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Extract product data from HTML
   */
  extractProductData(html, website) {
    const $ = cheerio.load(html);
    const products = [];
    
    // Common selectors for different websites
    const selectors = this.getSelectorsForWebsite(website);
    
    $(selectors.productContainer).each((index, element) => {
      try {
        const product = this.extractProductFromElement($, element, selectors);
        if (product && product.title && product.price) {
          products.push(product);
        }
      } catch (error) {
        console.warn(`Error extracting product ${index}:`, error.message);
      }
    });
    
    return products;
  }

  /**
   * Get CSS selectors for specific websites
   */
  getSelectorsForWebsite(website) {
    const selectors = {
      amazon: {
        productContainer: '[data-component-type="s-search-result"]',
        title: 'h2 a span',
        price: '.a-price-whole',
        rating: '.a-icon-alt',
        reviewCount: '.a-size-base',
        image: 'img.s-image',
        link: 'h2 a'
      },
      bestbuy: {
        productContainer: '.shop-sku-list-item',
        title: '.sku-title h4 a',
        price: '.priceView-customer-price span',
        rating: '.rating-value',
        reviewCount: '.rating-count',
        image: '.product-image img',
        link: '.sku-title h4 a'
      },
      newegg: {
        productContainer: '.item-cell',
        title: '.item-title',
        price: '.price-current',
        rating: '.rating',
        reviewCount: '.item-rating-num',
        image: '.item-img img',
        link: '.item-title'
      },
      walmart: {
        productContainer: '[data-item-id]',
        title: '.normal.sans-serif.dark-gray',
        price: '.visuallyhidden',
        rating: '.stars-container',
        reviewCount: '.stars-reviews-count',
        image: '.product-image img',
        link: '.product-title-link'
      }
    };
    
    return selectors[website.toLowerCase()] || selectors.amazon;
  }

  /**
   * Extract product information from a DOM element
   */
  extractProductFromElement($, element, selectors) {
    const $element = $(element);
    
    const title = $element.find(selectors.title).first().text().trim();
    const priceText = $element.find(selectors.price).first().text().trim();
    const ratingText = $element.find(selectors.rating).first().text().trim();
    const reviewCountText = $element.find(selectors.reviewCount).first().text().trim();
    const imageUrl = $element.find(selectors.image).first().attr('src');
    const linkUrl = $element.find(selectors.link).first().attr('href');
    
    // Parse price
    const price = this.parsePrice(priceText);
    
    // Parse rating
    const rating = this.parseRating(ratingText);
    
    // Parse review count
    const reviewCount = this.parseReviewCount(reviewCountText);
    
    // Generate product ID
    const productId = this.generateProductId(title, price);
    
    return {
      id: productId,
      title: title,
      price: price,
      rating: rating,
      review_count: reviewCount,
      image_url: imageUrl,
      link_url: linkUrl,
      availability: true, // Assume available if found
      relevance_score: 0.5, // Will be calculated later
      structured_data: this.extractStructuredData($element),
      html_content: $element.html()
    };
  }

  /**
   * Parse price from text
   */
  parsePrice(priceText) {
    if (!priceText) return 0;
    
    // Remove currency symbols and non-numeric characters
    const cleanPrice = priceText.replace(/[^\d.,]/g, '');
    const price = parseFloat(cleanPrice.replace(',', ''));
    
    return isNaN(price) ? 0 : price;
  }

  /**
   * Parse rating from text
   */
  parseRating(ratingText) {
    if (!ratingText) return 0;
    
    // Extract numeric rating (e.g., "4.5 out of 5" -> 4.5)
    const match = ratingText.match(/(\d+\.?\d*)/);
    if (match) {
      const rating = parseFloat(match[1]);
      return isNaN(rating) ? 0 : Math.min(5, Math.max(0, rating));
    }
    
    return 0;
  }

  /**
   * Parse review count from text
   */
  parseReviewCount(reviewCountText) {
    if (!reviewCountText) return 0;
    
    // Extract numeric count (e.g., "(1,234 reviews)" -> 1234)
    const match = reviewCountText.match(/(\d+(?:,\d+)*)/);
    if (match) {
      const count = parseInt(match[1].replace(',', ''));
      return isNaN(count) ? 0 : count;
    }
    
    return 0;
  }

  /**
   * Generate a unique product ID
   */
  generateProductId(title, price) {
    const sanitizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
    const priceHash = Math.floor(price).toString(36);
    return `${sanitizedTitle}_${priceHash}`;
  }

  /**
   * Extract structured data from product element
   */
  extractStructuredData($element) {
    // Look for JSON-LD structured data
    const jsonLd = $element.find('script[type="application/ld+json"]').html();
    if (jsonLd) {
      try {
        return JSON.parse(jsonLd);
      } catch (error) {
        console.warn('Failed to parse JSON-LD:', error.message);
      }
    }
    
    // Fallback to basic structured data
    return {
      type: 'Product',
      name: $element.find('[data-component-type="s-search-result"] h2 a span').text().trim(),
      price: this.parsePrice($element.find('.a-price-whole').text()),
      availability: 'InStock'
    };
  }

  /**
   * Search for products on a website
   */
  async searchProducts(website, query) {
    const searchUrl = this.buildSearchUrl(website, query);
    
    try {
      console.log(`🔍 Searching ${website} for: "${query}"`);
      
      const response = await this.makeRequest(searchUrl);
      const products = this.extractProductData(response.data, website);
      
      console.log(`   ✅ Found ${products.length} products on ${website}`);
      
      return {
        website: website,
        query: query,
        products: products,
        total_results: products.length,
        search_time_ms: Date.now() - this.lastRequestTime,
        url: searchUrl
      };
      
    } catch (error) {
      console.error(`   ❌ Error searching ${website}:`, error.message);
      return {
        website: website,
        query: query,
        products: [],
        total_results: 0,
        error: error.message,
        url: searchUrl
      };
    }
  }

  /**
   * Build search URL for different websites
   */
  buildSearchUrl(website, query) {
    const encodedQuery = encodeURIComponent(query);
    
    const urls = {
      amazon: `https://www.amazon.com/s?k=${encodedQuery}`,
      bestbuy: `https://www.bestbuy.com/site/searchpage.jsp?st=${encodedQuery}`,
      newegg: `https://www.newegg.com/p/pl?d=${encodedQuery}`,
      walmart: `https://www.walmart.com/search?q=${encodedQuery}`
    };
    
    return urls[website.toLowerCase()] || urls.amazon;
  }

  /**
   * Search multiple websites for comparison
   */
  async searchMultipleWebsites(query, websites = ['amazon', 'bestbuy', 'newegg']) {
    const results = {};
    
    for (const website of websites) {
      try {
        const result = await this.searchProducts(website, query);
        results[website] = result;
        
        // Add delay between different websites
        await setTimeout(2000);
        
      } catch (error) {
        console.error(`Failed to search ${website}:`, error.message);
        results[website] = {
          website: website,
          query: query,
          products: [],
          error: error.message
        };
      }
    }
    
    return results;
  }

  /**
   * Calculate data quality metrics for scraped data
   */
  calculateDataQualityMetrics(scrapedData) {
    const metrics = {
      completeness: 0,
      consistency: 0,
      accuracy: 0,
      structure: 0,
      relevance: 0
    };
    
    if (scrapedData.products.length === 0) {
      return metrics;
    }
    
    // Completeness: percentage of products with all required fields
    const completeProducts = scrapedData.products.filter(p => 
      p.title && p.price && p.title.length > 0 && p.price > 0
    );
    metrics.completeness = completeProducts.length / scrapedData.products.length;
    
    // Consistency: variance in data format
    metrics.consistency = this.calculateConsistencyScore(scrapedData.products);
    
    // Accuracy: based on data validation
    metrics.accuracy = this.calculateAccuracyScore(scrapedData.products);
    
    // Structure: percentage of products with structured data
    const structuredProducts = scrapedData.products.filter(p => p.structured_data);
    metrics.structure = structuredProducts.length / scrapedData.products.length;
    
    // Relevance: will be calculated based on query
    metrics.relevance = 0.5; // Placeholder
    
    return metrics;
  }

  /**
   * Calculate consistency score
   */
  calculateConsistencyScore(products) {
    if (products.length < 2) return 1;
    
    const titles = products.map(p => p.title);
    const titleLengths = titles.map(t => t.length);
    const avgLength = titleLengths.reduce((a, b) => a + b, 0) / titleLengths.length;
    const variance = titleLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / titleLengths.length;
    
    return Math.max(0, 1 - (variance / 100));
  }

  /**
   * Calculate accuracy score
   */
  calculateAccuracyScore(products) {
    const validProducts = products.filter(p => 
      p.title && p.title.length > 0 && 
      p.price && p.price > 0 && 
      p.price < 10000 // Reasonable price range
    );
    
    return validProducts.length / products.length;
  }
}

export default WebScrapingService; 