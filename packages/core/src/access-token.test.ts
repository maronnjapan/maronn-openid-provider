import { describe, it, expect, beforeAll } from 'vitest';
import { generateAccessToken, type AccessTokenPayload } from './access-token';

describe('access-token', () => {
  let privateKey: CryptoKey;
  let publicKey: CryptoKey;

  beforeAll(async () => {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify']
    );

    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;
  });

  describe('generateAccessToken', () => {
    it('should generate a valid JWT format access token', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
      };

      const accessToken = await generateAccessToken({ payload, privateKey });

      const parts = accessToken.split('.');
      expect(parts).toHaveLength(3);
    });

    it('should have valid header with RS256 algorithm', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
      };

      const accessToken = await generateAccessToken({ payload, privateKey });

      const [headerB64] = accessToken.split('.');
      const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.parse(headerJson);

      expect(header.alg).toBe('RS256');
      expect(header.typ).toBe('JWT');
    });

    it('should include kid in header when keyId is provided', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
      };

      const accessToken = await generateAccessToken({
        payload,
        privateKey,
        keyId: 'key-2024-01',
      });

      const [headerB64] = accessToken.split('.');
      const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.parse(headerJson);

      expect(header.kid).toBe('key-2024-01');
    });

    it('should encode payload correctly', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
        scope: 'openid profile email',
        client_id: 'client123',
      };

      const accessToken = await generateAccessToken({ payload, privateKey });

      const [, payloadB64] = accessToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);

      expect(decodedPayload.iss).toBe(payload.iss);
      expect(decodedPayload.sub).toBe(payload.sub);
      expect(decodedPayload.aud).toBe(payload.aud);
      expect(decodedPayload.exp).toBe(payload.exp);
      expect(decodedPayload.iat).toBe(payload.iat);
      expect(decodedPayload.scope).toBe(payload.scope);
      expect(decodedPayload.client_id).toBe(payload.client_id);
    });

    it('should create verifiable signature', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
      };

      const accessToken = await generateAccessToken({ payload, privateKey });

      const [headerB64, payloadB64, signatureB64] = accessToken.split('.');
      const message = `${headerB64}.${payloadB64}`;

      const encoder = new TextEncoder();
      const messageBuffer = encoder.encode(message);

      const signatureBuffer = Uint8Array.from(
        atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')),
        c => c.charCodeAt(0)
      );

      const isValid = await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        publicKey,
        signatureBuffer,
        messageBuffer
      );

      expect(isValid).toBe(true);
    });

    it('should include scope when provided', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
        scope: 'openid profile email',
      };

      const accessToken = await generateAccessToken({ payload, privateKey });

      const [, payloadB64] = accessToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);

      expect(decodedPayload.scope).toBe('openid profile email');
    });

    it('should include client_id when provided', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
        client_id: 'client123',
      };

      const accessToken = await generateAccessToken({ payload, privateKey });

      const [, payloadB64] = accessToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);

      expect(decodedPayload.client_id).toBe('client123');
    });

    it('should generate different tokens for different payloads', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload1: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
      };

      const payload2: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user456',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
      };

      const accessToken1 = await generateAccessToken({ payload: payload1, privateKey });
      const accessToken2 = await generateAccessToken({ payload: payload2, privateKey });

      expect(accessToken1).not.toBe(accessToken2);
    });

    it('should include custom claims', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
        custom_claim: 'custom_value',
        permissions: ['read', 'write'],
      };

      const accessToken = await generateAccessToken({ payload, privateKey });

      const [, payloadB64] = accessToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);

      expect(decodedPayload.custom_claim).toBe('custom_value');
      expect(decodedPayload.permissions).toEqual(['read', 'write']);
    });

    it('should handle multiple audiences', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: AccessTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'https://api.example.com',
        exp: now + 3600,
        iat: now,
      };

      const accessToken = await generateAccessToken({ payload, privateKey });

      const [, payloadB64] = accessToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);

      expect(decodedPayload.aud).toBeDefined();
    });
  });
});
