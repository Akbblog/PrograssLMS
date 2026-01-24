(async () => {
  try {
    const base = 'https://progresslms-backend.vercel.app/api/v1';
    const creds = { email: 'student1@starschool.com', password: 'student123' };

    const loginRes = await fetch(base + '/public/students/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    const loginJson = await loginRes.json();
    console.log('\nLOGIN:', loginJson);

    const token = loginJson.data?.token;
    const sid = loginJson.data?.student?.id;
    if (!token || !sid) {
      console.error('Missing token or student id');
      process.exit(1);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const paths = [
      '/enrollments/student/' + sid,
      '/grades/student/' + sid,
      '/students/' + sid,
    ];

    for (const p of paths) {
      const r = await fetch(base + p, { headers });
      const txt = await r.text();
      console.log('\nGET', p, '->', r.status);
      try {
        console.log(JSON.parse(txt));
      } catch (e) {
        console.log(txt);
      }
    }
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
