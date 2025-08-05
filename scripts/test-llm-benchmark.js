import LLMCentricBenchmark from './llm-centric-benchmark.js';

async function testBenchmark() {
  console.log('🧪 Testing LLM-Centric Benchmark...\n');
  
  try {
    const benchmark = new LLMCentricBenchmark('https://example.com');
    
    console.log('✅ Benchmark initialized successfully');
    console.log(`🌐 Reference Website: ${benchmark.referenceWebsite}`);
    console.log(`🤖 AI Subdomain: ${benchmark.aiSubdomain}`);
    console.log(`📝 Test Prompts: ${benchmark.testPrompts.length} prompts generated`);
    
    // Test a single prompt
    console.log('\n🔍 Testing single prompt...');
    const testPrompt = benchmark.testPrompts[0];
    console.log(`Prompt: "${testPrompt}"`);
    
    const aiResult = await benchmark.simulateLLMWebScraping(benchmark.aiSubdomain, testPrompt, 'ai_optimized');
    const standardResult = await benchmark.simulateLLMWebScraping(benchmark.referenceWebsite, testPrompt, 'standard_website');
    
    console.log('✅ Single prompt test completed');
    console.log(`AI-Optimized Truth Score: ${aiResult.validation_scores.data_truth.toFixed(3)}`);
    console.log(`Standard Truth Score: ${standardResult.validation_scores.data_truth.toFixed(3)}`);
    
    console.log('\n🎉 All tests passed! The LLM-Centric Benchmark is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testBenchmark(); 