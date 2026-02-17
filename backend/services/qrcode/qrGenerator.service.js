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

/**
 * Generate a checksum for QR integrity validation.
 */
function generateChecksum(payload) {
  const str = `${payload.id}${payload.type}${payload.schoolId || ''}`;
  return crypto.createHash('sha256').update(str).digest('hex').slice(0, 8);
}

/**
 * Enrich a basic QR payload with attendance-ready fields.
 * Input:  { id, type, schoolId?, cardVersion?, templateVersion? }
 * Output: enriched payload with nonce, checksum, timestamps
 */
function enrichPayload(payload) {
  return {
    id: payload.id,
    type: payload.type,
    schoolId: payload.schoolId || null,
    cardVersion: payload.cardVersion || 1,
    templateVersion: payload.templateVersion || 1,
    generatedAt: Math.floor(Date.now() / 1000),
    nonce: crypto.randomBytes(8).toString('hex'),
    checksum: generateChecksum(payload),
    expiresAt: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year
  };
}

async function generateQRCodeImage(payload) {
  const enriched = enrichPayload(payload);
  const data = encryptPayload(enriched);
  const dataUrl = await QRCode.toDataURL(data, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 200,
  });
  return { data, dataUrl, payload: enriched };
}

/**
 * Validate a decoded QR payload for attendance scanning.
 */
function validateQRPayload(decoded) {
  if (!decoded || !decoded.id || !decoded.type) {
    return { valid: false, error: 'Invalid QR format' };
  }

  // Check expiration
  if (decoded.expiresAt && decoded.expiresAt < Math.floor(Date.now() / 1000)) {
    return { valid: false, error: 'QR code has expired' };
  }

  // Verify checksum
  if (decoded.checksum) {
    const calculated = generateChecksum({
      id: decoded.id,
      type: decoded.type,
      schoolId: decoded.schoolId,
    });
    if (calculated !== decoded.checksum) {
      return { valid: false, error: 'QR code checksum invalid - possible tampering' };
    }
  }

  return { valid: true, payload: decoded };
}

module.exports = { encryptPayload, decryptPayload, generateQRCodeImage, validateQRPayload, generateChecksum, enrichPayload };
