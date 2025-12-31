/**
 * 秘密鍵を用いてデータに署名を行う
 * @param data 署名対象のデータ
 * @param privateKey 秘密鍵（CryptoKey）
 * @returns 署名されたデータ（Base64URL形式）
 */
export async function sign(data: string, privateKey: CryptoKey): Promise<string> {
  throw new Error('Not implemented');
}

/**
 * SHA-256を用いてデータをハッシュ化する
 * @param data ハッシュ化対象のデータ
 * @returns ハッシュ値（Base64URL形式）
 */
export async function sha256(data: string): Promise<string> {
  throw new Error('Not implemented');
}

/**
 * ArrayBufferをBase64URL形式の文字列に変換する
 * @param buffer 変換対象のArrayBuffer
 * @returns Base64URL形式の文字列
 */
export function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  throw new Error('Not implemented');
}

/**
 * 文字列をArrayBufferに変換する
 * @param str 変換対象の文字列
 * @returns ArrayBuffer
 */
export function stringToArrayBuffer(str: string): ArrayBuffer {
  throw new Error('Not implemented');
}

/**
 * JWK（JSON Web Key）形式の文字列をCryptoKeyに変換する
 * @param jwkString JWK形式の文字列
 * @param algorithm アルゴリズム指定（デフォルト: RS256用）
 * @param extractable キーをエクスポート可能にするか（デフォルト: true）
 * @param keyUsages キーの用途（デフォルト: ['sign'] for private, ['verify'] for public）
 * @returns CryptoKey
 */
export async function importKeyFromJwk(
  jwkString: string,
  algorithm: RsaHashedImportParams = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256',
  },
  extractable = true,
  keyUsages?: KeyUsage[]
): Promise<CryptoKey> {
  throw new Error('Not implemented');
}

/**
 * CryptoKeyからRsaHashedImportParamsを導出する
 * 安全なアルゴリズム（RSASSA-PKCS1-v1_5, RSA-PSS）のみサポート
 * @param key CryptoKey
 * @returns RsaHashedImportParams
 * @throws サポートされていないアルゴリズムの場合
 */
export function extractAlgorithmParams(key: CryptoKey): RsaHashedImportParams {
  throw new Error('Not implemented');
}
