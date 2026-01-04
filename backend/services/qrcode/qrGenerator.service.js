const QRCode = require('qrcode');
const crypto = require('crypto');

function encryptPayload(payload) {
  const secret = process.env.QR_SECRET || 'changeme';
  try {
    const iv = crypto.randomBytes(12);
    const key = crypto.createHash('sha256').update(secret).digest();
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const text = JSON.stringify(payload);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  } catch (err) {
    // fallback
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}

function decryptPayload(token) {
  const secret = process.env.QR_SECRET || 'changeme';
  try {
    const data = Buffer.from(token, 'base64');
    const iv = data.slice(0, 12);
    const tag = data.slice(12, 28);
    const encrypted = data.slice(28);
    const key = crypto.createHash('sha256').update(secret).digest();
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const decoded = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
    return JSON.parse(decoded);
  } catch (err) {
    try { return JSON.parse(Buffer.from(token, 'base64').toString('utf8')); } catch (e) { return null; }
  }
}

async function generateQRCodeImage(payload) {
  const data = encryptPayload(payload);
  const dataUrl = await QRCode.toDataURL(data);
  return { data, dataUrl };
}

module.exports = { encryptPayload, decryptPayload, generateQRCodeImage };