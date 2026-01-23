(async () => {
  const base = process.env.BASE || 'http://localhost:3001';
  const tests = [
    { name: 'Superadmin', url: '/api/v1/auth/admin/login', body: { email: 'SA@progresslms.com', password: 'Superpass' } },
    { name: 'Star School Admin', url: '/api/v1/auth/admin/login', body: { email: 'admin@starschool.com', password: 'admin123' } },
    { name: 'Teacher', url: '/api/v1/teachers/login', body: { email: 'ali.khan@starschool.com', password: 'teacher123' } },
    { name: 'Student', url: '/api/v1/auth/student/login', body: { email: 'student1@starschool.com', password: 'student123' } },
  ];

  for (const t of tests) {
    try {
      const res = await fetch(base + t.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t.body),
      });
      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) data = await res.json();
      else data = await res.text();
      console.log(`--- ${t.name} -> ${t.url} [${res.status}]`);
      console.log(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(`Error testing ${t.name}:`, err.message || err);
      if (err && err.stack) console.error(err.stack);
    }
  }
})();
