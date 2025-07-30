/**
 * Hybrid Controller
 * 
 * Combines the demo project's JSON-LD endpoints with our AI-optimized features.
 * Provides backward compatibility while adding advanced AI capabilities.
 */

import { ProductService } from '../services/product-service.js';
import { SearchService } from '../services/search-service.js';
import { TrustService } from '../services/trust-service.js';
import { ManufacturerService } from '../services/manufacturer-service.js';
import { CategoryService } from '../services/category-service.js';
import { DataIngestionService } from '../ingestion/data-ingestion-service.js';
import { JSONLDFormat } from '../formats/json-ld-format.js';
import { authMiddleware } from '../middleware/auth.js';
import { clientIsolationMiddleware } from '../middleware/client-isolation.js';
import { rateLimitMiddleware } from '../middleware/rate-limit.js';

export class HybridController {
  constructor() {
    this.productService = new ProductService();
    this.searchService = new SearchService();
    this.trustService = new TrustService();
    this.manufacturerService = new ManufacturerService();
    this.categoryService = new CategoryService();
    this.ingestionService = new DataIngestionService();
  }

  /**
   * Register all hybrid endpoints
   * @param {Object} app - Express application
   */
  registerRoutes(app) {
    // Demo project compatibility endpoints (with optional auth)
    this.registerDemoCompatibilityRoutes(app);
    
    // AI-optimized endpoints (with full auth)
    this.registerAIOptimizedRoutes(app);
    
    // Data ingestion endpoints (admin only)
    this.registerIngestionRoutes(app);
  }

  /**
   * Register demo project compatibility routes
   */
  registerDemoCompatibilityRoutes(app) {
    // LLM discovery file (demo project compatibility)
    app.get('/.well-known/llms.txt', (req, res) => {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const discoveryContent = JSONLDFormat.createLLMDiscoveryFile(baseUrl);
      res.set('Content-Type', 'text/plain');
      res.send(discoveryContent);
    });

    // Products JSON-LD endpoint (demo project compatibility)
    app.get('/products.json', async (req, res) => {
      try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const products = await this.productService.getAllProducts();
        const jsonLdGraph = JSONLDFormat.formatProductGraph(products, baseUrl);
        res.json(jsonLdGraph);
      } catch (error) {
        console.error('Error serving products.json:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Single product by SKU (demo project compatibility)
    app.get('/product/:sku', async (req, res) => {
      try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const product = await this.productService.getProductBySku(req.params.sku);
        
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
        
        const jsonLdProduct = JSONLDFormat.formatProduct(product, baseUrl);
        res.json({
          "@context": "https://schema.org",
          ...jsonLdProduct
        });
      } catch (error) {
        console.error('Error serving product:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Root endpoint with API documentation
    app.get('/', (req, res) => {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      res.json({
        message: 'AI-Optimized Subdomain API',
        description: 'Hybrid API combining JSON-LD compatibility with AI optimization',
        endpoints: {
          // Demo project compatibility
          'products.json': 'All products in JSON-LD format',
          'product/:sku': 'Single product by SKU in JSON-LD format',
          '.well-known/llms.txt': 'LLM discovery file',
          
          // AI-optimized endpoints (require auth)
          '/api/products': 'AI-optimized products with authentication',
          '/api/search': 'Semantic search with vector similarity',
          '/api/vectors': 'Vector embeddings for AI models',
          '/api/mcp': 'Model Context Protocol endpoints',
          '/api/acp': 'AI Context Protocol endpoints',
          '/api/graph': 'Knowledge graph queries',
          
          // Data ingestion (admin only)
          '/api/ingest/shopify': 'Ingest Shopify data (admin only)',
          '/api/ingest/woocommerce': 'Ingest WooCommerce data (admin only)'
        },
        formats: ['json-ld', 'vector', 'mcp', 'acp', 'graph'],
        authentication: 'Optional for JSON-LD, Required for AI endpoints',
        rateLimit: '100 requests per minute'
      });
    });
  }

  /**
   * Register AI-optimized routes with full authentication
   */
  registerAIOptimizedRoutes(app) {
    // Products API with AI optimization
    app.get('/api/products', 
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { format = 'json', limit = 50, offset = 0 } = req.query;
          const products = await this.productService.getProducts(req.clientId, { limit, offset });
          
          const response = this.productService.formatProductResponse(products, format);
          res.json(response);
        } catch (error) {
          console.error('Error serving AI products:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'PRODUCTS_ERROR',
              message: 'Error retrieving products',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // Search API with semantic search
    app.post('/api/search',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { query, format = 'json', filters = {} } = req.body;
          const results = await this.searchService.search(query, req.clientId, { format, filters });
          res.json(results);
        } catch (error) {
          console.error('Error serving search:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'SEARCH_ERROR',
              message: 'Error performing search',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // Vector similarity search
    app.post('/api/vectors',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { vector, limit = 10, threshold = 0.7 } = req.body;
          const results = await this.searchService.vectorSimilarity(vector, req.clientId, { limit, threshold });
          res.json(results);
        } catch (error) {
          console.error('Error serving vector search:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'VECTOR_ERROR',
              message: 'Error performing vector search',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // MCP (Model Context Protocol) endpoints
    app.post('/api/mcp',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { context, query, model } = req.body;
          const results = await this.searchService.mcpSearch(context, query, req.clientId, { model });
          res.json(results);
        } catch (error) {
          console.error('Error serving MCP:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'MCP_ERROR',
              message: 'Error processing MCP request',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // ACP (AI Context Protocol) endpoints
    app.post('/api/acp',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { agentId, task, context } = req.body;
          const results = await this.searchService.acpSearch(agentId, task, context, req.clientId);
          res.json(results);
        } catch (error) {
          console.error('Error serving ACP:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'ACP_ERROR',
              message: 'Error processing ACP request',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // Graph queries
    app.post('/api/graph',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { query, traversal } = req.body;
          const results = await this.searchService.graphQuery(query, req.clientId, { traversal });
          res.json(results);
        } catch (error) {
          console.error('Error serving graph query:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'GRAPH_ERROR',
              message: 'Error processing graph query',
              requestId: req.requestId
            }
          });
        }
      }
    );
  }

  /**
   * Register data ingestion routes (admin only)
   */
  registerIngestionRoutes(app) {
    // Ingest Shopify data
    app.post('/api/ingest/shopify',
      authMiddleware,
      async (req, res) => {
        try {
          const { products, clientId } = req.body;
          
          if (!products || !Array.isArray(products)) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'INVALID_DATA',
                message: 'Products array is required'
              }
            });
          }

          const results = await this.ingestionService.ingestShopifyData(products, clientId);
          
          res.json({
            success: true,
            message: 'Data ingestion completed',
            results: results
          });
        } catch (error) {
          console.error('Error ingesting Shopify data:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INGESTION_ERROR',
              message: 'Error ingesting data',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // Ingest WooCommerce data
    app.post('/api/ingest/woocommerce',
      authMiddleware,
      async (req, res) => {
        try {
          const { products, clientId } = req.body;
          
          if (!products || !Array.isArray(products)) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'INVALID_DATA',
                message: 'Products array is required'
              }
            });
          }

          const results = await this.ingestionService.ingestWooCommerceData(products, clientId);
          
          res.json({
            success: true,
            message: 'Data ingestion completed',
            results: results
          });
        } catch (error) {
          console.error('Error ingesting WooCommerce data:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INGESTION_ERROR',
              message: 'Error ingesting data',
              requestId: req.requestId
            }
          });
        }
      }
    );
  }
} 