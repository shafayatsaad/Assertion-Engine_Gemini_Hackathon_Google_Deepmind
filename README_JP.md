<div align="center">

<!-- アニメーションヘッダー -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:10B981,50:06B6D4,100:8B5CF6&height=220&section=header&text=Assertion%20Engine&fontSize=50&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=AI駆動型学術研究検証プラットフォーム&descAlignY=55&descSize=18&descColor=ffffff" width="100%" />

<!-- 言語切り替え -->
[ 🇬🇧 English ](README.md) | [ 🇯🇵 日本語 ](README_JP.md)

<br />

<!-- GitHub 統計 -->
[![Stars](https://img.shields.io/github/stars/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind?style=for-the-badge&logo=github&color=yellow)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/stargazers)
[![Forks](https://img.shields.io/github/forks/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind?style=for-the-badge&logo=github&color=blue)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/fork)
[![Issues](https://img.shields.io/github/issues/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind?style=for-the-badge&logo=github&color=red)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues)
[![License](https://img.shields.io/github/license/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind?style=for-the-badge&color=green)](https://opensource.org/licenses/MIT)

<br />

<!-- テクノロジーバッジ -->
[![Gemini 3](https://img.shields.io/badge/Gemini_3-Google_DeepMind-4285F4?style=flat-square&logo=google&logoColor=white)](https://gemini3.devpost.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-認証-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

<br />

<p>
  <b>Assertion Engine</b>は、研究者が時間・資金・評判を投資する前に<b>仮説をストレステスト</b>できる次世代の研究検証プラットフォームです。<b>Gemini 3 API</b>を活用し、論文を分析し、論理的脆弱性を特定し、新規性の衝突をスキャンし、具体的な改善案を提示します。
</p>

<br />

<!-- アクションボタン -->
[![ライブデモ](https://img.shields.io/badge/🌐_ライブデモ-サイトを見る-10B981?style=for-the-badge&labelColor=1E293B)](https://assertionengine.vercel.app/)
[![スターする](https://img.shields.io/badge/⭐_このリポジトリにスター-応援する-FFD700?style=for-the-badge&labelColor=1E293B)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind)
[![バグ報告](https://img.shields.io/badge/🐛_バグ報告-Issues-EF4444?style=for-the-badge&labelColor=1E293B)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues)
[![機能リクエスト](https://img.shields.io/badge/✨_機能リクエスト-アイデア-8B5CF6?style=for-the-badge&labelColor=1E293B)](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues)

</div>

---

## 📋 目次

- [🎯 概要](#-概要)
- [🚨 問題提起](#-問題提起)
- [✨ 機能一覧](#-機能一覧)
- [🏗️ システムアーキテクチャ](#️-システムアーキテクチャ)
- [🛠️ 技術スタック](#️-技術スタック)
- [🚀 セットアップ方法](#-セットアップ方法)
- [📡 API ドキュメント](#-api-ドキュメント)
- [🤖 エージェント説明](#-エージェント説明)
- [🎬 デモシナリオ](#-デモシナリオ)
- [👥 チーム](#-チーム)

---

## 🎯 概要

**Assertion Engine**は、Google DeepMind主催の**Gemini 3 ハッカソン**向けに構築されました。研究者が出版前に研究を検証できるAI駆動の検証レイヤーを提供します。

### なぜAssertion Engine？

- 🎯 **検証ファースト**: 数ヶ月の研究投資前にテストを実施
- 🔬 **統計的厳密性**: Gemini 3の高度な推論によるAI分析
- 💡 **実行可能な洞察**: 一般的なフィードバックではなく具体的な推奨
- ⚡ **リアルタイム処理**: 平均応答時間1.2msの即時分析

---

## 🚨 問題提起

学術研究において、失敗はエラーメッセージとして現れません。**数ヶ月後**に査読者が欠陥を発見したり、**出版後**に先行研究が見つかることで失敗が明らかになります。

| 問題 | 影響 |
|------|------|
| ❌ **リソースの浪費** | 欠陥のある仮説に数ヶ月の時間を費やす |
| ❌ **評判の毀損** | 容易に反論される主張を公開してしまう |
| ❌ **新規性の問題** | 出版後に類似の先行研究が発覚する |
| ❌ **論理的欠陥** | 方法論上の問題が見過ごされる |

> **手動検証は時間がかかり、エラーが発生しやすい。** Assertion Engineは検証パイプラインを自動化し、時間を節約し、研究の質を向上させます。

---

## ✨ 機能一覧

| 機能 | 説明 |
|------|------|
| 🔐 **ユーザー認証** | Supabaseによる安全なログイン・登録 |
| 📝 **プロジェクト管理** | 研究プロジェクトの作成・管理・追跡 |
| 🧠 **メンターAI分析** | Gemini 3によるAI駆動の仮説検証 |
| 🔬 **標本ラボ** | 対話型データサンプルテスト環境 |
| 📊 **新規性スキャナー** | 類似度スコアによる先行研究検出 |
| ⚔️ **戦略デュエル** | 競合理論との方法論ストレステスト |
| 📈 **リアルタイム指標** | 信頼度・論理一貫性・新規性スコア |
| 🎨 **高品質UI/UX** | 滑らかなアニメーション付きモダンデザイン |

---

## 🏗️ システムアーキテクチャ

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

### データフロー

1. **ユーザー**が研究仮説を送信 → **メンターAIエージェント**にルーティング
2. 構造化分析が → **新規性スキャナーエージェント**に流れる
3. リスク評価が**戦略デュエルエージェント**によって生成
4. 出力がダッシュボードに集約・表示
5. フォローアップクエリ → **Q&Aエージェント**にルーティング

---

## 🛠️ 技術スタック

| カテゴリ | 技術 | 用途 |
|---------|------|------|
| **フロントエンド** | React 18 + TypeScript | コンポーネントベースのUI構築 |
| **ビルドツール** | Vite 5 | 高速な開発環境・本番ビルド |
| **スタイリング** | Tailwind CSS + カスタムCSS | モダンなレスポンシブデザイン |
| **アニメーション** | Framer Motion | 滑らかな画面遷移・効果 |
| **認証・DB** | Supabase | ユーザー認証とPostgreSQLデータベース |
| **AIエンジン** | Google Gemini 3 API | 仮説検証と分析エンジン |
| **デプロイ** | Vercel | グローバルCDNによる高速配信 |

---

## 🚀 セットアップ方法

### 前提条件

- Node.js 18以上
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

# 環境設定
cp .env.example .env.local
```

### 環境変数

`.env.local`を編集：

```env
VITE_SUPABASE_URL=あなたのSupabase_URL
VITE_SUPABASE_ANON_KEY=あなたのSupabase匿名キー
VITE_GEMINI_API_KEY=あなたのGemini_APIキー
```

### 開発

```bash
# 開発サーバーを起動
npm run dev
```

_ダッシュボードは `http://localhost:5173` で起動します_

### 本番ビルド

```bash
npm run build
npm run preview
```

---

## 📡 API ドキュメント

### 基本統合

プラットフォームはすべてのAI分析に**Gemini 3 API**を使用します。統合方法：

```typescript
// lib/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeHypothesis = async (content: string) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

### Supabaseスキーマ

| テーブル | 用途 |
|---------|------|
| `profiles` | ユーザープロフィール（名前、メール、所属機関） |
| `projects` | 仮説データを含む研究プロジェクト |
| `analysis_results` | キャッシュされたAI分析結果 |

---

## 🤖 エージェント説明

### 1. メンターAIエージェント
| 属性 | 説明 |
|------|------|
| **役割** | 仮説構造を分析し、論理的弱点と仮定を特定 |
| **入力** | 生の仮説テキストまたは研究アブストラクト |
| **出力** | 改善推奨付きの構造化フィードバック |

### 2. 新規性スキャナーエージェント
| 属性 | 説明 |
|------|------|
| **役割** | 先行研究との衝突を検出し、類似度スコアを計算 |
| **入力** | アブストラクト + オプションで全文ドキュメント |
| **出力** | リスクスコア（0-100%）、衝突論文リスト、差別化分析 |

### 3. 標本ラボエージェント
| 属性 | 説明 |
|------|------|
| **役割** | 方法論の仮定に対してデータサンプルをテスト |
| **入力** | データサンプル + 研究方法論 |
| **出力** | シミュレーション結果、潜在的データ問題、リスク評価 |

### 4. 戦略デュエルエージェント
| 属性 | 説明 |
|------|------|
| **役割** | 競合理論に対して方法論をストレステスト |
| **入力** | ユーザー方法論 + 研究分野 |
| **出力** | 反論、弱点特定、強み評価 |

---

## 🎬 デモシナリオ

### 研究コンテキスト
「AI駆動の気候予測モデル」に関する仮説をテストする博士課程学生。

### サンプルワークフロー

```
1. ユーザーがサインアップ → 新規プロジェクトを作成
2. 仮説を入力：「深層学習モデルは従来の手法よりも
   地域の気候パターンをより正確に予測できる」
3. メンターAIが分析 → 3つの論理的ギャップを特定
4. 新規性スキャナーが実行 → 85%の新規性スコア（低リスク）
5. 戦略デュエル → 2つの競合方法論に対してテスト
```

### 期待される出力

**📝 メンターAIフィードバック：**
- ✅ 仮説はテスト可能で具体的
- ⚠️ 「地域」の範囲を明確化する必要あり
- ⚠️ ベースライン比較基準が不足

**📊 新規性スコア：**
| 指標 | 値 | ステータス |
|------|-----|----------|
| 先行研究リスク | 15% | 🟢 低 |
| 方法論の重複 | 23% | 🟢 低 |
| 主要な差別化要素 | 新規データ融合アプローチ | ✅ ユニーク |

**⚔️ 戦略デュエル：**
- 強み：新規アーキテクチャアプローチ
- 弱み：温帯地域に限定
- 推奨：フェーズ2で地理的範囲を拡大

---

## 👥 チーム

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
    <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/shafayatsaad/">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://shafayatsaad.vercel.app/">
    <img src="https://img.shields.io/badge/ポートフォリオ-000?style=flat-square&logo=vercel&logoColor=white" />
  </a>
  <a href="mailto:shafayat.saad30@gmail.com">
    <img src="https://img.shields.io/badge/メール-EA4335?style=flat-square&logo=gmail&logoColor=white" />
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

| 項目 | 詳細 |
|------|------|
| **イベント** | Gemini 3 ハッカソン: Build What's Next |
| **主催** | Google DeepMind |
| **賞金総額** | $100,000（約1,500万円） |
| **テーマ** | 機械学習 / AI、自由課題、社会貢献 |

---

## 🤝 コントリビューション

貢献を歓迎します！

1. プロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/新しい分析機能`)
3. 変更をコミット (`git commit -m '新しい検証モジュールを追加'`)
4. ブランチにプッシュ (`git push origin feature/新しい分析機能`)
5. プルリクエストを作成

---

## 📄 ライセンス

MITライセンスの下で配布されています。詳細は`LICENSE`を参照してください。

---

<div align="center">

<!-- フッター -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:10B981,50:06B6D4,100:8B5CF6&height=120&section=footer" width="100%" />

**Gemini 3 ハッカソンのために❤️を込めて開発**

[![ウェブサイト](https://img.shields.io/badge/🌐_ウェブサイトを訪問-10B981?style=for-the-badge)](https://assertionengine.vercel.app/)

</div>
