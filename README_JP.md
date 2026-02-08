<div align="center">

<!-- ヘッダーバナー -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,19,20,24&height=200&section=header&text=Assertion%20Engine&fontSize=60&fontAlignY=35&animation=fadeIn&desc=AI駆動型学術研究検証プラットフォーム&descAlignY=55&descSize=18" width="100%" />

<!-- 言語切り替え -->
<br/>

[![English](https://img.shields.io/badge/🇺🇸_English-CLICK_TO_SWITCH-64748B?style=for-the-badge&labelColor=1E293B)](./README.md)
[![日本語](https://img.shields.io/badge/🇯🇵_日本語-選択中-10B981?style=for-the-badge&labelColor=1E293B)](./README_JP.md)

<br/>

<!-- テクノロジーバッジ -->
[![Gemini 3](https://img.shields.io/badge/Gemini_3-Google_DeepMind-4285F4?style=flat-square&logo=google&logoColor=white)](https://gemini3.devpost.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

<br/>

<!-- アクションボタン -->
[![ライブデモ](https://img.shields.io/badge/🚀_ライブデモ-assertionengine.vercel.app-00C853?style=for-the-badge&labelColor=1E293B)](https://assertionengine.vercel.app/)
[![GitHub](https://img.shields.io/badge/📂_ソースコード-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind)
[![ハッカソン](https://img.shields.io/badge/🏆_ハッカソン-Gemini_3-8B5CF6?style=for-the-badge)](https://gemini3.devpost.com/)

</div>

---

## 📋 目次

- [🎯 概要](#-概要)
- [🚨 問題提起](#-問題提起)
- [✨ 機能](#-機能)
- [🏗 システムアーキテクチャ](#-システムアーキテクチャ)
- [🛠 技術スタック](#-技術スタック)
- [🚀 始め方](#-始め方)
- [📁 プロジェクト構成](#-プロジェクト構成)
- [🎬 デモ](#-デモ)
- [👤 開発者](#-開発者)
- [📄 ライセンス](#-ライセンス)

---

## 🎯 概要

**Assertion Engine**は、Google DeepMindの**Gemini 3 ハッカソン**向けに構築された次世代研究検証プラットフォームです。研究者が時間、資金、評判を費やす前に**仮説をストレステスト**できるようにします。

**Gemini 3 API**の力を活用し、学術論文を分析し、論理的な脆弱性を特定し、新規性の衝突をスキャンし、実行可能なピボット推奨を提供します。

### 🔑 主な機能

| モジュール | 説明 |
|-----------|------|
| 🧠 **メンターAI** | 学術AIコアからの即時フィードバック |
| 🔬 **標本ラボ** | 制御された環境でデータサンプルをテスト |
| ⚔️ **戦略デュエル** | 方法論を競合する理論と対決させる |
| 📊 **新規性スキャナー** | 公開前に先行技術の衝突を検出 |

---

## 🚨 問題提起

学術研究者は重大な課題に直面しています：

| 問題 | 影響 |
|------|------|
| ❌ **リソースの無駄** | 欠陥のある仮説に数ヶ月の作業 |
| ❌ **評判の損傷** | 簡単に反論できる主張の公開 |
| ❌ **新規性の衝突** | 出版後に発見される未知の先行技術 |
| ❌ **論理のギャップ** | 方法論で検出されない欠陥 |

> **手動検証は時間がかかり、エラーが発生しやすい。** Assertion Engineは検証パイプラインを自動化し、時間を節約し、評判を保護し、公開された研究の質を向上させます。

---

## ✨ 機能

| 機能 | 説明 |
|------|------|
| 🔐 **ユーザー認証** | Supabaseによるセキュアなログイン/サインアップ |
| 📝 **プロジェクト管理** | 研究プロジェクトの作成、管理、追跡 |
| 🧠 **メンターAI分析** | Gemini 3によるAI駆動の仮説検証 |
| 🔬 **標本ラボ** | インタラクティブなデータサンプルテスト環境 |
| 📊 **新規性スキャナー** | 類似度スコアリングによる先行技術衝突検出 |
| ⚔️ **戦略デュエル** | 競合理論に対する方法論のストレステスト |
| 📈 **リアルタイムメトリクス** | 信頼度スコア、論理一貫性、新規性指数 |
| 🎨 **プレミアムUI/UX** | スムーズなアニメーションを持つモダンなグラスモーフィズムデザイン |

---

## 🏗 システムアーキテクチャ

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              フロントエンド                               │
│                    React + TypeScript + Vite                            │
│         ランディングページ | ダッシュボード | 分析 | 新規性スキャナー        │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌───────────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│   Supabase認証        │ │  Supabase DB    │ │   Gemini 3 API      │
│                       │ │                 │ │                     │
│ • ユーザー管理        │ │ • プロフィール   │ │ • 仮説チェック       │
│ • JWTトークン         │ │ • プロジェクト   │ │ • 新規性分析         │
│ • セッション処理      │ │ • メトリクス     │ │ • リスク評価         │
└───────────────────────┘ └─────────────────┘ └─────────────────────┘
```

---

## 🛠 技術スタック

| レイヤー | 技術 | 目的 |
|----------|------|------|
| **フロントエンド** | React 18 + TypeScript | コンポーネントベースのUI |
| **ビルドツール** | Vite 5 | 高速開発とバンドリング |
| **スタイリング** | Tailwind CSS + カスタムCSS | モダンなレスポンシブデザイン |
| **アニメーション** | Framer Motion | スムーズなトランジションと効果 |
| **認証とDB** | Supabase | 認証とPostgreSQL |
| **AIエンジン** | Google Gemini 3 API | 仮説検証と分析 |
| **デプロイ** | Vercel | グローバルCDNホスティング |

---

## 🚀 始め方

### 前提条件

- Node.js (v18+)
- npm または yarn
- Supabaseアカウント
- Google Gemini APIキー

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind.git
cd Assertion-Engine_Gemini_Hackathon_Google_Deepmind

# 依存関係をインストール
npm install

# 環境を設定
cp .env.example .env.local
```

### 環境変数

`.env.local` を編集してください：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 開発

```bash
# 開発サーバーを起動
npm run dev

# 本番用にビルド
npm run build

# 本番ビルドをプレビュー
npm run preview
```

---

## 📁 プロジェクト構成

```
assertion-engine/
├── components/
│   ├── Hero.tsx              # ランディングページのヒーローセクション
│   ├── Navbar.tsx            # ナビゲーションバー
│   ├── Dashboard.tsx         # メインダッシュボード
│   ├── AnalysisPage.tsx      # AI分析インターフェース
│   ├── NoveltyPage.tsx       # 新規性スキャナー
│   ├── SpecimenLab.tsx       # データテストラボ
│   └── ...                   # その他のコンポーネント
├── lib/
│   ├── supabase.ts           # Supabaseクライアント設定
│   └── gemini.ts             # Gemini API統合
├── App.tsx                   # メインアプリケーションルーター
├── AppContext.tsx            # グローバル状態管理
├── index.css                 # グローバルスタイル
└── package.json              # 依存関係
```

---

## 🎬 デモ

<div align="center">

[![デモを試す](https://img.shields.io/badge/🚀_ライブデモを試す-assertionengine.vercel.app-10B981?style=for-the-badge&labelColor=1E293B)](https://assertionengine.vercel.app/)

</div>

### デモワークフロー

1. **サインアップ** — アカウントを作成
2. **プロジェクト作成** — 研究仮説を追加
3. **AI分析** — 即座に検証フィードバックを取得
4. **新規性スキャン** — 先行技術の衝突をチェック
5. **メトリクス確認** — 信頼度スコアを表示

---

## 👤 開発者

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
  <sub>フルスタック開発者</sub>
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

## 🏆 ハッカソン

<div align="center">

[![Gemini 3 ハッカソン](https://img.shields.io/badge/Google_DeepMind-Gemini_3_ハッカソン-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gemini3.devpost.com/)

</div>

このプロジェクトは**Google DeepMind**が主催する**Gemini 3 ハッカソン**のために構築されました。

| 属性 | 詳細 |
|------|------|
| **イベント** | Gemini 3 ハッカソン: Build What's Next |
| **主催** | Google DeepMind |
| **賞金プール** | $100,000 |
| **テーマ** | 機械学習 / AI、オープンエンド、社会貢献 |

---

## 📄 ライセンス

このプロジェクトは**MITライセンス**の下でライセンスされています。

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,19,20,24&height=100&section=footer" width="100%" />

Gemini 3 ハッカソンのために❤️を込めて制作

[![ウェブサイト](https://img.shields.io/badge/🌐_ウェブサイトを訪問-assertionengine.vercel.app-10B981?style=for-the-badge)](https://assertionengine.vercel.app/)

</div>
