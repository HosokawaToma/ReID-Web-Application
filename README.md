# ReID Web Application

ReId-Serverのエンドポイントを叩くWebアプリケーション

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **UI**: React 19
- **その他**: @xyflow/react（フロー図）, TypeScript 5

## 必要環境

- Node.js 20 以上
- npm

## 環境変数

プロジェクトルートに `.env` または `.env.local` を作成し、以下を設定してください。

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_API_URL` | バックエンド API のベース URL（例: `https://api.example.com`） |

## セットアップ

```bash
docker compose up -d --build
```

# システムの主な説明

この Web アプリケーションは、人物のスナップショット情報を用いて ReId-Server の各種 API を可視化・操作するための管理 UI です。
主なユースケースは次のとおりです。

- **Person Snapshots Search**: 条件を指定して人物スナップショットを検索し、検索結果の一覧と詳細を確認できます。
- **Person Snapshot Search Rank**: あるスナップショットに対して類似度ランキングを表示し、どの人物がどれだけ類似しているかを確認できます。
- **Person Snapshot Answer Assign**: スナップショットと人物 ID を紐付ける（正解ラベルを付与する）ことで、学習や評価用のラベルデータを整備できます。
- **Frame Search**: 時系列フレームから特定の人物や状況を検索し、該当フレームの画像を閲覧できます。
- **Person Flow Weight**: カメラ間・領域間の人物移動の重み（フロー）を可視化し、行動パターンや動線分析に活用できます。

これらの機能を通じて、ReId-Server が提供する人物再同定機能の動作確認・評価・ラベリング作業をブラウザ上で効率よく行うことができます。
