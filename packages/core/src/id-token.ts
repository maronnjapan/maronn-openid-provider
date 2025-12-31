/**
 * ID Tokenのペイロード
 */
export interface IdTokenPayload {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  iat: number;
  auth_time?: number;
  nonce?: string;
  acr?: string;
  amr?: string[];
  azp?: string;
  [key: string]: unknown;
}

/**
 * ID Token生成のオプション
 */
export interface GenerateIdTokenOptions {
  payload: IdTokenPayload;
  privateKey: CryptoKey;
  keyId?: string;
}

/**
 * IDトークンを生成する（JWT形式）
 * サポートする署名アルゴリズム:
 * - RSA: RS256, RS384, RS512 (RSASSA-PKCS1-v1_5)
 *   ※ OpenID Connect Core 1.0でRS256は必須アルゴリズム（OIDC Core Section 15.1）
 *   ※ Basic OP準拠のため、RS256のサポートは必須
 * - RSA: PS256, PS384, PS512 (RSA-PSS)
 *   ※ より安全性の証明が強固なアルゴリズム（推奨）
 * - ECDSA: ES256 (P-256), ES384 (P-384), ES512 (P-521)
 * @param options ID Token生成のオプション
 * @returns 生成されたID Token（JWT形式）
 */
export async function generateIdToken(options: GenerateIdTokenOptions): Promise<string> {
  throw new Error('Not implemented');
}
