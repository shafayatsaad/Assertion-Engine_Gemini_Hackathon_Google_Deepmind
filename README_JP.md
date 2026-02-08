<div align="center">

# 🧪 Assertion Engine

**AI駆動型 学術研究検証プラットフォーム**

[ 🇬🇧 English ](README.md) | [ 🇯🇵 日本語 ](README_JP.md)

<br />

[![Gemini 3](https://img.shields.io/badge/Gemini_3-Google_DeepMind-4285F4?style=flat-square&logo=google&logoColor=white)](https://gemini3.devpost.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-認証-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/ライセンス-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<p>
  <b>Assertion Engine</b>は、研究者が時間・資金・評判を投資する前に<b>仮説をストレステスト</b>できる次世代の研究検証プラットフォームです。<b>Gemini 3 API</b>を活用し、論文を分析し、論理的脆弱性を特定し、新規性の衝突をスキャンし、具体的な改善案を提示します。
</p>

[🌐 ライブデモ](https://assertionengine.vercel.app/) · [バグ報告](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues) · [機能リクエスト](https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind/issues)

</div>

---

## 💡 プロジェクトコンセプト

学術研究において、失敗はエラーメッセージとして現れません。**数ヶ月後**に査読者が欠陥を発見したり、**出版後**に先行研究が見つかることで失敗が明らかになります。

**Assertion Engine**は、AI駆動の検証レイヤーを提供することでこの問題を解決します：

1. **論理の検証**: Gemini 3を使用して仮説構造を分析し、論理的弱点を特定
2. **新規性スキャン**: 公開前に類似度スコアリングで先行研究との衝突を検出
3. **改善策の提示**: 特定されたギャップに基づいて方法論の改善を推奨

### 研究の基本原則

- 🎯 **検証ファースト**: 数ヶ月の研究に投資する前にテスト
- 🔬 **統計的厳密性**: 最先端言語モデルによるAI分析
- 💡 **実行可能な洞察**: 一般的なフィードバックではなく、具体的な推奨事項

---

## 🚀 主な機能

### 🧠 メンターAI — インテリジェントフィードバックエンジン

- **リアルタイム分析**: 仮説を送信して即座にAIフィードバックを取得
- **論理的弱点の検出**: ギャップ、仮定、潜在的な反論を特定
- **改善提案**: 研究を強化するための具体的な推奨事項を提供

### 🔬 標本ラボ — データテスト環境

- **制御されたシミュレーション**: 方法論に対してデータサンプルをテスト
- **履歴比較**: 既存データセットに基づいて結果をシミュレート
- **リスク評価**: データ関連の問題を問題になる前に特定

### 📊 新規性スキャナー — 先行研究検出

- **類似度スコアリング**: 既存研究との重複を数値化（0-100%リスクスコア）
- **ソース特定**: あなたの研究と衝突する論文を正確に表示
- **差別化分析**: あなたの研究をユニークにする要素を強調

### ⚔️ 戦略デュエル — 方法論ストレステスト

- **競合分析**: 方法論を競合理論と対決させる
- **討論シミュレーション**: AIが反論を生成して弱点を発見
- **強み評価**: 代替案と比較してどこで優れているかを理解

### 🔐 セキュア認証

- **Supabase認証**: メール確認付きの安全なログイン・登録
- **プロジェクト管理**: 研究検証の保存・追跡・再訪問
- **ユーザープロフィール**: 所属機関付きのカスタマイズ可能なプロフィール

---

## 💻 コードスポットライト

Assertion EngineはGemini 3 APIを使用してAI検証エンジンを動かしています。新規性分析ロジックのスニペット：

```typescript
// lib/gemini.ts - 新規性分析

const analyzeNovelty = async (abstract: string, fullDocument?: string) => {
  const prompt = `
    あなたは厳格な学術新規性評価者です。
    
    以下の研究を分析してください：
    1. 先行研究との衝突（0-100%リスクスコア）
    2. 既存研究との主な差別化要素
    3. 衝突する可能性のある具体的な論文
    
    研究に以下のようなユニークな要素が含まれている場合：
    - 新規の数学モデル
    - 独自のアーキテクチャアプローチ
    - オリジナルのデータセットや方法論
    
    リスクスコアを大幅に下げてください。
    
    アブストラクト: ${abstract}
    ${fullDocument ? `全文ドキュメント: ${fullDocument}` : ''}
  `;
  
  const response = await gemini.generateContent(prompt);
  return parseNoveltyResponse(response);
};
```

---

## 🏗️ デモシナリオ

プラットフォームはさまざまな研究検証シナリオをサポートしています：

| シナリオ | 説明 | ユースケース |
| :--- | :--- | :--- |
| **クイックスキャン** | アブストラクトのみの分析 | 初期段階の仮説検証 |
| **ディープ分析** | 全文 + アブストラクト | 投稿前レビュー |
| **新規性チェック** | 先行研究衝突検出 | 特許/出版準備 |
| **戦略レビュー** | 方法論ストレステスト | 学位論文提案の防衛 |

---

## 📁 プロジェクト構成

```bash
assertion-engine/
├── components/           # React UIコンポーネント
│   ├── Hero.tsx          # ランディングページのヒーローセクション
│   ├── Dashboard.tsx     # メインダッシュボード
│   ├── AnalysisPage.tsx  # AI分析インターフェース
│   ├── NoveltyPage.tsx   # 新規性スキャナー
│   ├── SpecimenLab.tsx   # 標本ラボ
│   ├── Navbar.tsx        # ナビゲーション
│   └── ProfileDropdown.tsx # ユーザーメニュー
├── lib/                  # ユーティリティとAPI
│   ├── supabase.ts       # Supabase接続設定
│   └── gemini.ts         # Gemini API連携
├── App.tsx               # メインルーターとレイアウト
├── AppContext.tsx        # グローバル状態管理
├── index.css             # グローバルスタイル
├── index.html            # HTMLエントリーポイント
└── vite.config.ts        # Vite設定
```

---

## 🏁 セットアップ方法

### 前提条件

- Node.js 18以上
- npm または yarn
- Supabaseアカウント
- Google Gemini APIキー

### 1. クローンとインストール

```bash
# リポジトリをクローン
git clone https://github.com/shafayatsaad/Assertion-Engine_Gemini_Hackathon_Google_Deepmind.git
cd Assertion-Engine_Gemini_Hackathon_Google_Deepmind

# 依存関係をインストール
npm install
```

### 2. 環境設定

```bash
# 環境テンプレートをコピー
cp .env.example .env.local
```

`.env.local`を編集：

```env
VITE_SUPABASE_URL=あなたのSupabase_URL
VITE_SUPABASE_ANON_KEY=あなたのSupabase匿名キー
VITE_GEMINI_API_KEY=あなたのGemini_APIキー
```

### 3. 開発サーバーを起動

```bash
npm run dev
```

_ダッシュボードは `http://localhost:5173` で起動します_

### 4. 本番ビルド

```bash
npm run build
npm run preview
```

---

## 🏆 ハッカソン

<div align="center">

[![Gemini 3 ハッカソン](https://img.shields.io/badge/Google_DeepMind-Gemini_3_ハッカソン-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://gemini3.devpost.com/)

</div>

このプロジェクトは**Google DeepMind**主催の**Gemini 3 ハッカソン**のために構築されました。

| 項目 | 詳細 |
|------|------|
| **イベント** | Gemini 3 ハッカソン: Build What's Next |
| **主催** | Google DeepMind |
| **賞金総額** | $100,000（約1,500万円） |
| **テーマ** | 機械学習 / AI、自由課題、社会貢献 |

---

## 🤝 コントリビューション

AI分析精度の向上や新しい検証モジュールの追加への貢献を歓迎します！

1. プロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/新しい分析機能`)
3. 変更をコミット (`git commit -m '新しい検証モジュールを追加'`)
4. ブランチにプッシュ (`git push origin feature/新しい分析機能`)
5. プルリクエストを作成

---

## 📄 ライセンス

MITライセンスの下で配布されています。詳細は`LICENSE`を参照してください。

---

## 👤 メンテナー

<div align="center">
<table>
<tr>
<td align="center">
  <a href="https://github.com/shafayatsaad">
    <img src="https://github.com/shafayatsaad.png" width="100px" style="border-radius: 50%;" alt="Shafayat Saad"/>
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

<div align="center">

**Gemini 3 ハッカソンのために❤️を込めて開発**

[![ウェブサイト](https://img.shields.io/badge/🌐_ウェブサイトを訪問-10B981?style=for-the-badge)](https://assertionengine.vercel.app/)

</div>
