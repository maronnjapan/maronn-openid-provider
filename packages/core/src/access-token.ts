/**
 * Access Tokenのペイロード
 */
export interface AccessTokenPayload {
  iss: string;
  sub: string;
  aud: string;
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
 * アクセストークンを生成する（JWT形式、RS256署名）
 * @param options Access Token生成のオプション
 * @returns 生成されたAccess Token（JWT形式）
 */
export async function generateAccessToken(options: GenerateAccessTokenOptions): Promise<string> {
  throw new Error('Not implemented');
}
