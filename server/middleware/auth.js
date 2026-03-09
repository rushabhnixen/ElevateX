// TODO: Replace with proper Clerk JWT verification in production.
// In production, verify the token against the Clerk JWKS endpoint or
// use the Clerk SDK: import { verifyToken } from '@clerk/backend'.
export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // Stub: production code must validate the JWT signature and extract the sub claim.
  // Do NOT use the raw token string as an identity in production.
  try {
    // Decode payload (base64url) without verifying signature — for dev only.
    const payload = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString());
    if (!payload?.sub) throw new Error('Missing sub claim');
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
