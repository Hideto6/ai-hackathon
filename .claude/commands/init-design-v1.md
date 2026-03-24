---
description: じじいにゅーす向けのデモUI作成ルールと現在のフロントエンド構成を読み込む
---

# じじいにゅーす Design Init v1

このプロンプトは、`jijii-news` の UI デザインとデモ実装を始める前に読む前提のガイドです。  
このリポジトリでは `frontend/` が Next.js App Router の独立フロントエンドです。  
デザイン作業では、見た目の派手さよりも「学生が 30 秒でニュースを気にして読める体験」を優先してください。

---

## 0. アプリ概要

### 背景課題

学生が政治・社会ニュースを見ない理由:

- 専門用語が多く理解が難しい
- 興味が湧かない
- 情報量が多すぎる
- ニュースの背景がわからない
- 忙しくて読む時間がない
- アプリを開く手間がある

その結果:

**社会に関する知識が少なく、視点やアウトプットが広がらない。**

### コンセプト

**じじい構文 × 超短時間ニュース**

- 通知で気にならせる
- 開いたら 3 カードで読む
- 30 秒で「何が起きたか」と「自分への影響」がわかる

### 主な機能

1. おじさん構文通知
2. 3 カードニュース
3. 専門用語ポップアップ
4. 読了後レコメンド
5. 今日のニュース 3 本表示
6. ニュース保存機能

---

## 1. このアプリで守る体験原則

### 1-1. 優先順位

UI を作る時の優先順位は以下。

1. 一目で意味が伝わる
2. 30 秒で読み切れる
3. 気になって次を押したくなる
4. 難しいニュースを軽く感じる
5. 少し遊び心がある

### 1-2. トーン

- ベースは親しみやすい
- ただし「ふざけすぎ」にはしない
- おじさん構文は通知や導入のフックに使い、本文は理解しやすさを優先する
- かわいさより、**軽さ・速さ・気軽さ**を出す

### 1-3. デザインの方向性

- 情報量は少なく見せる
- 1 画面 1 メッセージを徹底する
- ニュースアプリというより、**ストーリー形式の短尺コンテンツ**として見せる
- 「重いニュースアプリ感」は避ける
- 初見ユーザーが迷わないよう、導線は少なくする

---

## 3. 今後の推奨構成

このリポジトリはまだ立ち上げ直後なので、今後の UI 実装は以下の形に寄せる。

```txt
frontend/
└── src/
    ├── app/
    │   ├── (public)/
    │   │   └── design-test/
    │   │       └── page.tsx
    │   ├── news/
    │   │   └── [newsId]/
    │   │       └── page.tsx
    │   ├── saved/
    │   │   └── page.tsx
    │   ├── today/
    │   │   └── page.tsx
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── page-components/
    │   ├── home/
    │   │   ├── ui/
    │   │   │   └── HomeContainer.tsx
    │   │   ├── ui-block/
    │   │   │   ├── hero/
    │   │   │   ├── today-news/
    │   │   │   ├── notification-preview/
    │   │   │   └── onboarding/
    │   │   ├── dummy-data/
    │   │   └── model/
    │   ├── news-detail/
    │   │   ├── ui/
    │   │   │   └── NewsDetailContainer.tsx
    │   │   ├── ui-block/
    │   │   │   ├── story-cards/
    │   │   │   ├── glossary-popover/
    │   │   │   ├── recommendation/
    │   │   │   └── save-action/
    │   │   ├── dummy-data/
    │   │   └── model/
    │   ├── saved-news/
    │   └── today-news/
    ├── widgets/
    │   ├── app-header/
    │   ├── bottom-navigation/
    │   ├── news-card-stack/
    │   └── push-notice-preview/
    ├── features/
    │   ├── save-news/
    │   ├── swipe-news-card/
    │   ├── open-glossary-term/
    │   └── read-next-news/
    ├── entities/
    │   ├── news/
    │   ├── glossary-term/
    │   └── notification-message/
    └── shared/
        ├── ui/
        │   ├── shadcn/
        │   │   ├── lib/
        │   │   └── ui/
        │   ├── components/
        │   │   ├── empty-state/
        │   │   ├── section-title/
        │   │   ├── news-chip/
        │   │   └── impact-badge/
        │   └── form-fields/
        ├── lib/
        ├── hooks/
        ├── config/
        └── types/
```

### 重要

- App Router の `page.tsx` は薄く保つ
- ページ固有 UI は `page-components/`
- アプリ全体で再利用する中くらいの UI は `widgets/`
- 操作単位の責務は `features/`
- ドメイン概念は `entities/`
- 原始 UI は `shared/`

---

## 4. App 層のルール

- `frontend/src/app/**/page.tsx` はできるだけ薄くする
- 原則として `page-components/**/ui/*Container.tsx` を呼ぶだけにする
- `layout.tsx` には global font、theme、providers、toast などだけを置く
- デザイン確認だけが目的なら `frontend/src/app/(public)/design-test/page.tsx` に直接書いてよい

### 良い例

```tsx
import { HomeContainer } from "@/page-components/home/ui/HomeContainer";

export default function Page() {
  return <HomeContainer />;
}
```

### 例外

短時間で単体画面のデザイン検証をしたい時だけ、`design-test/page.tsx` に全部書いてよい。

---

## 5. page-components 層のルール

### 基本構造

```txt
page-components/
└── news-detail/
    ├── ui/
    │   └── NewsDetailContainer.tsx
    ├── ui-block/
    │   ├── story-cards/
    │   │   ├── ui/
    │   │   │   ├── StoryCardsSection.tsx
    │   │   │   ├── components/
    │   │   │   │   └── StoryCard.tsx
    │   │   │   └── skeleton/
    │   │   │       └── StoryCardsSkeleton.tsx
    │   │   ├── model/
    │   │   │   └── types.ts
    │   │   ├── lib/
    │   │   └── config/
    │   ├── glossary-popover/
    │   └── recommendation/
    ├── dummy-data/
    │   └── news.ts
    └── model/
        └── types.ts
```

### ui-block とは

- ページ内の UI ブロック単位で責務を分ける整理手段
- そのブロック専用の `model`、`lib`、`config` を閉じ込める
- `widgets/` や `shared/` を使うこと自体は制限しない

### 命名ルール

| 種類                  | 命名                  |
| --------------------- | --------------------- |
| メインコンテナ        | `XxxxContainer.tsx`   |
| ui-block ディレクトリ | kebab-case            |
| セクション UI         | `XxxxSection.tsx`     |
| パネル系 UI           | `XxxxPanel.tsx`       |
| 細かい部品            | `ui/components/` 配下 |
| Skeleton              | `XxxxSkeleton.tsx`    |

---

## 6. shadcn/ui 利用ルール

### 正式な import 先

- `@/shared/ui/shadcn/ui/...`
- `@/shared/ui/shadcn/lib/...`

### 例

```tsx
import { Button } from "@/shared/ui/shadcn/ui/button";
import { Card } from "@/shared/ui/shadcn/ui/card";
import { Skeleton } from "@/shared/ui/shadcn/ui/skeleton";
import { cn } from "@/shared/ui/shadcn/lib/utils";
```

### 禁止

- `@/components/ui/...` から新規 import しない
- `@/lib/utils` から新規 import しない
- バレルファイル `index.ts` を作らない

### 使い分け

- shadcn/ui: Button, Card, Dialog, Popover, Tabs, Tooltip などのプリミティブ
- shared 独自 UI: EmptyState, NewsChip, ImpactBadge などアプリ固有の見た目
- page-components / widgets 内 UI: 画面意味を持つまとまり

---

## 7. UI 実装ルール

### 基本

- shadcn/ui をベースに組む
- アイコンは `lucide-react`
- 生の `<svg>` は原則書かない
- ボタンは `icon + text` を優先する
- チャートは `recharts`
- 通知プレビューやカード送りは「遊び」を入れてよいが、理解を邪魔しない

### レイアウト

- 全体は `h-screen` または `min-h-screen` を基準にする
- スクロール責務は明確に分ける
- `flex min-h-0 flex-1` を意識する
- PC でも狭めの情報幅を使い、「読みやすさ」を優先してよい
- ただし押しやすい余白は削らない

### 画面づくりで大事なこと

- 1 画面に情報を詰め込みすぎない
- 1 カード 1 メッセージ
- 難しい情報は必ず噛み砕く
- 「次を読みたい」導線を作る
- 保存・関連ニュース・語句説明は補助であり、主役は 3 カード体験

---

## 8. じじいにゅーす固有のデザイン指針

### 8-1. 通知 UI

- 最もフックが強い場所
- 少し笑えるが、不快ではない文体にする
- 絵文字は使ってよいが多すぎない
- 一目でニューステーマがわかる構成にする

### 8-2. 3 カードニュース

- 1 枚目: 何が起きた
- 2 枚目: なぜ起きた
- 3 枚目: 私生活への影響

### 8-3. 専門用語

- 長文説明は禁止
- 1 秒でわかる短文
- ポップアップは軽く、閉じやすく

### 8-4. 関連ニュース

- 多く出しすぎない
- 1〜2 本に絞る
- タイトルだけで意味がつながるようにする

### 8-5. 今日のニュース一覧

- 数は 3 本を基本
- 情報量より選びやすさ
- 一覧なのに一覧感を出しすぎない

---

## 9. バックエンド接続前の実装ルール

### やること

- UI 状態のみフロントで持つ
- 例: `currentCard`, `selectedNewsId`, `selectedTerm`, `isSaved`, `dialogOpen`
- 接続前のアクションは `alert()` でよい
- API 接続予定箇所に `// TODO: API呼び出し` を残す

### やらないこと

- 本番前提のデータ整形ロジックを作り込みすぎる
- 接続後に消える重い状態管理を入れる
- ダミー実装のためだけに過剰な hooks を増やす

### どうしても必要な場合

```ts
// 今後消す==========================================
const visibleNews = data.filter((item) => item.category === activeCategory);
// =================================================
```

---

## 10. ダミーデータ

### 配置

- `slice/dummy-data/` に置く
- `ui/` と同階層

### ルール

- 型定義も同じファイルに書く
- API レスポンスを見据えた shape に寄せる
- 後で削除しやすい粒度にする

### 例

```ts
// frontend/src/page-components/news-detail/dummy-data/news.ts

export interface DemoNewsCard {
  id: string;
  title: string;
  summary: string;
  reason: string;
  impact: string[];
}

export const demoNewsCards: DemoNewsCard[] = [
  {
    id: "yen-weak-001",
    title: "円安が進んでいます",
    summary: "円の価値が下がり、海外の商品が高くなっています。",
    reason: "アメリカと日本の金利差が大きいことが背景です。",
    impact: ["iPhone が高くなる", "海外旅行の費用が上がる"],
  },
];
```

---

## 11. 型定義の置き場所

| 状況                         | 配置場所                          |
| ---------------------------- | --------------------------------- |
| ダミーデータ専用で後で消える | `slice/dummy-data/*.ts` 内        |
| ui-block 専用                | `ui-block/[block]/model/types.ts` |
| ページ全体で共有             | `slice/model/types.ts`            |
| 複数画面で使う軽い型         | `shared/types/`                   |
| ドメインとして安定している   | `entities/**/model/`              |

---

## 12. ローディングと空状態

### ローディング

- `Skeleton` は `@/shared/ui/shadcn/ui/skeleton` を使う
- 実際に待ち時間が発生する場所にだけ置く
- 「とりあえず全画面 skeleton」は避ける

### 空状態

- データがない時は何も表示しないのは禁止
- 保存記事ゼロ、関連ニュースなし、今日のニュース未配信など、空状態をちゃんと設計する
- 将来的に `shared/ui/components/empty-state/` を作って再利用する

---

## 13. 禁止事項

- `index.ts` による公開 API
- 新規コードで `@/components/ui/*` を使うこと
- 新規コードで `@/lib/utils` を使うこと
- 1 画面に情報を詰め込みすぎること
- ニュース本文を長文記事 UI にしてしまうこと
- 「理解しやすさ」より「ニュースアプリっぽさ」を優先すること

---

## 14. デザイン作業時の出力ルール

このプロンプトを読んだ後は、以下を守ること。

- まず現在の `frontend/src` 構成を確認する
- 新規 UI は既存の shadcn 配置に合わせる
- import は直接ファイルパスで書く
- 必要なら route より先に `page-components` と `widgets` の責務を整理してから実装する
- デザイン提案では、必ず「誰が」「どの画面で」「何を理解できるようになるか」を意識する

---

## 15. 読み込み完了後の返信

以下の形式で返答すること。

```txt
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  ▄██▄
 ██◉◉██   Jijii News Design Init v1 — Loaded
 ▀████▀   気になるニュースの入口を設計します。
 ▄█▀▀█▄   何からデザインしますか？
▀▀ ▀▀ ▀▀
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```
