/**
 * Data Ingestion Service
 * 
 * Handles data ingestion from various e-commerce platforms (Shopify, WooCommerce, etc.)
 * and transforms raw data into our knowledge graph format.
 */

import { ProductService } from '../services/product-service.js';
import { TrustService } from '../services/trust-service.js';
import { ManufacturerService } from '../services/manufacturer-service.js';
import { CategoryService } from '../services/category-service.js';

export class DataIngestionService {
  constructor() {
    this.productService = new ProductService();
    this.trustService = new TrustService();
    this.manufacturerService = new ManufacturerService();
    this.categoryService = new CategoryService();
  }

  /**
   * Ingest Shopify product data
   * @param {Array} shopifyProducts - Raw Shopify product data
   * @param {string} clientId - Client identifier
   * @returns {Object} Processing results
   */
  async ingestShopifyData(shopifyProducts, clientId) {
    const results = {
      products: 0,
      manufacturers: 0,
      categories: 0,
      trustData: 0,
      errors: []
    };

    try {
      for (const shopifyProduct of shopifyProducts) {
        // Transform Shopify product to our knowledge graph format
        const transformedProduct = this.transformShopifyProduct(shopifyProduct, clientId);
        
        // Store in our system
        await this.productService.createProduct(transformedProduct);
        results.products++;

        // Extract and store manufacturer data
        if (shopifyProduct.vendor) {
          const manufacturer = this.extractManufacturerData(shopifyProduct.vendor, clientId);
          await this.manufacturerService.createManufacturer(manufacturer);
          results.manufacturers++;
        }

        // Extract and store category data
        if (shopifyProduct.product_type) {
          const category = this.extractCategoryData(shopifyProduct.product_type, clientId);
          await this.categoryService.createCategory(category);
          results.categories++;
        }

        // Generate mock trust data (in real implementation, this would come from external sources)
        const trustData = this.generateTrustData(transformedProduct.id, clientId);
        await this.trustService.createTrustData(trustData);
        results.trustData++;
      }
    } catch (error) {
      results.errors.push(error.message);
    }

    return results;
  }

  /**
   * Transform Shopify product to our knowledge graph format
   */
  transformShopifyProduct(shopifyProduct, clientId) {
    // Helper function to strip HTML tags
    const stripHtml = (html) => {
      if (!html) return '';
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    };

    // Helper function to create offers from variants
    const createOffers = (variants) => {
      if (!variants || variants.length === 0) return [];
      
      return variants.map(variant => ({
        sku: variant.sku,
        price: parseFloat(variant.price),
        currency: 'USD',
        availability: variant.inventory_quantity > 0,
        condition: 'new',
        weight: variant.weight,
        weightUnit: variant.weight_unit,
        inventoryQuantity: variant.inventory_quantity
      }));
    };

    // Helper function to extract images
    const extractImages = (images) => {
      if (!images || images.length === 0) return [];
      return images.map(img => img.src);
    };

    // Helper function to create URL-friendly slug
    const createSlug = (title) => {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };

    const mainSku = shopifyProduct.variants && shopifyProduct.variants.length > 0 ? 
      shopifyProduct.variants[0].sku : 
      `${shopifyProduct.id}-MAIN`;

    const productSlug = shopifyProduct.handle || createSlug(shopifyProduct.title);

    return {
      id: `${clientId}-${mainSku}`,
      clientId: clientId,
      name: shopifyProduct.title,
      description: stripHtml(shopifyProduct.body_html),
      category: shopifyProduct.product_type || 'general',
      price: shopifyProduct.variants && shopifyProduct.variants.length > 0 ? 
        parseFloat(shopifyProduct.variants[0].price) : 0,
      currency: 'USD',
      availability: shopifyProduct.status === 'active',
      manufacturer: shopifyProduct.vendor,
      model: mainSku,
      specifications: {
        weight: shopifyProduct.variants && shopifyProduct.variants.length > 0 ? 
          shopifyProduct.variants[0].weight : null,
        weightUnit: shopifyProduct.variants && shopifyProduct.variants.length > 0 ? 
          shopifyProduct.variants[0].weight_unit : null,
        barcode: shopifyProduct.variants && shopifyProduct.variants.length > 0 ? 
          shopifyProduct.variants[0].barcode : null,
        requiresShipping: shopifyProduct.variants && shopifyProduct.variants.length > 0 ? 
          shopifyProduct.variants[0].requires_shipping : true
      },
      images: extractImages(shopifyProduct.images),
      tags: shopifyProduct.tags ? shopifyProduct.tags.split(',').map(tag => tag.trim()) : [],
      offers: createOffers(shopifyProduct.variants),
      slug: productSlug,
      trustScore: 0.85, // Default trust score
      createdAt: new Date(shopifyProduct.created_at),
      updatedAt: new Date(shopifyProduct.updated_at),
      metadata: {
        shopifyId: shopifyProduct.id,
        shopifyHandle: shopifyProduct.handle,
        adminGraphqlApiId: shopifyProduct.admin_graphql_api_id,
        publishedAt: shopifyProduct.published_at,
        templateSuffix: shopifyProduct.template_suffix,
        publishedScope: shopifyProduct.published_scope
      }
    };
  }

  /**
   * Extract manufacturer data from vendor information
   */
  extractManufacturerData(vendor, clientId) {
    return {
      id: `${clientId}-manufacturer-${vendor.toLowerCase().replace(/\s+/g, '-')}`,
      name: vendor,
      officialUrl: null,
      certifications: [],
      verified: false,
      trustScore: 0.8, // Default manufacturer trust score
      metadata: {
        source: 'shopify_vendor',
        clientId: clientId
      }
    };
  }

  /**
   * Extract category data from product type
   */
  extractCategoryData(productType, clientId) {
    return {
      id: `${clientId}-category-${productType.toLowerCase().replace(/\s+/g, '-')}`,
      clientId: clientId,
      name: productType,
      parentId: null,
      level: 1,
      description: `${productType} products`,
      tags: [productType.toLowerCase()],
      metadata: {
        source: 'shopify_product_type',
        clientId: clientId
      }
    };
  }

  /**
   * Generate mock trust data for a product
   */
  generateTrustData(productId, clientId) {
    return {
      id: `${productId}-trust-${Date.now()}`,
      productId: productId,
      clientId: clientId,
      type: 'review',
      source: 'generated',
      value: 'Great product with excellent quality',
      credibility: 0.85,
      date: new Date(),
      verified: false,
      metadata: {
        source: 'mock_data',
        clientId: clientId
      }
    };
  }

  /**
   * Ingest data from other e-commerce platforms
   */
  async ingestWooCommerceData(wooCommerceProducts, clientId) {
    // Similar implementation for WooCommerce
    // This would transform WooCommerce product format to our knowledge graph
  }

  async ingestMagentoData(magentoProducts, clientId) {
    // Similar implementation for Magento
    // This would transform Magento product format to our knowledge graph
  }
} 