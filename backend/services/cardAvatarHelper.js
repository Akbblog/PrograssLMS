/**
 * Helper to convert avatar URLs to base64 data URIs for PDF rendering.
 * @react-pdf/renderer requires base64 data URIs for images from URLs.
 */
async function resolveAvatarToBase64(avatarUrl) {
  if (!avatarUrl || typeof avatarUrl !== 'string') return null;

  // Already a data URI
  if (avatarUrl.startsWith('data:')) return avatarUrl;

  // Not a URL - might be a local path or empty string
  if (!avatarUrl.startsWith('http')) return null;

  try {
    const response = await fetch(avatarUrl, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (e) {
    console.warn('Failed to convert avatar to base64:', e.message);
    return null;
  }
}

module.exports = { resolveAvatarToBase64 };
