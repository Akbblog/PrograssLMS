/**
 * Test Login Endpoints with Seeded Data
 */
const http = require('http');

function testLogin(email, password, endpoint) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ email, password });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ 
            endpoint, 
            email, 
            status: res.statusCode, 
            success: result.success, 
            token: result.data?.token ? result.data.token.substring(0, 20) + '...' : 'N/A',
            message: result.message 
          });
        } catch (e) {
          resolve({ endpoint, email, status: res.statusCode, success: false, error: body });
        }
      });
    });

    req.on('error', (e) => resolve({ endpoint, email, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 === Testing Login Endpoints ===\n');
  
  const results = await Promise.all([
    testLogin('admin@alnoor-academy.edu', 'admin123', '/api/v1/auth/admin/login'),
    testLogin('hassan.rashid@islamic-school.edu', 'password123', '/api/v1/auth/teacher/login'),
    testLogin('amr.abdullah@islamic-school.edu', 'password123', '/api/v1/auth/student/login'),
    testLogin('SA@progresslms.com', 'Superpass', '/api/v1/auth/superadmin/login')
  ]);

  console.log('Results:\n');
  results.forEach(r => {
    if (r.error) {
      console.log(`❌ ${r.endpoint} - ${r.email}`);
      console.log(`   Error: ${r.error}\n`);
    } else {
      const status = r.status === 200 ? '✅' : '❌';
      console.log(`${status} ${r.endpoint}`);
      console.log(`   Email: ${r.email}`);
      console.log(`   Status: ${r.status}`);
      console.log(`   Success: ${r.success}`);
      if (r.token && r.token !== 'N/A') console.log(`   Token: ${r.token}`);
      if (r.message) console.log(`   Message: ${r.message}`);
      console.log();
    }
  });
  
  process.exit(0);
}

// Wait a moment for server to be ready
setTimeout(runTests, 1000);
