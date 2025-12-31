# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクトについて

OpenID ConnectにおけるOpenID Provider(OP)の機能を実装するプロジェクトです。
OpenID Connect Conformance Profiles v3.0のBasic OpenID Providerを準拠満たすための実装を行います。
どの環境でも動くことを目指し、Web標準技術のみを用いて開発を行います。
また、外部ライブラリに依存しないことを目指します。

## 実装におけるルール

実装する際は以下のルールを必ず守ってください。
- コマンドはpnpmを使用すること
- dependenciesは内部ライブラリをのみ使用し、外部ライブラリは使用しないこと
- devDependenciesは任意の外部ライブラリを使用してもよい
- t_wada が言っている方法でテスト駆動開発を行うこと

## テストコードの書き方

### テストケースの命名規則

テストケースは以下のルールに従って記述すること：

1. **テストケース名は「should + 動詞」形式で記述する**
   - ❌ 悪い例: `it('alg claim', () => {})`
   - ✅ 良い例: `it('should set alg claim to RS256', () => {})`

2. **何をテストするのか、主語と動詞で明確にする**
   - テストケースを読んだだけで、何を検証するのかが分かるようにする
   - 実装の意図が明確になるように記述する

3. **テスト構造は以下の階層で構成する**
   - **トップレベル**: 関数名の `describe`
   - **中間レベル**: テストカテゴリの `describe`（省略可）
   - **最下層**: 具体的なテストケースの `it`

### テストケース記述例

```typescript
describe('generateIdToken', () => {
  describe('JOSE Header', () => {
    it('should set alg claim to RS256', () => {});
    it('should include kid claim when keyId is provided', () => {});
    it('should set typ claim to JWT', () => {});
  });

  describe('Required Claims', () => {
    it('should include iss matching configured issuer', () => {});
    it('should reject missing iss', () => {});
  });
});
```

### コメントの記述

- 標準化されたクレームや特別な理由がある場合は、コメントで理由を明記する
- 仕様書のセクション番号を参照する場合は、コメントに記載する

```typescript
// Standard profile claims (profile scope) - OIDC Core Section 5.4
// These are standardized claims that require specific handling
it('should include name claim when profile scope is requested', () => {});
```

### 実装不可能なテストケースの扱い

- 関数単体では実装できないテストケース（外部依存が必要なもの）は記述しない
- 例: リクエスト情報が必要なテストは、統合テストで記述する

## コマンド

```bash
# 依存関係のインストール
pnpm install

# テストの実行（設定後）
pnpm test

# 特定のパッケージでコマンドを実行
pnpm --filter <package-name> <command>
```

## アーキテクチャ

- **モノレポ構成**: `packages/*`にパッケージを配置
- **Web標準技術のみ**: Node.js固有のAPIではなくWeb標準API（Fetch API、Web Crypto API等）を使用
- **外部依存なし**: productionの依存関係（dependencies）には外部ライブラリを使用しない

## 準拠仕様

- OpenID Connect Core 1.0
- OAuth 2.1（PKCE必須）
- OpenID Connect Conformance Profiles v3.0 (Basic OP)

### Basic OPの必須機能

- Authorization Code Flow (`response_type=code`)
- PKCE（S256必須）
- ID Token署名（RS256必須）
- Token Endpoint
- UserInfo Endpoint
- `prompt`パラメータ対応（none, login, consent, select_account）
