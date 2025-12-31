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
 * @param algorithm アルゴリズム指定（デフォルト: RS256用 RSASSA-PKCS1-v1_5 with SHA-256）
 *                  サポートするアルゴリズム:
 *                  - RSA: RSASSA-PKCS1-v1_5 (RS256/RS384/RS512)
 *                    ※ OpenID Connect Core 1.0でRS256は必須アルゴリズム（OIDC Core Section 15.1）
 *                    ※ 適切に実装されている場合、実用的な攻撃は知られていない
 *                  - RSA: RSA-PSS (PS256/PS384/PS512)
 *                    ※ より新しく、安全性の証明がより強固なアルゴリズム
 *                  - ECDSA: ES256 (P-256), ES384 (P-384), ES512 (P-521)
 * @param extractable キーをエクスポート可能にするか（デフォルト: true）
 * @param keyUsages キーの用途（デフォルト: ['sign'] for private, ['verify'] for public）
 * @returns CryptoKey
 */
export async function importKeyFromJwk(
  jwkString: string,
  algorithm: RsaHashedImportParams | EcKeyImportParams = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256',
  },
  extractable = true,
  keyUsages?: KeyUsage[]
): Promise<CryptoKey> {
  throw new Error('Not implemented');
}

/**
 * CryptoKeyからアルゴリズムパラメータを導出する
 * サポートする安全なアルゴリズム:
 * - RSA: RSASSA-PKCS1-v1_5 (SHA-256/384/512)
 *   ※ OpenID Connect Core 1.0でRS256は必須（OIDC Core Section 15.1）
 * - RSA: RSA-PSS (SHA-256/384/512)
 *   ※ RSASSA-PKCS1-v1_5よりも安全性の証明が強固
 * - ECDSA: P-256, P-384, P-521 (SHA-256/384/512)
 * @param key CryptoKey
 * @returns RsaHashedImportParams | EcKeyImportParams
 * @throws サポートされていないアルゴリズムの場合
 */
export function extractAlgorithmParams(key: CryptoKey): RsaHashedImportParams | EcKeyImportParams {
  throw new Error('Not implemented');
}
