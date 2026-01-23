import mysql from 'mysql2/promise';

// Encoded password for 's9G!uR#7XzqP$w4K&vL2mN' : ! -> %21, # -> %23, $ -> %24, & -> %26
const url = 'mysql://u966438854_jk:5vw=nSF*X=G$@srv2027.hstgr.io:3306/u966438854_LMS';

(async () => {
  try {
    console.log('Attempting to connect to DB...');
    const conn = await mysql.createConnection(url);
    console.log('Connected OK');
    const [rows] = await conn.execute('SELECT 1 as ok');
    console.log('Query result:', rows);
    await conn.end();
    console.log('Connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err && err.message ? err.message : err);
    // Print additional details for debugging (non-sensitive)
    if (err && err.code) console.error('Code:', err.code);
    process.exit(2);
  }
})();