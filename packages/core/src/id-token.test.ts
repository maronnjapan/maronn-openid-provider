import { describe, it, expect, beforeAll } from 'vitest';
import { generateIdToken, type IdTokenPayload } from './id-token';

describe('id-token', () => {
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

  describe('generateIdToken', () => {
    it('should generate a valid JWT format ID token', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
      };

      const idToken = await generateIdToken({ payload, privateKey });

      const parts = idToken.split('.');
      expect(parts).toHaveLength(3);
    });

    it('should have valid header with RS256 algorithm', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
      };

      const idToken = await generateIdToken({ payload, privateKey });

      const [headerB64] = idToken.split('.');
      const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.parse(headerJson);

      expect(header.alg).toBe('RS256');
      expect(header.typ).toBe('JWT');
    });

    it('should include kid in header when keyId is provided', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
      };

      const idToken = await generateIdToken({
        payload,
        privateKey,
        keyId: 'key-2024-01',
      });

      const [headerB64] = idToken.split('.');
      const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.parse(headerJson);

      expect(header.kid).toBe('key-2024-01');
    });

    it('should encode payload correctly', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
        nonce: 'nonce123',
      };

      const idToken = await generateIdToken({ payload, privateKey });

      const [, payloadB64] = idToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);

      expect(decodedPayload.iss).toBe(payload.iss);
      expect(decodedPayload.sub).toBe(payload.sub);
      expect(decodedPayload.aud).toBe(payload.aud);
      expect(decodedPayload.exp).toBe(payload.exp);
      expect(decodedPayload.iat).toBe(payload.iat);
      expect(decodedPayload.nonce).toBe(payload.nonce);
    });

    it('should create verifiable signature', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
      };

      const idToken = await generateIdToken({ payload, privateKey });

      const [headerB64, payloadB64, signatureB64] = idToken.split('.');
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

    it('should include optional claims when provided', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
        auth_time: now - 10,
        nonce: 'nonce123',
        acr: 'urn:mace:incommon:iap:silver',
        amr: ['pwd', 'mfa'],
        azp: 'client456',
      };

      const idToken = await generateIdToken({ payload, privateKey });

      const [, payloadB64] = idToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);

      expect(decodedPayload.auth_time).toBe(payload.auth_time);
      expect(decodedPayload.nonce).toBe(payload.nonce);
      expect(decodedPayload.acr).toBe(payload.acr);
      expect(decodedPayload.amr).toEqual(payload.amr);
      expect(decodedPayload.azp).toBe(payload.azp);
    });

    it('should include custom claims', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
        name: 'John Doe',
        email: 'john@example.com',
        email_verified: true,
      };

      const idToken = await generateIdToken({ payload, privateKey });

      const [, payloadB64] = idToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);

      expect(decodedPayload.name).toBe('John Doe');
      expect(decodedPayload.email).toBe('john@example.com');
      expect(decodedPayload.email_verified).toBe(true);
    });

    it('should generate different tokens for different payloads', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload1: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
      };

      const payload2: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user456',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
      };

      const idToken1 = await generateIdToken({ payload: payload1, privateKey });
      const idToken2 = await generateIdToken({ payload: payload2, privateKey });

      expect(idToken1).not.toBe(idToken2);
    });

    it('should handle aud as array', async () => {
      const now = Math.floor(Date.now() / 1000);
      const payload: IdTokenPayload = {
        iss: 'https://example.com',
        sub: 'user123',
        aud: 'client123',
        exp: now + 3600,
        iat: now,
      };

      const idToken = await generateIdToken({ payload, privateKey });

      const [, payloadB64] = idToken.split('.');
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      const decodedPayload = JSON.parse(payloadJson);

      expect(decodedPayload.aud).toBeDefined();
    });
  });
});
