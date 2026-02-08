<div align="center">

<!-- ヘッダーバナー -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,19,20,24&height=200&section=header&text=Assertion%20Engine&fontSize=60&fontAlignY=35&animation=fadeIn&desc=AI駆動型学術研究検証プラットフォーム&descAlignY=55&descSize=18" width="100%" />

<!-- 言語切り替え -->
<br/>

[![英語版](https://img.shields.io/badge/🇺🇸_英語版-クリックして切替-64748B?style=for-the-badge&labelColor=1E293B)](./README.md)
[![日本語版](https://img.shields.io/badge/🇯🇵_日本語版-現在表示中-10B981?style=for-the-badge&labelColor=1E293B)](./README_JP.md)

<br/>

<!-- テクノロジーバッジ -->
![Gemini 3](https://img.shields.io/badge/Gemini_3-Google_DeepMind-4285F4?style=flat-square&logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-認証-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)

<br/>

<!-- アクションボタン -->
[![ライブデモ](https://img.shields.io/badge/🚀_ライブデモを見る-00C853?style=for-the-badge&labelColor=1E293B)](https://assertionengine.vercel.app/)
[![ソースコード](https://img.shields.io/badge/📂_ソースコード-181717?style=for-the-badge&logo=github)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind)
[![ハッカソン](https://img.shields.io/badge/🏆_ハッカソン-8B5CF6?style=for-the-badge)](https://gemini3.devpost.com/)

</div>

---

## 📋 目次

- [🎯 概要](#-概要)
- [🚨 問題提起](#-問題提起)
- [✨ 機能一覧](#-機能一覧)
- [🏗 システム構成](#-システム構成)
- [🛠 使用技術](#-使用技術)
- [🚀 セットアップ方法](#-セットアップ方法)
- [📁 ディレクトリ構成](#-ディレクトリ構成)
- [🎬 デモ](#-デモ)
- [👤 開発者情報](#-開発者情報)
- [📄 ライセンス](#-ライセンス)

---

## 🎯 概要

**Assertion Engine**は、Google DeepMindが主催する**Gemini 3 ハッカソン**向けに構築された次世代の研究検証プラットフォームです。

研究者が時間、資金、評判を投資する前に、**仮説の妥当性を事前検証**することができます。

**Gemini 3 API**を活用し、以下の機能を提供します：
- 学術論文の分析
- 論理的脆弱性の特定
- 既存研究との重複チェック
- 改善案の提示

### 🔑 コアモジュール

| モジュール名 | 機能説明 |
|-------------|---------|
| 🧠 **メンターAI** | 学術AIによる即時フィードバック |
| 🔬 **標本ラボ** | 制御環境でのデータサンプル検証 |
| ⚔️ **戦略デュエル** | 競合理論との方法論比較 |
| 📊 **新規性スキャナー** | 公開前の先行研究衝突検出 |

---

## 🚨 問題提起

学術研究者が直面する重大な課題：

| 課題 | 具体的な影響 |
|------|------------|
| ❌ **リソースの浪費** | 欠陥のある仮説に数ヶ月の時間を費やす |
| ❌ **評判の毀損** | 容易に反論される主張を公開してしまう |
| ❌ **新規性の問題** | 出版後に類似の先行研究が発覚する |
| ❌ **論理的欠陥** | 方法論上の問題が見過ごされる |

> **従来の手動検証は時間がかかり、ミスも発生しやすい。**
> 
> Assertion Engineは検証プロセスを自動化し、時間を節約し、研究の質を向上させます。

---

## ✨ 機能一覧

| 機能名 | 機能説明 |
|-------|---------|
| 🔐 **ユーザー認証** | Supabaseによる安全なログイン・登録 |
| 📝 **プロジェクト管理** | 研究プロジェクトの作成・管理・追跡 |
| 🧠 **AI分析** | Gemini 3によるAI駆動の仮説検証 |
| 🔬 **標本ラボ** | 対話型データサンプルテスト環境 |
| 📊 **新規性スキャン** | 類似度スコアによる先行研究検出 |
| ⚔️ **戦略デュエル** | 競合理論との方法論ストレステスト |
| 📈 **リアルタイム指標** | 信頼度・論理一貫性・新規性スコア |
| 🎨 **高品質UI** | 滑らかなアニメーション付きモダンデザイン |

---

## 🏗 システム構成

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           フロントエンド                                  │
│                    React + TypeScript + Vite                            │
│         トップページ │ ダッシュボード │ 分析画面 │ 新規性スキャナー         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌───────────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│    Supabase 認証      │ │  Supabase DB    │ │   Gemini 3 API      │
│                       │ │                 │ │                     │
│ • ユーザー管理        │ │ • ユーザー情報   │ │ • 仮説の検証         │
│ • 認証トークン        │ │ • プロジェクト   │ │ • 新規性の分析       │
│ • セッション管理      │ │ • 分析結果       │ │ • リスク評価         │
└───────────────────────┘ └─────────────────┘ └─────────────────────┘
```

---

## 🛠 使用技術

| カテゴリ | 技術名 | 用途 |
|---------|--------|------|
| **画面** | React 18 + TypeScript | コンポーネントベースのUI構築 |
| **ビルド** | Vite 5 | 高速な開発環境・本番ビルド |
| **デザイン** | Tailwind CSS + 独自CSS | モダンなレスポンシブデザイン |
| **アニメーション** | Framer Motion | 滑らかな画面遷移・効果 |
| **認証・DB** | Supabase | ユーザー認証とPostgreSQLデータベース |
| **AI** | Google Gemini 3 API | 仮説検証と分析エンジン |
| **公開** | Vercel | グローバルCDNによる高速配信 |

---

## 🚀 セットアップ方法

### 必要な環境

- Node.js（バージョン18以上）
- npm または yarn
- Supabaseアカウント
- Google Gemini APIキー

### インストール手順

```bash
# 1. リポジトリをダウンロード
git clone https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind.git
cd Assertion-Engine_Gemini_Hackathon_Google_Deepmind

# 2. 必要なパッケージをインストール
npm install

# 3. 設定ファイルを作成
cp .env.example .env.local
```

### 環境変数の設定

`.env.local` ファイルを編集してください：

```env
VITE_SUPABASE_URL=あなたのSupabase_URL
VITE_SUPABASE_ANON_KEY=あなたのSupabase匿名キー
VITE_GEMINI_API_KEY=あなたのGemini_APIキー
```

### 開発サーバーの起動

```bash
# 開発モードで起動
npm run dev

# 本番用にビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

---

## 📁 ディレクトリ構成

```
assertion-engine/
├── components/
│   ├── Hero.tsx              # トップページのヒーローセクション
│   ├── Navbar.tsx            # ナビゲーションバー
│   ├── Dashboard.tsx         # メインダッシュボード
│   ├── AnalysisPage.tsx      # AI分析画面
│   ├── NoveltyPage.tsx       # 新規性スキャナー
│   ├── SpecimenLab.tsx       # 標本ラボ
│   └── ...                   # その他のコンポーネント
├── lib/
│   ├── supabase.ts           # Supabase接続設定
│   └── gemini.ts             # Gemini API連携
├── App.tsx                   # メインルーター
├── AppContext.tsx            # グローバル状態管理
├── index.css                 # 共通スタイル
└── package.json              # 依存関係定義
```

---

## 🎬 デモ

<div align="center">

[![デモを試す](https://img.shields.io/badge/🚀_今すぐ試す-10B981?style=for-the-badge&labelColor=1E293B)](https://assertionengine.vercel.app/)

</div>

### 使い方の流れ

1. **アカウント作成** — メールアドレスで登録
2. **プロジェクト作成** — 研究仮説を入力
3. **AI分析を実行** — 即座にフィードバックを取得
4. **新規性スキャン** — 先行研究との衝突を確認
5. **結果を確認** — 信頼度スコアを表示

---

## 👤 開発者情報

<div align="center">
<table>
<tr>
<td align="center">
  <a href="https://github.com/shafayatsaad">
    <img src="https://github.com/shafayatsaad.png" width="120px" style="border-radius: 50%;" alt="Shafayat Saad"/>
    <br />
    <strong>Shafayat Saad</strong>
  </a>
  <br />
  <sub>フルスタックエンジニア</sub>
  <br /><br />
  <a href="https://github.com/shafayatsaad">
    <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/shafayatsaad/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://shafayatsaad.vercel.app/">
    <img src="https://img.shields.io/badge/ポートフォリオ-000?style=flat-square&logo=vercel&logoColor=white" alt="ポートフォリオ" />
  </a>
  <a href="mailto:shafayat.saad30@gmail.com">
    <img src="https://img.shields.io/badge/メール-EA4335?style=flat-square&logo=gmail&logoColor=white" alt="メール" />
  </a>
</td>
</tr>
</table>
</div>

---

## 🏆 ハッカソン情報

<div align="center">

[![Gemini 3 ハッカソン](https://img.shields.io/badge/Google_DeepMind-Gemini_3_ハッカソン-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gemini3.devpost.com/)

</div>

このプロジェクトは**Google DeepMind**主催の**Gemini 3 ハッカソン**のために開発されました。

| 項目 | 内容 |
|------|------|
| **イベント名** | Gemini 3 ハッカソン: Build What's Next |
| **主催者** | Google DeepMind |
| **賞金総額** | $100,000（約1,500万円） |
| **テーマ** | 機械学習・AI、自由課題、社会貢献 |

---

## 📄 ライセンス

このプロジェクトは**MITライセンス**の下で公開されています。

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,19,20,24&height=100&section=footer" width="100%" />

**Gemini 3 ハッカソンのために❤️を込めて開発**

[![ウェブサイト](https://img.shields.io/badge/🌐_ウェブサイトを訪問-10B981?style=for-the-badge)](https://assertionengine.vercel.app/)

</div>
