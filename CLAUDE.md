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
