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
 * サポートする署名アルゴリズム（JWA名称 = 暗号方式）:
 * - RS256/RS384/RS512 = RSASSA-PKCS1-v1_5 with SHA-256/384/512
 *   ※ OpenID Connect Core 1.0でRS256はデフォルトアルゴリズム（SHOULD）
 *   ※ 広く使用されているが、より安全なPS/ESの使用を推奨
 * - PS256/PS384/PS512 = RSA-PSS with SHA-256/384/512【推奨】
 *   ※ RSASSA-PKCS1-v1_5より安全性の証明が強固
 * - ES256/ES384/ES512 = ECDSA with P-256/P-384/P-521 and SHA-256/384/512【推奨】
 *   ※ 楕円曲線暗号による高速かつ安全な署名方式
 * @param options ID Token生成のオプション
 * @returns 生成されたID Token（JWT形式）
 */
export async function generateIdToken(options: GenerateIdTokenOptions): Promise<string> {
  throw new Error('Not implemented');
}
