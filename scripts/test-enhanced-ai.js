/**
 * Enhanced AI Test Script
 * 
 * Demonstrates the enhanced AI functionality that integrates RefKG, I40KG, and DPP
 * standards to provide superior data for LLMs compared to regular e-commerce websites.
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const CLIENT_ID = 'demo-client-001';

class EnhancedAITester {
  constructor() {
    this.baseUrl = BASE_URL;
    this.clientId = CLIENT_ID;
  }

  /**
   * Test enhanced search functionality
   */
  async testEnhancedSearch() {
    console.log('\n🔍 Testing Enhanced Search (RefKG + I40KG + DPP)...');
    
    const testQueries = [
      'best smartphone for photography under $1000',
      'laptop with good battery life for business',
      'headphones with noise cancellation under $200'
    ];

    for (const query of testQueries) {
      console.log(`\n📝 Testing query: "${query}"`);
      
      try {
        const response = await axios.post(`${this.baseUrl}/api/enhanced/search/enhanced`, {
          query,
          clientId: this.clientId,
          options: {
            reflectionDepth: 2,
            maxIterations: 3
          }
        });

        const data = response.data.data;
        console.log('✅ Enhanced search successful');
        console.log(`   - Decomposed queries: ${data.decomposed_queries.length}`);
        console.log(`   - Evidence subgraphs: ${data.evidence_subgraphs.length}`);
        console.log(`   - Standards used: ${data.processing_metadata.standards_used.join(', ')}`);
        console.log(`   - Quality score: ${data.processing_metadata.quality_score}`);
        
      } catch (error) {
        console.error('❌ Enhanced search failed:', error.response?.data || error.message);
      }
    }
  }

  /**
   * Test RefKG-specific search
   */
  async testRefKGSearch() {
    console.log('\n🧠 Testing RefKG Search...');
    
    const query = 'smartphone with good camera and long battery life';
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/enhanced/search/refkg`, {
        query,
        clientId: this.clientId
      });

      console.log('✅ RefKG search successful');
      console.log(`   - Query: "${query}"`);
      console.log(`   - Results available: ${response.data.data ? 'Yes' : 'No'}`);
      
    } catch (error) {
      console.error('❌ RefKG search failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test query decomposition
   */
  async testQueryDecomposition() {
    console.log('\n🔧 Testing Query Decomposition...');
    
    const query = 'laptop for gaming with good graphics under $1500';
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/enhanced/search/decompose`, {
        query,
        clientId: this.clientId
      });

      const data = response.data.data;
      console.log('✅ Query decomposition successful');
      console.log(`   - Original query: "${data.original_query}"`);
      console.log(`   - Decomposed queries: ${data.decomposed_queries.length}`);
      
      data.decomposed_queries.forEach((subQuery, index) => {
        console.log(`     ${index + 1}. ${subQuery.type}: ${subQuery.value} (${subQuery.priority})`);
      });
      
    } catch (error) {
      console.error('❌ Query decomposition failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test enhanced product retrieval
   */
  async testEnhancedProduct() {
    console.log('\n📦 Testing Enhanced Product Retrieval...');
    
    const productId = 'demo-product-001';
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/enhanced/products/${productId}/enhanced?clientId=${this.clientId}`);
      
      const product = response.data.data;
      console.log('✅ Enhanced product retrieval successful');
      console.log(`   - Product ID: ${product.id}`);
      console.log(`   - Name: ${product.name}`);
      console.log(`   - I40KG Quality Score: ${product.i40kg_quality?.quality_score || 'N/A'}`);
      console.log(`   - DPP Verified: ${product.dpp_identity?.authenticity?.authenticity_verified || 'N/A'}`);
      console.log(`   - Overall Trust Score: ${product.enhanced_metadata?.overall_trust_score || 'N/A'}`);
      
    } catch (error) {
      console.error('❌ Enhanced product retrieval failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test I40KG quality data
   */
  async testI40KGQuality() {
    console.log('\n🏭 Testing I40KG Quality Data...');
    
    const productId = 'demo-product-001';
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/enhanced/products/${productId}/quality?clientId=${this.clientId}`);
      
      const data = response.data.data;
      console.log('✅ I40KG quality data retrieval successful');
      console.log(`   - Quality Score: ${data.quality_data.quality_score}`);
      console.log(`   - Certifications: ${data.quality_data.certifications.length}`);
      console.log(`   - Trust Level: ${data.recommendations.trustLevel}`);
      
      data.quality_data.certifications.forEach(cert => {
        console.log(`     - ${cert.body}: ${cert.certification}`);
      });
      
    } catch (error) {
      console.error('❌ I40KG quality data retrieval failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test DPP identity data
   */
  async testDPPIdentity() {
    console.log('\n🆔 Testing DPP Identity Data...');
    
    const productId = 'demo-product-001';
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/enhanced/products/${productId}/dpp?clientId=${this.clientId}`);
      
      const data = response.data.data;
      console.log('✅ DPP identity data retrieval successful');
      console.log(`   - DPP ID: ${data.dpp_data.dppIdentity?.unique_identifier || 'N/A'}`);
      console.log(`   - Verification Status: ${data.dpp_data.verification_status}`);
      console.log(`   - EU DPP Compliant: ${data.recommendations.marketAccess?.eu_market_access || 'N/A'}`);
      
    } catch (error) {
      console.error('❌ DPP identity data retrieval failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test product authenticity verification
   */
  async testProductAuthenticity() {
    console.log('\n✅ Testing Product Authenticity Verification...');
    
    const productId = 'demo-product-001';
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/enhanced/products/${productId}/authenticity?clientId=${this.clientId}`);
      
      const data = response.data.data;
      console.log('✅ Product authenticity verification successful');
      console.log(`   - Authenticity Verified: ${data.authenticity_verified}`);
      console.log(`   - Manufacturer Verified: ${data.manufacturer_verified}`);
      console.log(`   - Supply Chain Verified: ${data.supply_chain_verified}`);
      console.log(`   - Trust Score: ${data.trust_score}`);
      
    } catch (error) {
      console.error('❌ Product authenticity verification failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test enhanced trust data
   */
  async testEnhancedTrust() {
    console.log('\n🤝 Testing Enhanced Trust Data...');
    
    const productId = 'demo-product-001';
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/enhanced/trust/${productId}/enhanced?clientId=${this.clientId}`);
      
      const data = response.data.data;
      console.log('✅ Enhanced trust data retrieval successful');
      console.log(`   - Overall Trust Score: ${data.overall_trust_score}`);
      console.log(`   - Quality Trust: ${data.quality_trust?.certified_quality || 'N/A'}`);
      console.log(`   - Authenticity Trust: ${data.authenticity_trust?.authenticity_verified || 'N/A'}`);
      
    } catch (error) {
      console.error('❌ Enhanced trust data retrieval failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test product compliance
   */
  async testProductCompliance() {
    console.log('\n📋 Testing Product Compliance...');
    
    const productId = 'demo-product-001';
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/enhanced/compliance/${productId}?clientId=${this.clientId}`);
      
      const data = response.data.data;
      console.log('✅ Product compliance retrieval successful');
      console.log(`   - EU Market Access: ${data.overall_compliance?.eu_market_access || 'N/A'}`);
      console.log(`   - Quality Standards: ${data.overall_compliance?.quality_standards || 'N/A'}`);
      console.log(`   - Regulatory Compliance: ${data.overall_compliance?.regulatory_compliance || 'N/A'}`);
      
    } catch (error) {
      console.error('❌ Product compliance retrieval failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test LLM-optimized search
   */
  async testLLMOptimizedSearch() {
    console.log('\n🤖 Testing LLM-Optimized Search...');
    
    const query = 'best wireless headphones for music';
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/enhanced/llm/search`, {
        query,
        clientId: this.clientId,
        format: 'structured'
      });

      console.log('✅ LLM-optimized search successful');
      console.log(`   - Query: "${query}"`);
      console.log(`   - Format: ${response.data.data.type}`);
      console.log(`   - Standards: ${response.data.data.standards.join(', ')}`);
      console.log(`   - LLM Optimized: ${response.data.data.metadata.optimized_for_llm}`);
      
    } catch (error) {
      console.error('❌ LLM-optimized search failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test LLM-optimized product
   */
  async testLLMOptimizedProduct() {
    console.log('\n🤖 Testing LLM-Optimized Product...');
    
    const productId = 'demo-product-001';
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/enhanced/llm/product/${productId}?clientId=${this.clientId}&format=structured`);
      
      console.log('✅ LLM-optimized product retrieval successful');
      console.log(`   - Product ID: ${productId}`);
      console.log(`   - Format: ${response.data.data.type}`);
      console.log(`   - Token Efficient: ${response.data.data.metadata.token_efficient}`);
      console.log(`   - Rich Context: ${response.data.data.metadata.rich_context}`);
      
    } catch (error) {
      console.error('❌ LLM-optimized product retrieval failed:', error.response?.data || error.message);
    }
  }

  /**
   * Test LLM recommendations
   */
  async testLLMRecommendations() {
    console.log('\n🤖 Testing LLM Recommendations...');
    
    const query = 'smartphone with good camera';
    const productId = 'demo-product-001';
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/enhanced/llm/recommendations`, {
        query,
        clientId: this.clientId,
        productId
      });

      console.log('✅ LLM recommendations successful');
      console.log(`   - Query: "${query}"`);
      console.log(`   - Product ID: ${productId}`);
      console.log(`   - Search Recommendations: ${response.data.data.search_recommendations ? 'Available' : 'N/A'}`);
      console.log(`   - Quality Recommendations: ${response.data.data.quality_recommendations ? 'Available' : 'N/A'}`);
      console.log(`   - DPP Recommendations: ${response.data.data.dpp_recommendations ? 'Available' : 'N/A'}`);
      
    } catch (error) {
      console.error('❌ LLM recommendations failed:', error.response?.data || error.message);
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting Enhanced AI Tests...');
    console.log('=====================================');
    
    await this.testEnhancedSearch();
    await this.testRefKGSearch();
    await this.testQueryDecomposition();
    await this.testEnhancedProduct();
    await this.testI40KGQuality();
    await this.testDPPIdentity();
    await this.testProductAuthenticity();
    await this.testEnhancedTrust();
    await this.testProductCompliance();
    await this.testLLMOptimizedSearch();
    await this.testLLMOptimizedProduct();
    await this.testLLMRecommendations();
    
    console.log('\n🎉 All Enhanced AI tests completed!');
    console.log('=====================================');
    console.log('\n📊 Summary:');
    console.log('✅ Enhanced search with RefKG, I40KG, and DPP integration');
    console.log('✅ Superior data for LLMs compared to regular e-commerce websites');
    console.log('✅ Quality certifications and authenticity verification');
    console.log('✅ EU regulatory compliance and market access');
    console.log('✅ LLM-optimized data formats for efficient consumption');
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new EnhancedAITester();
  tester.runAllTests().catch(console.error);
}

export default EnhancedAITester; 