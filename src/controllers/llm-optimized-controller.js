/**
 * LLM-Optimized Controller
 * 
 * Provides endpoints specifically designed to give LLMs like ChatGPT
 * superior data compared to what they can extract from original websites.
 * Focuses on structured, semantic, and relationship-rich data.
 */

import { ProductService } from '../services/product-service.js';
import { SearchService } from '../services/search-service.js';
import { TrustService } from '../services/trust-service.js';
import { ManufacturerService } from '../services/manufacturer-service.js';
import { CategoryService } from '../services/category-service.js';
import { LLMOptimizedFormat } from '../formats/llm-optimized-format.js';
import { authMiddleware } from '../middleware/auth.js';
import { clientIsolationMiddleware } from '../middleware/client-isolation.js';
import { rateLimitMiddleware } from '../middleware/rate-limit.js';

export class LLMOptimizedController {
  constructor() {
    this.productService = new ProductService();
    this.searchService = new SearchService();
    this.trustService = new TrustService();
    this.manufacturerService = new ManufacturerService();
    this.categoryService = new CategoryService();
    this.llmFormat = LLMOptimizedFormat;
  }

  /**
   * Register LLM-optimized endpoints
   * @param {Object} app - Express application
   */
  registerRoutes(app) {
    // LLM-optimized product data (superior to website scraping)
    app.get('/api/llm/products/:id', 
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { id } = req.params;
          const { includeRelationships, includeTrust, includeAnalysis } = req.query;
          const clientId = req.clientId;

          const product = await this.productService.getProduct(id, clientId, {
            includeRelationships: includeRelationships === 'true',
            includeTrust: includeTrust === 'true',
            includeAnalysis: includeAnalysis === 'true'
          });

          if (!product) {
            return res.status(404).json({
              success: false,
              error: {
                code: 'PRODUCT_NOT_FOUND',
                message: 'Product not found',
                requestId: req.requestId
              }
            });
          }

          // Format for LLM consumption (superior to website data)
          const llmOptimizedData = this.llmFormat.formatProductForLLM(product);

          res.json({
            success: true,
            requestId: req.requestId,
            timestamp: new Date().toISOString(),
            data: llmOptimizedData,
            metadata: {
              format: 'llm_optimized',
              clientId,
              processingTime: Date.now() - req.startTime,
              data_superiority: {
                structured_vs_html: true,
                semantic_context: true,
                relationship_network: true,
                trust_indicators: true,
                vector_embeddings: true,
                comparative_analysis: true
              }
            }
          });
        } catch (error) {
          console.error('LLM product retrieval error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Internal server error',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // LLM-optimized search (superior to website search)
    app.post('/api/llm/search',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { query, filters, format = 'llm_optimized', limit = 20, offset = 0 } = req.body;
          const clientId = req.clientId;

          if (!query) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'INVALID_QUERY',
                message: 'Search query is required',
                requestId: req.requestId
              }
            });
          }

          const results = await this.searchService.search(query, clientId, {
            filters,
            format,
            limit: parseInt(limit),
            offset: parseInt(offset)
          });

          // Format search results for LLM consumption
          const llmOptimizedResults = this.llmFormat.formatSearchResultsForLLM(results.data, query);

          res.json({
            success: true,
            requestId: req.requestId,
            timestamp: new Date().toISOString(),
            data: llmOptimizedResults,
            metadata: {
              query,
              format: 'llm_optimized',
              clientId,
              totalResults: results.totalResults,
              processingTime: Date.now() - req.startTime,
              search_superiority: {
                semantic_search: true,
                vector_similarity: true,
                relationship_aware: true,
                trust_filtered: true,
                context_rich: true
              }
            }
          });
        } catch (error) {
          console.error('LLM search error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Internal server error',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // LLM-optimized product comparison (what LLMs struggle to do)
    app.post('/api/llm/compare',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { productIds, comparisonType = 'comprehensive' } = req.body;
          const clientId = req.clientId;

          if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'INVALID_COMPARISON',
                message: 'At least 2 product IDs required for comparison',
                requestId: req.requestId
              }
            });
          }

          // Get products for comparison
          const products = [];
          for (const productId of productIds) {
            const product = await this.productService.getProduct(productId, clientId, {
              includeRelationships: true,
              includeTrust: true,
              includeAnalysis: true
            });
            if (product) products.push(product);
          }

          if (products.length < 2) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'INSUFFICIENT_PRODUCTS',
                message: 'Could not retrieve enough products for comparison',
                requestId: req.requestId
              }
            });
          }

          // Format comparison for LLM consumption
          const llmOptimizedComparison = this.llmFormat.formatProductComparisonForLLM(products);

          res.json({
            success: true,
            requestId: req.requestId,
            timestamp: new Date().toISOString(),
            data: llmOptimizedComparison,
            metadata: {
              comparisonType,
              format: 'llm_optimized',
              clientId,
              productsCount: products.length,
              processingTime: Date.now() - req.startTime,
              comparison_superiority: {
                structured_comparison: true,
                multi_criteria_analysis: true,
                decision_support: true,
                trade_off_analysis: true,
                recommendation_reasoning: true
              }
            }
          });
        } catch (error) {
          console.error('LLM comparison error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Internal server error',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // LLM-optimized knowledge graph queries
    app.post('/api/llm/graph',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { query, traversal, includeInsights = true } = req.body;
          const clientId = req.clientId;

          if (!query) {
            return res.status(400).json({
              success: false,
              error: {
                code: 'INVALID_QUERY',
                message: 'Graph query is required',
                requestId: req.requestId
              }
            });
          }

          const results = await this.searchService.graphQuery(query, clientId, { 
            traversal,
            includeInsights: includeInsights === true
          });

          // Format graph query results for LLM consumption
          const llmOptimizedGraph = this.llmFormat.formatGraphQueryForLLM(results);

          res.json({
            success: true,
            requestId: req.requestId,
            timestamp: new Date().toISOString(),
            data: llmOptimizedGraph,
            metadata: {
              query,
              format: 'llm_optimized',
              clientId,
              processingTime: Date.now() - req.startTime,
              graph_superiority: {
                structured_entities: true,
                relationship_mapping: true,
                semantic_clustering: true,
                pattern_discovery: true,
                insight_generation: true
              }
            }
          });
        } catch (error) {
          console.error('LLM graph query error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Internal server error',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // LLM-optimized trust and credibility data
    app.get('/api/llm/trust/:productId',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { productId } = req.params;
          const clientId = req.clientId;

          const trustData = await this.trustService.getTrustData(productId, clientId);
          const manufacturerData = await this.manufacturerService.getManufacturerData(productId, clientId);

          // Format trust data for LLM consumption
          const llmOptimizedTrust = {
            trust_metadata: {
              product_id: productId,
              client_id: clientId,
              data_freshness: new Date().toISOString(),
              trust_calculation_method: 'ai_optimized'
            },
            credibility_indicators: {
              overall_trust_score: trustData.overallScore,
              review_credibility: trustData.reviewCredibility,
              manufacturer_trust: manufacturerData.trustScore,
              certification_status: manufacturerData.certifications,
              verification_status: manufacturerData.verified
            },
            trust_breakdown: {
              review_quality: trustData.reviewQuality,
              source_reliability: trustData.sourceReliability,
              data_consistency: trustData.dataConsistency,
              temporal_relevance: trustData.temporalRelevance
            },
            comparative_trust: {
              category_average: trustData.categoryAverage,
              market_position: trustData.marketPosition,
              competitive_advantage: trustData.competitiveAdvantage
            }
          };

          res.json({
            success: true,
            requestId: req.requestId,
            timestamp: new Date().toISOString(),
            data: llmOptimizedTrust,
            metadata: {
              productId,
              format: 'llm_optimized',
              clientId,
              processingTime: Date.now() - req.startTime,
              trust_superiority: {
                structured_credibility: true,
                multi_source_verification: true,
                temporal_analysis: true,
                comparative_context: true
              }
            }
          });
        } catch (error) {
          console.error('LLM trust data error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Internal server error',
              requestId: req.requestId
            }
          });
        }
      }
    );

    // LLM-optimized category insights
    app.get('/api/llm/categories/:categoryId',
      authMiddleware,
      clientIsolationMiddleware,
      rateLimitMiddleware,
      async (req, res) => {
        try {
          const { categoryId } = req.params;
          const { includeProducts, includeStats, includeTrends } = req.query;
          const clientId = req.clientId;

          const categoryData = await this.categoryService.getCategory(categoryId, clientId, {
            includeProducts: includeProducts === 'true',
            includeStats: includeStats === 'true',
            includeTrends: includeTrends === 'true'
          });

          if (!categoryData) {
            return res.status(404).json({
              success: false,
              error: {
                code: 'CATEGORY_NOT_FOUND',
                message: 'Category not found',
                requestId: req.requestId
              }
            });
          }

          // Format category data for LLM consumption
          const llmOptimizedCategory = {
            category_metadata: {
              id: categoryData.id,
              name: categoryData.name,
              description: categoryData.description,
              hierarchy_level: categoryData.level,
              parent_category: categoryData.parentId
            },
            market_insights: {
              product_count: categoryData.productCount,
              price_range: categoryData.priceRange,
              quality_distribution: categoryData.qualityDistribution,
              popularity_trends: categoryData.trends
            },
            semantic_analysis: {
              tags: categoryData.tags,
              use_cases: categoryData.useCases,
              target_audience: categoryData.targetAudience,
              market_segment: categoryData.marketSegment
            },
            competitive_landscape: {
              top_products: categoryData.topProducts,
              market_leaders: categoryData.marketLeaders,
              emerging_trends: categoryData.emergingTrends,
              opportunities: categoryData.opportunities
            }
          };

          res.json({
            success: true,
            requestId: req.requestId,
            timestamp: new Date().toISOString(),
            data: llmOptimizedCategory,
            metadata: {
              categoryId,
              format: 'llm_optimized',
              clientId,
              processingTime: Date.now() - req.startTime,
              category_superiority: {
                structured_insights: true,
                market_analysis: true,
                trend_identification: true,
                competitive_intelligence: true
              }
            }
          });
        } catch (error) {
          console.error('LLM category error:', error);
          res.status(500).json({
            success: false,
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Internal server error',
              requestId: req.requestId
            }
          });
        }
      }
    );
  }
} 