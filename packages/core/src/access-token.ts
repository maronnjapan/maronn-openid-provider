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
 * - RSA: PS256, PS384, PS512 (RSA-PSS)
 * - ECDSA: ES256 (P-256), ES384 (P-384), ES512 (P-521)
 * @param options Access Token生成のオプション
 * @returns 生成されたAccess Token（JWT形式）
 */
export async function generateAccessToken(options: GenerateAccessTokenOptions): Promise<string> {
  throw new Error('Not implemented');
}
