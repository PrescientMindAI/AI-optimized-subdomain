/**
 * Enhanced AI Controller
 * 
 * Integrates RefKG, I40KG, and DPP standards to provide superior data
 * for LLMs compared to regular e-commerce websites. This controller
 * implements the generative engine optimization (GEO) approach.
 */

import express from 'express';
import { RefKGEnhancedSearchService } from '../services/refkg-enhanced-search-service.js';
import { I40KGQualityService } from '../services/i40kg-quality-service.js';
import { DPPIdentityService } from '../services/dpp-identity-service.js';
import { ProductService } from '../services/product-service.js';
import { SearchService } from '../services/search-service.js';
import { TrustService } from '../services/trust-service.js';
import { ManufacturerService } from '../services/manufacturer-service.js';

export class EnhancedAIController {
  constructor() {
    this.router = express.Router();
    
    // Initialize enhanced services
    this.refkgService = new RefKGEnhancedSearchService();
    this.i40kgService = new I40KGQualityService();
    this.dppService = new DPPIdentityService();
    
    // Initialize base services
    this.productService = new ProductService();
    this.searchService = new SearchService();
    this.trustService = new TrustService();
    this.manufacturerService = new ManufacturerService();
    
    this.setupRoutes();
  }

  setupRoutes() {
    // Enhanced search endpoints
    this.router.post('/search/enhanced', this.enhancedSearch.bind(this));
    this.router.post('/search/refkg', this.refkgSearch.bind(this));
    this.router.post('/search/decompose', this.decomposeQuery.bind(this));
    
    // Product enhancement endpoints
    this.router.get('/products/:id/enhanced', this.getEnhancedProduct.bind(this));
    this.router.get('/products/:id/quality', this.getProductQuality.bind(this));
    this.router.get('/products/:id/dpp', this.getProductDPP.bind(this));
    this.router.get('/products/:id/authenticity', this.verifyProductAuthenticity.bind(this));
    
    // Trust and compliance endpoints
    this.router.get('/trust/:productId/enhanced', this.getEnhancedTrust.bind(this));
    this.router.get('/compliance/:productId', this.getProductCompliance.bind(this));
    
    // LLM-optimized endpoints
    this.router.post('/llm/search', this.llmOptimizedSearch.bind(this));
    this.router.get('/llm/product/:id', this.getLLMOptimizedProduct.bind(this));
    this.router.post('/llm/recommendations', this.getLLMRecommendations.bind(this));
    
    // Demo endpoints (no authentication required)
    this.router.get('/demo/health', this.demoHealth.bind(this));
    this.router.post('/demo/search', this.demoSearch.bind(this));
  }

  /**
   * Enhanced search combining all three standards
   */
  async enhancedSearch(req, res) {
    try {
      const { query, clientId, options = {} } = req.body;
      
      if (!query || !clientId) {
        return res.status(400).json({
          success: false,
          error: 'Query and clientId are required'
        });
      }

      // Step 1: RefKG Query Decomposition
      const decomposedQueries = await this.refkgService.decomposeQuery(query, clientId);
      
      // Step 2: RefKG Evidence Exploration
      const evidenceSubgraphs = await this.refkgService.exploreSubgraphs(decomposedQueries, clientId, options);
      
      // Step 3: RefKG Knowledge Reconstruction
      const reconstructedKnowledge = await this.refkgService.reconstructKnowledge(evidenceSubgraphs, query, clientId);
      
      // Step 4: Enhance with I40KG quality data
      const enhancedResults = await this.enhanceWithI40KG(reconstructedKnowledge, clientId);
      
      // Step 5: Enhance with DPP authenticity data
      const finalResults = await this.enhanceWithDPP(enhancedResults, clientId);
      
      res.json({
        success: true,
        data: {
          original_query: query,
          decomposed_queries: decomposedQueries,
          evidence_subgraphs: evidenceSubgraphs,
          reconstructed_knowledge: reconstructedKnowledge,
          enhanced_results: finalResults,
          processing_metadata: {
            standards_used: ['RefKG', 'I40KG', 'DPP'],
            processing_time: Date.now() - req.startTime,
            quality_score: this.calculateOverallQualityScore(finalResults)
          }
        }
      });
      
    } catch (error) {
      console.error('Enhanced search error:', error);
      res.status(500).json({
        success: false,
        error: 'Enhanced search failed'
      });
    }
  }

  /**
   * RefKG-specific search
   */
  async refkgSearch(req, res) {
    try {
      const { query, clientId, options = {} } = req.body;
      
      const results = await this.refkgService.refkgSearch(query, clientId, options);
      
      res.json({
        success: true,
        data: results
      });
      
    } catch (error) {
      console.error('RefKG search error:', error);
      res.status(500).json({
        success: false,
        error: 'RefKG search failed'
      });
    }
  }

  /**
   * Query decomposition endpoint
   */
  async decomposeQuery(req, res) {
    try {
      const { query, clientId } = req.body;
      
      const decomposedQueries = await this.refkgService.decomposeQuery(query, clientId);
      
      res.json({
        success: true,
        data: {
          original_query: query,
          decomposed_queries: decomposedQueries
        }
      });
      
    } catch (error) {
      console.error('Query decomposition error:', error);
      res.status(500).json({
        success: false,
        error: 'Query decomposition failed'
      });
    }
  }

  /**
   * Get enhanced product with all standards
   */
  async getEnhancedProduct(req, res) {
    try {
      const { id } = req.params;
      const { clientId } = req.query;
      
      // Get base product data
      const product = await this.productService.getProduct(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      
      // Enhance with I40KG quality data
      const qualityData = await this.i40kgService.integrateCertificationData(id, clientId);
      
      // Enhance with DPP identity data
      const dppData = await this.dppService.generateDPPIdentity(id, clientId);
      const authenticityData = await this.dppService.verifyProductAuthenticity(id, clientId);
      
      // Get trust data
      const trustData = await this.trustService.getTrustData(id, clientId);
      
      // Get manufacturer data
      const manufacturerData = await this.manufacturerService.getManufacturerByProduct(id);
      
      const enhancedProduct = {
        ...product,
        i40kg_quality: {
          certifications: qualityData.certifications,
          quality_score: qualityData.qualityScore,
          trust_indicators: qualityData.trustIndicators,
          quality_summary: this.i40kgService.generateQualitySummary(qualityData)
        },
        dpp_identity: {
          identity: dppData.dppIdentity,
          authenticity: authenticityData,
          dpp_summary: this.dppService.generateDPPSummary(dppData)
        },
        trust_data: trustData,
        manufacturer_data: manufacturerData,
        enhanced_metadata: {
          standards_compliance: {
            refkg: true,
            i40kg: qualityData.certifications.length > 0,
            dpp: dppData.verification_status === 'verified'
          },
          overall_trust_score: this.calculateOverallTrustScore(qualityData, authenticityData, trustData),
          llm_optimization: {
            structured_data: true,
            rich_context: true,
            trust_indicators: true,
            regulatory_compliance: authenticityData.dpp_compliance?.eu_dpp_compliant || false
          }
        }
      };
      
      res.json({
        success: true,
        data: enhancedProduct
      });
      
    } catch (error) {
      console.error('Enhanced product error:', error);
      res.status(500).json({
        success: false,
        error: 'Enhanced product retrieval failed'
      });
    }
  }

  /**
   * Get product quality data (I40KG)
   */
  async getProductQuality(req, res) {
    try {
      const { id } = req.params;
      const { clientId } = req.query;
      
      const qualityData = await this.i40kgService.integrateCertificationData(id, clientId);
      const recommendations = await this.i40kgService.getQualityRecommendations(id, clientId);
      
      res.json({
        success: true,
        data: {
          quality_data: qualityData,
          recommendations: recommendations
        }
      });
      
    } catch (error) {
      console.error('Product quality error:', error);
      res.status(500).json({
        success: false,
        error: 'Product quality retrieval failed'
      });
    }
  }

  /**
   * Get product DPP data
   */
  async getProductDPP(req, res) {
    try {
      const { id } = req.params;
      const { clientId } = req.query;
      
      const dppData = await this.dppService.generateDPPIdentity(id, clientId);
      const recommendations = await this.dppService.getDPPRecommendations(id, clientId);
      
      res.json({
        success: true,
        data: {
          dpp_data: dppData,
          recommendations: recommendations
        }
      });
      
    } catch (error) {
      console.error('Product DPP error:', error);
      res.status(500).json({
        success: false,
        error: 'Product DPP retrieval failed'
      });
    }
  }

  /**
   * Verify product authenticity
   */
  async verifyProductAuthenticity(req, res) {
    try {
      const { id } = req.params;
      const { clientId } = req.query;
      
      const authenticityData = await this.dppService.verifyProductAuthenticity(id, clientId);
      
      res.json({
        success: true,
        data: authenticityData
      });
      
    } catch (error) {
      console.error('Product authenticity error:', error);
      res.status(500).json({
        success: false,
        error: 'Product authenticity verification failed'
      });
    }
  }

  /**
   * Get enhanced trust data
   */
  async getEnhancedTrust(req, res) {
    try {
      const { productId } = req.params;
      const { clientId } = req.query;
      
      const trustData = await this.trustService.getTrustData(productId, clientId);
      const qualityData = await this.i40kgService.integrateCertificationData(productId, clientId);
      const authenticityData = await this.dppService.verifyProductAuthenticity(productId, clientId);
      
      const enhancedTrust = {
        ...trustData,
        quality_trust: qualityData.trustIndicators,
        authenticity_trust: {
          authenticity_verified: authenticityData.authenticity_verified,
          manufacturer_verified: authenticityData.manufacturer_verified,
          supply_chain_verified: authenticityData.supply_chain_verified,
          trust_score: authenticityData.trust_score
        },
        overall_trust_score: this.calculateOverallTrustScore(qualityData, authenticityData, trustData)
      };
      
      res.json({
        success: true,
        data: enhancedTrust
      });
      
    } catch (error) {
      console.error('Enhanced trust error:', error);
      res.status(500).json({
        success: false,
        error: 'Enhanced trust retrieval failed'
      });
    }
  }

  /**
   * Get product compliance data
   */
  async getProductCompliance(req, res) {
    try {
      const { productId } = req.params;
      const { clientId } = req.query;
      
      const qualityData = await this.i40kgService.integrateCertificationData(productId, clientId);
      const dppData = await this.dppService.verifyProductAuthenticity(productId, clientId);
      
      const complianceData = {
        quality_compliance: {
          certifications: qualityData.certifications,
          quality_score: qualityData.qualityScore,
          trust_level: this.i40kgService.calculateTrustLevel(qualityData.qualityScore)
        },
        dpp_compliance: dppData.dpp_compliance,
        overall_compliance: {
          eu_market_access: dppData.dpp_compliance?.eu_dpp_compliant || false,
          quality_standards: qualityData.certifications.length > 0,
          regulatory_compliance: dppData.dpp_compliance?.overall_compliant || false
        }
      };
      
      res.json({
        success: true,
        data: complianceData
      });
      
    } catch (error) {
      console.error('Product compliance error:', error);
      res.status(500).json({
        success: false,
        error: 'Product compliance retrieval failed'
      });
    }
  }

  /**
   * LLM-optimized search
   */
  async llmOptimizedSearch(req, res) {
    try {
      const { query, clientId, format = 'structured' } = req.body;
      
      // Use RefKG for superior search
      const refkgResults = await this.refkgService.refkgSearch(query, clientId);
      
      // Enhance results for LLM consumption
      const llmOptimizedResults = await this.optimizeForLLM(refkgResults, format);
      
      res.json({
        success: true,
        data: llmOptimizedResults
      });
      
    } catch (error) {
      console.error('LLM search error:', error);
      res.status(500).json({
        success: false,
        error: 'LLM search failed'
      });
    }
  }

  /**
   * Get LLM-optimized product
   */
  async getLLMOptimizedProduct(req, res) {
    try {
      const { id } = req.params;
      const { clientId, format = 'structured' } = req.query;
      
      const enhancedProduct = await this.getEnhancedProductData(id, clientId);
      const llmOptimizedProduct = await this.optimizeForLLM(enhancedProduct, format);
      
      res.json({
        success: true,
        data: llmOptimizedProduct
      });
      
    } catch (error) {
      console.error('LLM product error:', error);
      res.status(500).json({
        success: false,
        error: 'LLM product retrieval failed'
      });
    }
  }

  /**
   * Get LLM recommendations
   */
  async getLLMRecommendations(req, res) {
    try {
      const { query, clientId, productId } = req.body;
      
      const recommendations = {
        search_recommendations: await this.refkgService.refkgSearch(query, clientId),
        quality_recommendations: productId ? await this.i40kgService.getQualityRecommendations(productId, clientId) : null,
        dpp_recommendations: productId ? await this.dppService.getDPPRecommendations(productId, clientId) : null,
        trust_recommendations: productId ? await this.trustService.getTrustRecommendations(productId, clientId) : null
      };
      
      res.json({
        success: true,
        data: recommendations
      });
      
    } catch (error) {
      console.error('LLM recommendations error:', error);
      res.status(500).json({
        success: false,
        error: 'LLM recommendations failed'
      });
    }
  }

  /**
   * Enhance results with I40KG quality data
   */
  async enhanceWithI40KG(reconstructedKnowledge, clientId) {
    const enhancedResults = { ...reconstructedKnowledge };
    
    if (enhancedResults.product_recommendations?.primary_matches) {
      for (const product of enhancedResults.product_recommendations.primary_matches) {
        const qualityData = await this.i40kgService.integrateCertificationData(product.id, clientId);
        product.i40kg_quality = qualityData;
      }
    }
    
    return enhancedResults;
  }

  /**
   * Enhance results with DPP authenticity data
   */
  async enhanceWithDPP(enhancedResults, clientId) {
    const finalResults = { ...enhancedResults };
    
    if (finalResults.product_recommendations?.primary_matches) {
      for (const product of finalResults.product_recommendations.primary_matches) {
        const dppData = await this.dppService.generateDPPIdentity(product.id, clientId);
        const authenticityData = await this.dppService.verifyProductAuthenticity(product.id, clientId);
        product.dpp_identity = dppData;
        product.dpp_authenticity = authenticityData;
      }
    }
    
    return finalResults;
  }

  /**
   * Optimize data for LLM consumption
   */
  async optimizeForLLM(data, format) {
    switch (format) {
      case 'structured':
        return this.formatStructuredForLLM(data);
      case 'natural':
        return this.formatNaturalForLLM(data);
      case 'compact':
        return this.formatCompactForLLM(data);
      default:
        return this.formatStructuredForLLM(data);
    }
  }

  /**
   * Format data as structured for LLM
   */
  formatStructuredForLLM(data) {
    return {
      type: 'structured_product_data',
      standards: ['RefKG', 'I40KG', 'DPP'],
      data: data,
      metadata: {
        optimized_for_llm: true,
        token_efficient: true,
        rich_context: true
      }
    };
  }

  /**
   * Format data as natural language for LLM
   */
  formatNaturalForLLM(data) {
    return {
      type: 'natural_language_summary',
      content: this.generateNaturalLanguageSummary(data),
      metadata: {
        optimized_for_llm: true,
        conversational: true
      }
    };
  }

  /**
   * Format data as compact for LLM
   */
  formatCompactForLLM(data) {
    return {
      type: 'compact_product_data',
      essential_info: this.extractEssentialInfo(data),
      metadata: {
        optimized_for_llm: true,
        minimal_tokens: true
      }
    };
  }

  /**
   * Generate natural language summary
   */
  generateNaturalLanguageSummary(data) {
    // Implementation for natural language summary generation
    return "Enhanced product summary with quality certifications and authenticity verification.";
  }

  /**
   * Extract essential information
   */
  extractEssentialInfo(data) {
    // Implementation for extracting essential product information
    return {
      id: data.id,
      name: data.name,
      quality_score: data.i40kg_quality?.quality_score,
      authenticity_verified: data.dpp_authenticity?.authenticity_verified
    };
  }

  /**
   * Calculate overall quality score
   */
  calculateOverallQualityScore(results) {
    // Implementation for calculating overall quality score
    return 0.85; // Placeholder
  }

  /**
   * Calculate overall trust score
   */
  calculateOverallTrustScore(qualityData, authenticityData, trustData) {
    const qualityScore = qualityData.qualityScore || 0;
    const authenticityScore = authenticityData.trust_score || 0;
    const trustScore = trustData.averageRating ? trustData.averageRating / 5 : 0;
    
    return (qualityScore * 0.4) + (authenticityScore * 0.4) + (trustScore * 0.2);
  }

  /**
   * Get enhanced product data
   */
  async getEnhancedProductData(productId, clientId) {
    const product = await this.productService.getProduct(productId);
    const qualityData = await this.i40kgService.integrateCertificationData(productId, clientId);
    const dppData = await this.dppService.generateDPPIdentity(productId, clientId);
    const authenticityData = await this.dppService.verifyProductAuthenticity(productId, clientId);
    
    return {
      ...product,
      i40kg_quality: qualityData,
      dpp_identity: dppData,
      dpp_authenticity: authenticityData
    };
  }

  /**
   * Demo health check endpoint
   */
  async demoHealth(req, res) {
    res.json({
      success: true,
      message: 'Enhanced AI Controller is running',
      standards: ['RefKG', 'I40KG', 'DPP'],
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Demo search endpoint
   */
  async demoSearch(req, res) {
    try {
      const { query, clientId = 'demo-client-001' } = req.body;
      
      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required'
        });
      }

      // Test RefKG query decomposition
      const decomposedQueries = await this.refkgService.decomposeQuery(query, clientId);
      
      res.json({
        success: true,
        data: {
          original_query: query,
          decomposed_queries: decomposedQueries,
          message: 'Enhanced AI search demo successful'
        }
      });
      
    } catch (error) {
      console.error('Demo search error:', error);
      res.status(500).json({
        success: false,
        error: 'Demo search failed'
      });
    }
  }

  /**
   * Register routes with Express app
   */
  registerRoutes(app) {
    app.use('/api/enhanced', this.router);
  }
} 