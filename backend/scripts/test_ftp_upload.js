require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Client = require('basic-ftp');

async function run() {
  const host = process.env.FTP_HOST;
  const user = process.env.FTP_USER;
  const password = process.env.FTP_PASSWORD;
  const port = process.env.FTP_PORT ? parseInt(process.env.FTP_PORT, 10) : 21;
  const folder = process.env.FTP_FOLDER || '/public_html';

  if (!host || !user || !password) {
    console.error('FTP credentials missing in .env');
    process.exit(2);
  }

  const local = path.join(__dirname, '..', 'uploads', 'test-cards.zip');
  if (!fs.existsSync(local)) {
    console.error('Local file not found:', local);
    process.exit(3);
  }

  const client = new Client.Client();
  client.ftp.verbose = true;
  try {
    console.log('Connecting to', host, 'port', port);
    await client.access({ host, port, user, password, secure: false });
    console.log('Connected. Ensuring directory', folder);
    await client.ensureDir(folder);
    const remoteName = 'test-cards.zip';
    console.log('Uploading', local, '->', folder + '/' + remoteName);
    await client.uploadFrom(local, remoteName);
    console.log('Upload complete');
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('FTP upload failed:', err.message || err);
    try { await client.close(); } catch(e){}
    process.exit(1);
  }
}

run();
