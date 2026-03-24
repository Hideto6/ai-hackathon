---
description: FSD準拠のデモUI作成時の注意事項を読み込む
---

# FSD準拠 デモUI作成ガイドライン v1

このプロンプトを読んだ後、プロジェクト内のフロントエンド設計ドキュメントが存在する場合はそれも確認してください。
このリポジトリは `frontend/` に Next.js App Router + TypeScript + Tailwind を持つ構成を前提にします。

---

## 0. このリポジトリでの前提構成

FSDに寄せつつ、Next.js App Router と shadcn/ui を無理なく運用するため、基本の配置は以下を推奨します。

```txt
frontend/
└── src/
    ├── app/
    │   ├── (public)/
    │   │   └── design-test/
    │   │       └── page.tsx
    │   ├── sample/
    │   │   └── page.tsx
    │   ├── layout.tsx
    │   └── globals.css
    ├── page-components/
    │   └── sample/
    │       ├── home/
    │       ├── detail/
    │       ├── basic-information/
    │       └── register/
    ├── widgets/
    │   ├── header/
    │   │   └── ui/
    │   └── sidebar/
    │       └── ui/
    ├── features/
    ├── entities/
    ├── shared/
    │   ├── ui/
    │   │   ├── shadcn/
    │   │   │   └── ui/
    │   │   ├── form-fields/
    │   │   │   └── ui/
    │   │   └── components/
    │   │       ├── empty-design/
    │   │       └── delete-confirm-dialog/
    │   ├── lib/
    │   ├── hooks/
    │   ├── config/
    │   └── types/
    └── styles/

backend/
├── package.json
└── README.md
```

### shadcn/ui の配置方針

- shadcn/ui の生成先は `frontend/src/shared/ui/shadcn/ui/` を推奨する
- `Button`, `Dialog`, `Skeleton`, `Table` などのプリミティブはこの配下に置く
- アプリ固有の見た目や意味を持つものは shadcn/ui に混ぜず、`shared/ui/components/` か各 slice 配下に置く
- `components.json` を使う場合も alias は `@/shared/ui/shadcn/ui` に寄せる
- import は直接パス指定にし、`index.ts` は作らない

---

## 1. ディレクトリ構造とファイル命名

### App層

- App層は**できるだけ薄く**する
- `frontend/src/app/**/page.tsx` では `page-components` 層の `slice/ui/XxxxContainer` を呼び出すだけにする
- デザイン確認だけが目的なら `frontend/src/app/(public)/design-test/page.tsx` に直接実装してよい
- `layout.tsx` には全体レイアウトと providers だけを置き、業務UIは置かない

### App層の例

```tsx
import { SampleHomeContainer } from "@/page-components/sample/home/ui/SampleHomeContainer";

export default function SamplePage() {
  return <SampleHomeContainer />;
}
```

### Page-Components層の構造

```txt
frontend/src/page-components/
└── sample/
    ├── home/
    │   ├── ui/
    │   │   └── SampleHomeContainer.tsx
    │   ├── ui-block/
    │   │   ├── table-view/
    │   │   │   ├── ui/
    │   │   │   │   ├── SampleTable.tsx
    │   │   │   │   ├── components/
    │   │   │   │   │   └── SampleCard.tsx
    │   │   │   │   └── skeleton/
    │   │   │   │       └── SampleTableSkeleton.tsx
    │   │   │   ├── model/
    │   │   │   │   └── types.ts
    │   │   │   ├── lib/
    │   │   │   └── config/
    │   │   │       └── column-config.tsx
    │   │   ├── dashboard-panel/
    │   │   │   ├── ui/
    │   │   │   │   └── DashboardPanel.tsx
    │   │   │   └── model/
    │   │   └── header/
    │   │       └── ui/
    │   │           └── SampleHeader.tsx
    │   ├── dummy-data/
    │   │   └── samples.ts
    │   └── model/
    │       └── types.ts
    ├── detail/
    │   └── ui/
    │       └── SampleDetailContainer.tsx
    ├── basic-information/
    │   └── ui/
    │       └── SampleBasicInformationContainer.tsx
    └── register/
        └── ui/
            └── SampleRegisterContainer.tsx
```

### ui-blockとは

- **目的**: UIブロックごとに `lib`、`model`、`config` を閉じ込め、対応関係を明確にする
- **Container**: `ui/` には `XxxxContainer.tsx` を配置してよい
- **依存**: `widgets/` や `shared/` からの import は自由に行ってよい
- **スライス内分離**: 各 ui-block 内に `model/` や `lib/` を持たせ、責務を局所化する
- **注意**: ui-block は「整理手段」であり、「widgets や shared の使用制限」ではない

### 命名ルール

| 種類 | 命名パターン | 例 |
|------|-------------|-----|
| メインコンテナ | `XxxxContainer` | `ItemMasterContainer` |
| ui-block名 | kebab-case | `table-view`, `dashboard-panel` |
| 分離コンポーネント | `XxxxPanel` | `ItemDetailPanel` |
| 明確な役割がある場合 | `XxxxHeader`, `XxxxTable` | `AllocateTable` |
| 細かいコンポーネント | `ui-block/[block]/ui/components/` 内に配置 | `SourceTagPopover` |
| Widgetsのメイン | `XxxxWidget` | `TableViewWidget` |

---

## 2. バックエンド接続を見据えた実装

### やること

- UI状態のみフロントで管理する
- 例: `currentPage`, `filterState`, `sortState`, `selectedTab`, `dialogOpen`
- アクション実行時は `alert()` で未実装を表現してよい
- 例: `alert("ユーザーを削除（未実装）")`
- API接続前提の箇所には `// TODO: API呼び出し` を残す

### やらないこと

- フロントでの本実装のフィルター・ソート
- 接続時に消える前提の複雑な整形ロジック
- 仮実装のためだけの過剰な state 管理

### どうしても必要な場合

```typescript
// 今後消す==========================================
const filteredData = data.filter((item) => item.name.includes(searchQuery));
// =================================================
```

---

## 3. ダミーデータ

### 配置

`slice/dummy-data/` 内に作成する。`ui/` と同じ階層に置く。

### ルール

- **型定義も同じファイルに書く**
- 後で entity の型と混ざらないようにする
- APIレスポンス仕様がある場合は、その形に寄せる
- 接続後に消す前提であることを意識する

```typescript
// frontend/src/page-components/sample/home/dummy-data/samples.ts

export interface SampleItem {
  id: number;
  name: string;
  email: string;
}

export const dummySamples: SampleItem[] = [
  { id: 1, name: "山田太郎", email: "yamada@example.com" },
];
```

---

## 4. 型定義の配置

| 状況 | 配置場所 |
|------|----------|
| ダミーデータ用で後で消える | `slice/dummy-data/xxx.ts` 内 |
| ui-block専用で接続後も残る | `ui-block/[block]/model/types.ts` |
| ページ全体で共有する | `slice/model/types.ts` |
| 複数 slice や widgets で再利用する | `frontend/src/shared/types/` |
| ドメインとして安定している | `frontend/src/entities/**/model/` |

---

## 5. ローディング表示

- shadcn/ui の `Skeleton` を使う
- 配置は原則 `slice/ui-block/[block]/ui/skeleton/` または `slice/ui/skeleton/`
- 実際にローディングが発生する箇所にだけ作る
- 見た目確認だけのために全画面 skeleton を乱立させない

```tsx
import { Skeleton } from "@/shared/ui/shadcn/ui/skeleton";

export function SampleTableSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
```

---

## 6. UI実装ルール

### 基本

- **shadcn/ui** をベースに作る
- 配置は `frontend/src/shared/ui/shadcn/ui/`
- アイコンは **lucide-react** を使う
- `<svg>` の直書きは避ける
- ボタンは **icon + text** を積極的に使う
- グラフやチャートは **recharts** を使う
- Dialog を使う場合、`DialogTrigger` と `DialogContent` は同じコンポーネントにまとめる
- Dialog の open 状態はそのコンポーネント内部で管理する
- ラベル付きインプットは `frontend/src/shared/ui/form-fields/ui/` に置く
- パターンがなければそこへ追加する
- データ空状態は `frontend/src/shared/ui/components/empty-design/` から使う
- 削除確認ダイアログは `frontend/src/shared/ui/components/delete-confirm-dialog/` を使う

### shadcn/ui と独自UIの切り分け

- shadcn/ui:
  `Button`, `Input`, `Dialog`, `Sheet`, `Skeleton`, `Table`, `Badge` など再利用前提の低レイヤー
- shared/ui/components:
  `AppEmptyState`, `SectionHeader`, `DeleteConfirmDialog` など意味を持つ共通UI
- page-components/ui-block:
  画面専用の UI ブロック

### レイアウト

- 全体は `h-screen` を基本とする
- `flex min-h-0 flex-1` で高さ制約を子に渡す
- スクロール箇所は明示する
- 横幅は `w-full` を基本にする
- `max-w-7xl mx-auto` のような中央寄せ固定は原則避ける

```tsx
<div className="flex h-screen flex-col">
  <Header />
  <main className="flex min-h-0 flex-1 flex-col">
    <Content className="flex-1 overflow-auto" />
  </main>
</div>
```

### サイドバー・ヘッダー

- アプリ全体で使うものは `widgets/` に配置する
- 画面固有のヘッダーなら `page-components/.../ui-block/header/` に置く

---

## 7. import ルール

- バレルファイル `index.ts` による公開APIは作らない
- 直接ファイルパスで import する
- import alias は `@/` を使ってよい
- 例:
  `@/page-components/sample/home/ui/SampleHomeContainer`
  `@/shared/ui/shadcn/ui/button`

---

## 8. 禁止事項

- **バレルファイル（index.ts）による公開API**
- フロントだけで完結する前提の重い業務ロジック実装
- まだ要件が固まっていない段階で `features/` や `entities/` を過剰分割すること
- デザイン確認用ページに本番前提の複雑な責務を背負わせること
- App Router の `page.tsx` に直接大量の UI ブロックやロジックを書くこと

---

## 9. 実装時の判断基準

- まず `src/app` を薄く保てるか確認する
- 再利用されるか不明なものは、いったん `page-components` に置く
- 複数画面で使うと確定したら `widgets/` や `shared/` へ引き上げる
- shadcn/ui はベース部品置き場であり、業務意味を持つコンポーネント置き場ではない
- 「後で消える仮実装」と「残る型・UI」を分けて置く

---

これらのルールに従ってデモUIを作成してください。
不明点があれば質問してください。

---

## 読み込み完了後の返信

以下のように返信してください：

```txt
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  ▄██▄
 ██◉◉██   FSD Design System v1 — Loaded
 ▀████▀   最高のプロダクトを作りましょう。
 ▄█▀▀█▄   何からデザインしますか？
▀▀ ▀▀ ▀▀
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```
