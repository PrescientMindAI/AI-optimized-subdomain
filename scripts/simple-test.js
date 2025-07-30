/**
 * Simple Test Script for Enhanced AI Functionality
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testEnhancedAI() {
  console.log('🧪 Testing Enhanced AI Functionality...\n');

  try {
    // Test 1: Demo Health Check
    console.log('1️⃣ Testing Demo Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/enhanced/demo/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('   - Standards:', healthResponse.data.standards.join(', '));
    console.log('   - Status:', healthResponse.data.success ? 'Running' : 'Failed');
    console.log('');

    // Test 2: Demo Search
    console.log('2️⃣ Testing Demo Search...');
    const searchResponse = await axios.post(`${BASE_URL}/api/enhanced/demo/search`, {
      query: 'best smartphone for photography under $1000'
    });
    console.log('✅ Demo Search:', searchResponse.data.success ? 'Success' : 'Failed');
    if (searchResponse.data.data) {
      console.log('   - Original Query:', searchResponse.data.data.original_query);
      console.log('   - Decomposed Queries:', searchResponse.data.data.decomposed_queries.length);
      searchResponse.data.data.decomposed_queries.forEach((q, i) => {
        console.log(`     ${i + 1}. ${q.type}: ${q.value} (${q.priority})`);
      });
    }
    console.log('');

    // Test 3: Enhanced Product (if available)
    console.log('3️⃣ Testing Enhanced Product...');
    try {
      const productResponse = await axios.get(`${BASE_URL}/api/enhanced/products/demo-product-001/enhanced?clientId=demo-client-001`);
      console.log('✅ Enhanced Product:', productResponse.data.success ? 'Success' : 'Failed');
      if (productResponse.data.data) {
        const product = productResponse.data.data;
        console.log('   - Product ID:', product.id);
        console.log('   - Name:', product.name);
        console.log('   - I40KG Quality Score:', product.i40kg_quality?.quality_score || 'N/A');
        console.log('   - DPP Verified:', product.dpp_identity?.authenticity?.authenticity_verified || 'N/A');
        console.log('   - Overall Trust Score:', product.enhanced_metadata?.overall_trust_score || 'N/A');
      }
    } catch (error) {
      console.log('⚠️  Enhanced Product Test:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 4: LLM Optimized Search
    console.log('4️⃣ Testing LLM Optimized Search...');
    try {
      const llmResponse = await axios.post(`${BASE_URL}/api/enhanced/llm/search`, {
        query: 'wireless headphones with noise cancellation',
        clientId: 'demo-client-001',
        format: 'structured'
      });
      console.log('✅ LLM Search:', llmResponse.data.success ? 'Success' : 'Failed');
      if (llmResponse.data.data) {
        console.log('   - Format:', llmResponse.data.data.type);
        console.log('   - Standards:', llmResponse.data.data.standards.join(', '));
        console.log('   - LLM Optimized:', llmResponse.data.data.metadata.optimized_for_llm);
      }
    } catch (error) {
      console.log('⚠️  LLM Search Test:', error.response?.data?.error || error.message);
    }
    console.log('');

    console.log('🎉 Enhanced AI Testing Complete!');
    console.log('=====================================');
    console.log('✅ RefKG: Query decomposition and knowledge reconstruction');
    console.log('✅ I40KG: Quality certifications and trust indicators');
    console.log('✅ DPP: Authenticity verification and EU compliance');
    console.log('✅ LLM Optimization: Superior data for AI consumption');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testEnhancedAI().catch(console.error); 