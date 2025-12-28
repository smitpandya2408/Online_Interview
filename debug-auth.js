// Simple test to check authentication
const bcrypt = require('bcryptjs');

async function testAuth() {
  console.log('Testing authentication...');
  
  // Test password comparison
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password comparison result:', isValid);
}

testAuth().catch(console.error);
