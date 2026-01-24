#!/usr/bin/env node
(async () => {
  const BASE = 'https://progresslms-backend.vercel.app/api/v1';

  async function doPost(path, body, headers = {}) {
    try {
      const res = await fetch(BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let data = text;
      try { data = JSON.parse(text); } catch (e) {}
      console.log(`${path} -> ${res.status}`);
      console.log(JSON.stringify(data, null, 2));
      return { status: res.status, data };
    } catch (err) {
      console.error(path + ' error:', err.message || err);
      return { status: 0, error: err };
    }
  }

  console.log('Checking original endpoints:');
  await doPost('/superadmin/login', { email: 'superadmin@progresslms.com', password: 'Superpass' });
  await doPost('/admin/login', { email: 'admin@starschool.com', password: 'admin123' });
  await doPost('/teachers/login', { email: 'ali.khan@starschool.com', password: 'teacher123' });
  await doPost('/students/login', { email: 'student1@starschool.com', password: 'student123' });

  console.log('\nChecking public endpoints:');
  await doPost('/public/superadmin/login', { email: 'superadmin@progresslms.com', password: 'Superpass' });
  await doPost('/public/admin/login', { email: 'admin@starschool.com', password: 'admin123' });
  await doPost('/public/teachers/login', { email: 'ali.khan@starschool.com', password: 'teacher123' });
  await doPost('/public/students/login', { email: 'student1@starschool.com', password: 'student123' });

  console.log('\nDone.');
})();
