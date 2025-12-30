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
 * IDトークンを生成する（JWT形式、RS256署名）
 * @param options ID Token生成のオプション
 * @returns 生成されたID Token（JWT形式）
 */
export async function generateIdToken(options: GenerateIdTokenOptions): Promise<string> {
  throw new Error('Not implemented');
}
