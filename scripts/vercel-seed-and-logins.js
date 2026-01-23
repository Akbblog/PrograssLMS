(async () => {
  const BASE = 'https://progresslms-backend.vercel.app/api/v1';
  const SEED_SECRET = 'islamic-school-seed-2025';

  async function doPost(path, body, headers = {}){
    try {
      const res = await fetch(BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body)
      });
      const text = await res.text();
      let data = text;
      try { data = JSON.parse(text); } catch (e) {}
      console.log(`\n[POST ${path}] -> ${res.status}`);
      console.log(JSON.stringify(data, null, 2));
      return { status: res.status, data };
    } catch (err) {
      console.error(`\n[POST ${path}] error:`, err.message || err);
      if (err.stack) console.error(err.stack);
      return { status: 0, data: null, error: err };
    }
  }

  console.log('Sending seed request...');
  await doPost('/seed', {}, { Authorization: `Bearer ${SEED_SECRET}` });

  console.log('\nTesting logins...');
  await doPost('/superadmin/login', { email: 'superadmin@progresslms.com', password: 'Superpass' });
  await doPost('/admin/login', { email: 'admin@alnoor-academy.edu', password: 'admin123' });
  await doPost('/teachers/login', { email: 'ali.khan@starschool.com', password: 'teacher123' });
  await doPost('/students/login', { email: 'student1@starschool.com', password: 'student123' });

  console.log('\nDone.');
})();
