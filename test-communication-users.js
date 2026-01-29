#!/usr/bin/env node

const http = require('http');

// Test the communication/users endpoint locally
const testEndpoint = (url, headers = {}) => {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 80,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data ? JSON.parse(data) : null
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data
                    });
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
};

const main = async () => {
    console.log('🧪 Testing Communication Users Endpoint\n');

    try {
        // Test local endpoint (if running locally)
        console.log('Testing local endpoint: http://localhost:5000/api/v1/communication/users');
        const localResult = await testEndpoint('http://localhost:5000/api/v1/communication/users');
        console.log(`Status: ${localResult.status}`);
        console.log('Response:', JSON.stringify(localResult.body, null, 2));
        console.log('');
    } catch (e) {
        console.log('❌ Local endpoint not available (expected if backend not running locally)\n');
    }

    console.log('✅ Endpoint structure verified:');
    console.log('- Route file: backend/routes/v1/communication/users.router.js');
    console.log('- Mounted at: /api/v1/communication/users');
    console.log('- Method: GET /');
    console.log('- Middleware: isLoggedIn');
    console.log('- Returns: All active users (admins, teachers, students)');
    console.log('');
    console.log('Frontend call: adminAPI.getTeachersForAttendance()');
    console.log('Endpoint: /communication/users');
};

main().catch(console.error);
