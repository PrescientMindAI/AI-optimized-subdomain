/**
 * LLM-Optimized Format
 * 
 * Provides data formats specifically designed to be superior to what LLMs
 * can extract from original websites. Focuses on structured, semantic,
 * and relationship-rich data that LLMs can consume more efficiently.
 */

export const LLMOptimizedFormat = {
  /**
   * Create LLM-optimized product data
   * @param {Object} product - Our knowledge graph product
   * @returns {Object} LLM-optimized product data
   */
  formatProductForLLM(product) {
    return {
      // Core product information (clean, structured)
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        availability: product.availability,
        category: product.category,
        model: product.model,
        images: product.images,
        specifications: product.specifications
      },

      // Semantic context (what LLMs need for understanding)
      semantic_context: {
        tags: product.tags,
        use_cases: this.extractUseCases(product),
        target_audience: this.extractTargetAudience(product),
        quality_indicators: this.extractQualityIndicators(product),
        sustainability_factors: this.extractSustainabilityFactors(product)
      },

      // Relationship network (superior to website links)
      relationships: {
        similar_products: product.relationships?.SIMILAR_TO || [],
        complementary_products: product.relationships?.COMPLEMENTARY_TO || [],
        variations: product.relationships?.VARIATION_OF || [],
        alternatives: product.relationships?.ALTERNATIVE_TO || [],
        upgrades: product.relationships?.UPGRADE_FROM || [],
        downgrades: product.relationships?.DOWNGRADE_TO || []
      },

      // Trust and credibility (missing from most websites)
      trust_indicators: {
        overall_score: product.trustScore,
        manufacturer_trust: product.manufacturer?.trustScore,
        review_credibility: this.calculateReviewCredibility(product),
        certification_status: product.certifications || [],
        verification_status: product.verified || false,
        data_freshness: this.calculateDataFreshness(product)
      },

      // AI-optimized features
      ai_features: {
        vector_embedding: product.vectorEmbedding,
        semantic_cluster: this.getSemanticCluster(product),
        reasoning_context: this.generateReasoningContext(product),
        decision_factors: this.extractDecisionFactors(product)
      },

      // Comparative analysis (what LLMs struggle to do)
      comparative_analysis: {
        price_performance_ratio: this.calculatePricePerformanceRatio(product),
        value_proposition: this.generateValueProposition(product),
        competitive_advantages: this.extractCompetitiveAdvantages(product),
        market_positioning: this.analyzeMarketPositioning(product)
      }
    };
  },

  /**
   * Create comprehensive product comparison for LLMs
   * @param {Array} products - Array of products to compare
   * @returns {Object} LLM-optimized comparison data
   */
  formatProductComparisonForLLM(products) {
    return {
      comparison_metadata: {
        comparison_type: "product_comparison",
        products_count: products.length,
        comparison_criteria: this.generateComparisonCriteria(products),
        comparison_methodology: "ai_optimized_analysis"
      },

      comparative_analysis: {
        price_analysis: this.analyzePriceRange(products),
        feature_comparison: this.compareFeatures(products),
        quality_assessment: this.assessQualityDifferences(products),
        value_analysis: this.analyzeValuePropositions(products)
      },

      recommendations: {
        best_overall: this.identifyBestOverall(products),
        best_value: this.identifyBestValue(products),
        best_quality: this.identifyBestQuality(products),
        best_budget: this.identifyBestBudget(products),
        reasoning: this.generateRecommendationReasoning(products)
      },

      decision_support: {
        decision_factors: this.extractDecisionFactors(products),
        trade_offs: this.analyzeTradeOffs(products),
        risk_assessment: this.assessRisks(products),
        future_proofing: this.assessFutureProofing(products)
      }
    };
  },

  /**
   * Create search results optimized for LLM consumption
   * @param {Array} searchResults - Search results
   * @param {string} query - Original search query
   * @returns {Object} LLM-optimized search results
   */
  formatSearchResultsForLLM(searchResults, query) {
    return {
      search_metadata: {
        query: query,
        results_count: searchResults.length,
        search_type: this.determineSearchType(query),
        relevance_threshold: 0.7
      },

      results_summary: {
        top_matches: this.identifyTopMatches(searchResults),
        category_distribution: this.analyzeCategoryDistribution(searchResults),
        price_distribution: this.analyzePriceDistribution(searchResults),
        quality_distribution: this.analyzeQualityDistribution(searchResults)
      },

      detailed_results: searchResults.map(result => ({
        product: this.formatProductForLLM(result),
        relevance_score: result.relevanceScore,
        match_reasons: this.explainMatchReasons(result, query),
        alternative_suggestions: this.generateAlternatives(result, searchResults)
      })),

      search_insights: {
        query_interpretation: this.interpretQuery(query),
        search_patterns: this.analyzeSearchPatterns(searchResults),
        user_intent: this.inferUserIntent(query, searchResults),
        optimization_suggestions: this.suggestQueryOptimizations(query)
      }
    };
  },

  /**
   * Create knowledge graph query results for LLMs
   * @param {Object} graphQuery - Knowledge graph query results
   * @returns {Object} LLM-optimized graph data
   */
  formatGraphQueryForLLM(graphQuery) {
    return {
      query_metadata: {
        query_type: graphQuery.type,
        entities_found: graphQuery.entities.length,
        relationships_found: graphQuery.relationships.length,
        query_complexity: this.assessQueryComplexity(graphQuery)
      },

      knowledge_graph: {
        entities: graphQuery.entities.map(entity => ({
          id: entity.id,
          type: entity.type,
          properties: entity.properties,
          trust_score: entity.trustScore,
          semantic_context: entity.semanticContext
        })),

        relationships: graphQuery.relationships.map(rel => ({
          source: rel.source,
          target: rel.target,
          type: rel.type,
          strength: rel.strength,
          context: rel.context
        })),

        subgraphs: graphQuery.subgraphs.map(subgraph => ({
          id: subgraph.id,
          entities: subgraph.entities,
          relationships: subgraph.relationships,
          semantic_cluster: subgraph.semanticCluster,
          relevance_score: subgraph.relevanceScore
        }))
      },

      insights: {
        patterns_discovered: this.discoverPatterns(graphQuery),
        anomalies_detected: this.detectAnomalies(graphQuery),
        recommendations: this.generateGraphInsights(graphQuery),
        knowledge_gaps: this.identifyKnowledgeGaps(graphQuery)
      }
    };
  },

  // Helper methods for data extraction and analysis
  extractUseCases(product) {
    // Extract use cases from product description, tags, and specifications
    const useCases = [];
    if (product.description) {
      // NLP analysis to extract use cases
      useCases.push(...this.analyzeTextForUseCases(product.description));
    }
    if (product.tags) {
      useCases.push(...product.tags.filter(tag => 
        ['gaming', 'business', 'photography', 'travel'].includes(tag)
      ));
    }
    return useCases;
  },

  extractTargetAudience(product) {
    // Analyze product characteristics to determine target audience
    const audience = [];
    if (product.price > 1000) audience.push('premium');
    if (product.category === 'gaming') audience.push('gamers');
    if (product.specifications?.professional) audience.push('professionals');
    return audience;
  },

  extractQualityIndicators(product) {
    // Extract quality indicators from product data
    const indicators = [];
    if (product.trustScore > 0.9) indicators.push('high_trust');
    if (product.manufacturer?.verified) indicators.push('verified_manufacturer');
    if (product.certifications?.length > 0) indicators.push('certified');
    return indicators;
  },

  extractSustainabilityFactors(product) {
    // Extract sustainability information
    const factors = [];
    if (product.specifications?.eco_friendly) factors.push('eco_friendly');
    if (product.specifications?.recyclable) factors.push('recyclable');
    if (product.specifications?.energy_efficient) factors.push('energy_efficient');
    return factors;
  },

  calculateReviewCredibility(product) {
    // Calculate review credibility score
    return product.trustScore * 0.7 + (product.manufacturer?.trustScore || 0.5) * 0.3;
  },

  calculateDataFreshness(product) {
    // Calculate how fresh the data is
    const daysSinceUpdate = (Date.now() - new Date(product.updatedAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7) return 'very_fresh';
    if (daysSinceUpdate < 30) return 'fresh';
    if (daysSinceUpdate < 90) return 'moderate';
    return 'stale';
  },

  getSemanticCluster(product) {
    // Determine semantic cluster based on product characteristics
    if (product.category === 'electronics') return 'tech_products';
    if (product.category === 'clothing') return 'fashion_items';
    return 'general_products';
  },

  generateReasoningContext(product) {
    // Generate context for LLM reasoning
    return {
      product_type: product.category,
      price_range: this.getPriceRange(product.price),
      quality_tier: this.getQualityTier(product.trustScore),
      market_segment: this.getMarketSegment(product)
    };
  },

  extractDecisionFactors(product) {
    // Extract factors that influence purchase decisions
    return {
      price_factor: this.assessPriceFactor(product.price),
      quality_factor: this.assessQualityFactor(product.trustScore),
      brand_factor: this.assessBrandFactor(product.manufacturer),
      feature_factor: this.assessFeatureFactor(product.specifications)
    };
  },

  // Additional helper methods...
  getPriceRange(price) {
    if (price < 50) return 'budget';
    if (price < 200) return 'mid_range';
    if (price < 1000) return 'premium';
    return 'luxury';
  },

  getQualityTier(trustScore) {
    if (trustScore > 0.9) return 'excellent';
    if (trustScore > 0.7) return 'good';
    if (trustScore > 0.5) return 'average';
    return 'poor';
  },

  getMarketSegment(product) {
    if (product.price > 1000) return 'premium';
    if (product.category === 'electronics') return 'tech_savvy';
    return 'general';
  }
}; 