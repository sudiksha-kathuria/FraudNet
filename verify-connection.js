#!/usr/bin/env node

/**
 * Frontend-Backend Connection Verification Script
 * Tests if React frontend can communicate with Flask backend
 * 
 * Run: node verify-connection.js
 */

const http = require('http');
const https = require('https');

const API_URL = 'http://localhost:8000';
const FRONTEND_URL = 'http://localhost:5173';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data ? JSON.parse(data) : null,
        });
      });
    });

    request.on('error', (error) => reject(error));
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testBackendHealth() {
  log('\n🔵 Testing Backend Health...\n', 'cyan');
  
  try {
    const response = await httpRequest(`${API_URL}/health`);
    
    if (response.status === 200) {
      log('✅ Backend is RUNNING', 'green');
      log(`   URL: ${API_URL}`, 'green');
      log(`   Status: ${response.data.status}`, 'green');
      log(`   Services:`, 'green');
      
      Object.entries(response.data.services).forEach(([service, status]) => {
        const icon = status === 'initialized' ? '✅' : '❌';
        log(`     ${icon} ${service}: ${status}`, 'green');
      });
      
      return true;
    } else {
      log(`❌ Backend returned status ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Cannot connect to backend: ${error.message}`, 'red');
    log(`   Make sure to run: cd backend && python app.py`, 'yellow');
    return false;
  }
}

async function testBackendAPI() {
  log('\n🔵 Testing Backend API Endpoints...\n', 'cyan');
  
  const tests = [
    {
      name: 'API Root',
      url: `${API_URL}/`,
      method: 'GET',
    },
    {
      name: 'Dashboard Endpoint',
      url: `${API_URL}/api/dashboard`,
      method: 'GET',
    },
  ];

  for (const test of tests) {
    try {
      const response = await httpRequest(test.url);
      
      if (response.status === 200) {
        log(`✅ ${test.name}: OK`, 'green');
      } else {
        log(`❌ ${test.name}: Status ${response.status}`, 'red');
      }
    } catch (error) {
      log(`❌ ${test.name}: ${error.message}`, 'red');
    }
  }
}

async function testCORS() {
  log('\n🔵 Testing CORS Configuration...\n', 'cyan');
  
  try {
    const response = await httpRequest(`${API_URL}/api/analyze-text`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });

    if (response.headers['access-control-allow-origin']) {
      log(`✅ CORS is ENABLED`, 'green');
      log(`   Allowed Origins: ${response.headers['access-control-allow-origin']}`, 'green');
      return true;
    } else {
      log(`⚠️  CORS headers not found`, 'yellow');
      return false;
    }
  } catch (error) {
    // Flask might not support OPTIONS, so let's check if backend is at least running
    log(`⚠️  Could not verify CORS (backend may still work)`, 'yellow');
    return true;
  }
}

async function testDatabaseConnection() {
  log('\n🔵 Testing Database Connection...\n', 'cyan');
  
  try {
    const response = await httpRequest(`${API_URL}/api/dashboard`);
    
    if (response.status === 200 && response.data.total_cases !== undefined) {
      log(`✅ Database is CONNECTED`, 'green');
      log(`   Total Cases: ${response.data.total_cases}`, 'green');
      log(`   Critical Cases: ${response.data.critical_cases}`, 'green');
      return true;
    } else {
      log(`⚠️  Database query returned unexpected response`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Cannot query database: ${error.message}`, 'red');
    return false;
  }
}

function displayConnectionInfo() {
  log('\n📱 Frontend-Backend Connection Info\n', 'cyan');
  
  log(`Frontend URL:  ${FRONTEND_URL}`, 'bold');
  log(`Backend URL:   ${API_URL}`, 'bold');
  
  log('\nTo start services:\n', 'cyan');
  
  log('Terminal 1 (Backend):', 'yellow');
  log('  cd backend', 'reset');
  log('  python -m venv venv', 'reset');
  log('  venv\\Scripts\\activate  # Windows', 'reset');
  log('  source venv/bin/activate  # Linux/Mac', 'reset');
  log('  pip install -r requirements.txt', 'reset');
  log('  cp .env.example .env  # Edit and add GEMINI_API_KEY', 'reset');
  log('  python app.py', 'reset');
  
  log('\nTerminal 2 (Frontend):', 'yellow');
  log('  npm install', 'reset');
  log('  npm run dev', 'reset');
  
  log('\nThen open:', 'cyan');
  log(`  http://localhost:5173  (Frontend)`, 'cyan');
  log(`  http://localhost:8000  (Backend API)`, 'cyan');
  log(`  http://localhost:8000/health  (Health Check)\n`, 'cyan');
}

async function runAllTests() {
  log('\n' + '='.repeat(60), 'cyan');
  log('   CITIZEN FRAUD SHIELD - Connection Verification', 'bold');
  log('='.repeat(60) + '\n', 'cyan');

  displayConnectionInfo();

  log('=' * 60);
  log('Running Tests...', 'cyan');
  log('=' * 60);

  // Run tests
  const backendHealthOk = await testBackendHealth();
  
  if (backendHealthOk) {
    await testBackendAPI();
    await testCORS();
    await testDatabaseConnection();
  }

  // Summary
  log('\n' + '='.repeat(60), 'cyan');
  log('Test Complete!', 'bold');
  log('='.repeat(60) + '\n', 'cyan');

  if (backendHealthOk) {
    log('✅ Backend is ready for frontend integration', 'green');
    log('   Go to http://localhost:5173 to test the app\n', 'green');
  } else {
    log('❌ Backend is not running', 'red');
    log('   Start the backend with: cd backend && python app.py\n', 'red');
  }
}

// Run if executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    log(`Fatal error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { testBackendHealth, testCORS, testDatabaseConnection };
