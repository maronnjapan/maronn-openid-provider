/**
 * Access Tokenのペイロード
 */
export interface AccessTokenPayload {
  iss: string;
  sub: string;
  aud: string[];
  exp: number;
  iat: number;
  scope?: string;
  client_id?: string;
  [key: string]: unknown;
}

/**
 * Access Token生成のオプション
 */
export interface GenerateAccessTokenOptions {
  payload: AccessTokenPayload;
  privateKey: CryptoKey;
  keyId?: string;
}

/**
 * アクセストークンを生成する（JWT形式）
 * サポートする署名アルゴリズム:
 * - RSA: RS256, RS384, RS512 (RSASSA-PKCS1-v1_5)
 *   ※ OpenID Connect/OAuth 2.1で広く使用されている標準アルゴリズム
 *   ※ ID Tokenとの一貫性のため、RS256をサポート
 * - RSA: PS256, PS384, PS512 (RSA-PSS)
 *   ※ より安全性の証明が強固なアルゴリズム（推奨）
 * - ECDSA: ES256 (P-256), ES384 (P-384), ES512 (P-521)
 * @param options Access Token生成のオプション
 * @returns 生成されたAccess Token（JWT形式）
 */
export async function generateAccessToken(options: GenerateAccessTokenOptions): Promise<string> {
  throw new Error('Not implemented');
}
