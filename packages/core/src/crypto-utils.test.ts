import { describe, it, expect, beforeAll } from 'vitest';
import { sign, sha256, arrayBufferToBase64Url, stringToArrayBuffer } from './crypto-utils';

describe('crypto-utils', () => {
  describe('stringToArrayBuffer', () => {
    it('should convert a string to ArrayBuffer', () => {
      const str = 'Hello, World!';
      const buffer = stringToArrayBuffer(str);

      expect(buffer).toBeInstanceOf(ArrayBuffer);
      expect(buffer.byteLength).toBeGreaterThan(0);

      const decoder = new TextDecoder();
      const decoded = decoder.decode(buffer);
      expect(decoded).toBe(str);
    });

    it('should handle UTF-8 characters', () => {
      const str = 'こんにちは世界';
      const buffer = stringToArrayBuffer(str);

      const decoder = new TextDecoder();
      const decoded = decoder.decode(buffer);
      expect(decoded).toBe(str);
    });

    it('should handle empty string', () => {
      const str = '';
      const buffer = stringToArrayBuffer(str);

      expect(buffer).toBeInstanceOf(ArrayBuffer);
      expect(buffer.byteLength).toBe(0);
    });
  });

  describe('arrayBufferToBase64Url', () => {
    it('should convert ArrayBuffer to Base64URL format', () => {
      const encoder = new TextEncoder();
      const buffer = encoder.encode('Hello, World!').buffer;

      const base64Url = arrayBufferToBase64Url(buffer);

      expect(base64Url).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(base64Url).not.toContain('+');
      expect(base64Url).not.toContain('/');
      expect(base64Url).not.toContain('=');
    });

    it('should handle empty buffer', () => {
      const buffer = new ArrayBuffer(0);
      const base64Url = arrayBufferToBase64Url(buffer);

      expect(base64Url).toBe('');
    });

    it('should produce different outputs for different inputs', () => {
      const encoder = new TextEncoder();
      const buffer1 = encoder.encode('test1').buffer;
      const buffer2 = encoder.encode('test2').buffer;

      const base64Url1 = arrayBufferToBase64Url(buffer1);
      const base64Url2 = arrayBufferToBase64Url(buffer2);

      expect(base64Url1).not.toBe(base64Url2);
    });
  });

  describe('sha256', () => {
    it('should hash a string using SHA-256', async () => {
      const data = 'Hello, World!';
      const hash = await sha256(data);

      expect(hash).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(hash).toBeTruthy();
    });

    it('should produce consistent hashes for the same input', async () => {
      const data = 'test data';
      const hash1 = await sha256(data);
      const hash2 = await sha256(data);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', async () => {
      const data1 = 'test data 1';
      const data2 = 'test data 2';

      const hash1 = await sha256(data1);
      const hash2 = await sha256(data2);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', async () => {
      const data = '';
      const hash = await sha256(data);

      expect(hash).toBeTruthy();
      expect(hash).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should handle UTF-8 characters', async () => {
      const data = 'こんにちは世界';
      const hash = await sha256(data);

      expect(hash).toBeTruthy();
      expect(hash).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should produce known hash for PKCE verification', async () => {
      const codeVerifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
      const hash = await sha256(codeVerifier);

      expect(hash).toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
    });
  });

  describe('sign', () => {
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

    it('should sign data with a private key', async () => {
      const data = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0';

      const signature = await sign(data, privateKey);

      expect(signature).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(signature).toBeTruthy();
    });

    it('should produce verifiable signatures', async () => {
      const data = 'test data to sign';

      const signature = await sign(data, privateKey);

      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);

      const signatureBuffer = Uint8Array.from(
        atob(signature.replace(/-/g, '+').replace(/_/g, '/')),
        c => c.charCodeAt(0)
      );

      const isValid = await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        publicKey,
        signatureBuffer,
        dataBuffer
      );

      expect(isValid).toBe(true);
    });

    it('should produce different signatures for different data', async () => {
      const data1 = 'data 1';
      const data2 = 'data 2';

      const signature1 = await sign(data1, privateKey);
      const signature2 = await sign(data2, privateKey);

      expect(signature1).not.toBe(signature2);
    });

    it('should handle empty string', async () => {
      const data = '';

      const signature = await sign(data, privateKey);

      expect(signature).toBeTruthy();
      expect(signature).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('should handle UTF-8 characters', async () => {
      const data = 'こんにちは世界';

      const signature = await sign(data, privateKey);

      expect(signature).toBeTruthy();
      expect(signature).toMatch(/^[A-Za-z0-9_-]+$/);
    });
  });
});
