/**
 * Test CSV Validation
 */

import fs from 'fs';

console.log('🧪 Testing CSV validation...\n');

// Test 1: Check if CSV file exists
console.log('1️⃣ Checking CSV file...');
const csvPath = './data/woocommerce-products.csv';
if (fs.existsSync(csvPath)) {
  console.log('✅ CSV file exists');
  
  // Test 2: Read CSV content
  console.log('\n2️⃣ Reading CSV content...');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  console.log(`✅ CSV has ${lines.length} lines`);
  
  // Test 3: Check headers
  console.log('\n3️⃣ Checking headers...');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
  console.log(`✅ Found ${headers.length} headers: ${headers.slice(0, 5).join(', ')}...`);
  
  // Test 4: Check required fields
  console.log('\n4️⃣ Checking required fields...');
  const requiredFields = ['Product ID', 'Product Name', 'Description', 'Regular Price', 'SKU', 'Category'];
  let missingFields = [];
  
  requiredFields.forEach(field => {
    if (!headers.includes(field)) {
      missingFields.push(field);
    }
  });
  
  if (missingFields.length === 0) {
    console.log('✅ All required fields present');
  } else {
    console.log(`❌ Missing required fields: ${missingFields.join(', ')}`);
  }
  
  // Test 5: Check data row
  console.log('\n5️⃣ Checking data row...');
  if (lines.length > 1) {
    const dataRow = lines[1].split(',').map(c => c.replace(/"/g, ''));
    console.log(`✅ Data row has ${dataRow.length} values`);
    console.log(`   Product: ${dataRow[1]}`);
    console.log(`   Price: ${dataRow[4]}`);
    console.log(`   SKU: ${dataRow[6]}`);
  } else {
    console.log('❌ No data rows found');
  }
  
} else {
  console.log('❌ CSV file not found');
}

console.log('\n🎉 CSV validation test completed!'); 