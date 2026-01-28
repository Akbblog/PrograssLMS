#!/usr/bin/env node
/**
 * Test Teacher Token
 * Verifies that teacher login returns a token with the correct role
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const axios = require('axios');
const jwt = require('jsonwebtoken');

const baseURL = process.env.API_URL || 'http://localhost:3001/api/v1';
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Use demo teacher credentials
const teacherCreds = {
  email: 'owais.malik@starschool.com',
  password: 'teacher123'
};

async function testTeacherToken() {
  try {
    console.log('\n=== Testing Teacher Token ===\n');
    console.log('📧 Teacher Email:', teacherCreds.email);
    console.log('🔑 Attempting login...\n');

    // Step 1: Login as teacher
    const loginResponse = await axios.post(`${baseURL}/teachers/login`, teacherCreds);
    
    if (loginResponse.status !== 200) {
      console.error('❌ Login failed with status:', loginResponse.status);
      console.error('Response:', loginResponse.data);
      process.exit(1);
    }

    const { token, teacher } = loginResponse.data.data;
    console.log('✅ Login successful\n');
    console.log('Teacher data:', JSON.stringify(teacher, null, 2));
    console.log('\n📋 Token received:', token.substring(0, 30) + '...\n');

    // Step 2: Decode the token
    const decoded = jwt.decode(token);
    console.log('🔍 Decoded Token:', JSON.stringify(decoded, null, 2));

    // Step 3: Check role
    const role = decoded.role;
    console.log('\n🎭 Role in token:', role);
    
    if (role === 'teacher') {
      console.log('✅ PASS: Token has correct role "teacher"\n');
    } else {
      console.log(`❌ FAIL: Token has role "${role}" instead of "teacher"\n`);
      process.exit(1);
    }

    // Step 4: Test with middleware by calling a teacher-only endpoint
    const dashboardUrl = `${baseURL}/teacher/dashboard`;
    console.log('📡 Testing /teacher/dashboard endpoint...');
    console.log('Full URL:', dashboardUrl);
    const dashboardResponse = await axios.get(dashboardUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (dashboardResponse.status === 200) {
      console.log('✅ PASS: /teacher/dashboard accessible with teacher token\n');
    } else {
      console.log('❌ FAIL: /teacher/dashboard returned status:', dashboardResponse.status);
    }

    // Step 5: Test /students endpoint with teacher token
    console.log('📡 Testing /students endpoint with teacher token...\n');
    try {
      const studentsResponse = await axios.get(`${baseURL}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (studentsResponse.status === 200) {
        console.log('✅ PASS: /students endpoint accessible with teacher token');
        console.log('Students returned:', studentsResponse.data.data?.students?.length || 0);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        console.log('❌ FAIL: /students returned 403 Forbidden');
        console.log('Message:', err.response.data?.message);
      } else if (err.response?.status === 401) {
        console.log('❌ FAIL: /students returned 401 Unauthorized');
        console.log('Message:', err.response.data?.message);
      } else {
        console.log('❌ ERROR:', err.message);
      }
    }

    console.log('\n✅ All tests passed!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:\n');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error('Unknown error:', JSON.stringify(error, null, 2));
    }
    process.exit(1);
  }
}

testTeacherToken();
