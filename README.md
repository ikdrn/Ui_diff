# Frontend Design Catalog

外部ライブラリ・フレームワーク不使用。HTML・CSS・Vanilla JSだけで実装された、
コピー&ペーストで即使えるUIコンポーネント集。

---

## 何ができるのか

- **20カテゴリ・200以上のコンポーネント**を即座にプレビューしてコードをコピーできる
- ライトモード・ダークモードの両方で動作確認済み
- 外部依存ゼロ → 既存プロジェクトへのコピーが簡単

---

## ファイル構成

```
Ui_diff/
├── index.html              # トップページ（コンポーネント一覧）
├── styles/
│   └── global.css          # 全ページ共通のスタイル + デザイントークン
├── js/
│   └── main.js             # 全ページ共通のJS（テーマ切替、コード表示/コピー等）
├── components/
│   ├── buttons.html        # ボタン（Solid/Outline/Ghost/Loading/Group）
│   ├── cards.html          # カード（Profile/Pricing/Stat/Skeleton）
│   ├── forms.html          # フォーム（Floating Label/バリデーション/ファイルアップロード）
│   ├── navbars.html        # ナビゲーションバー
│   ├── sidebars.html       # サイドバー（Collapsible/Mini）
│   ├── footers.html        # フッター
│   ├── heroes.html         # ヒーローセクション
│   ├── modals.html         # モーダル/ダイアログ
│   ├── tables.html         # テーブル（Sortable/DataTable）
│   ├── tabs.html           # タブナビゲーション
│   ├── accordions.html     # アコーディオン
│   ├── alerts.html         # アラート/Toast通知
│   ├── badges.html         # バッジ/ラベル
│   ├── loaders.html        # ローディングUI（Spinner/Skeleton）
│   ├── tooltips.html       # ツールチップ
│   ├── dropdowns.html      # ドロップダウンメニュー
│   ├── pagination.html     # ページネーション
│   ├── breadcrumbs.html    # パンくずリスト
│   ├── toggles.html        # トグルスイッチ
│   └── avatars.html        # アバター
└── README.md               # このファイル
```

---

## デザイン設計書

### 1. 色の役割設計（最重要原則）

色は「見た目のバリエーション」ではなく「機能的な意味」を持たせる。
**同じ色に複数の意味を持たせない。**

| 変数 | 色 | 役割 | 使う場所 | 使わない場所 |
|------|-----|------|--------|------------|
| `--primary` | インディゴ #4f46e5 | ブランド色＋インタラクション | リンク・フォーカスリング・アクティブ状態・主要CTA | 装飾的な強調 |
| `--success` | グリーン #16a34a | 状態「成功・完了・有効」 | フォームOK・処理完了・接続中 | 緑色を使いたいだけの装飾 |
| `--warning` | 琥珀 #d97706 | 状態「注意・要確認」 | 削除確認・在庫少・制限超過間近 | 単なる黄色の装飾 |
| `--danger` | 赤 #dc2626 | 状態「エラー・削除・危険」 | バリデーションエラー・削除ボタン | 目立たせたいだけの強調 |
| `--info` | 青 #2563eb | 状態「情報・補足ヒント」 | ツールチップ・インフォバナー | ブランド色の代替 |
| グレースケール | グレー系 | 構造・区切り | ボーダー・テキスト・背景 | 常に最初の選択肢 |

**色を使う前に自問**: 「この色は何を伝えているか？」意味がなければグレーで代替する。

### 2. サーフェス階層（背景の奥行き）

```
--bg          (最奥) ページ背景   #f4f6f9
  └── --surface        カード・パネル  #ffffff
        └── --surface-2    インプット・区切り  #f1f5f9
```

カードは背景より「前に出る」感覚を border と shadow で表現する。
グラデーション背景や大きな shadow は使わない（情報の優先度が崩れる）。

### 3. テキスト階層（3段階）

```
--text         主要テキスト（見出し・本文）   #0f172a
--text-muted   補足テキスト（ラベル・説明）   #64748b
--text-subtle  弱いテキスト（日時・カウント）  #94a3b8
```

同じページ内で全テキストを同じ色にしない。
重要な情報は `--text`、補足は `--text-muted`、非必須は `--text-subtle`。

### 4. ホバーエフェクトの原則

```css
/* ✓ 良い例: border変化 + 軽いshadow */
.card:hover {
  border-color: var(--primary-border);
  box-shadow: var(--shadow-md);
}

/* ✗ 悪い例: 過剰なエフェクトの重ね合わせ */
.card:hover {
  transform: translateY(-5px);       /* 浮き上がり（装飾的ノイズ） */
  box-shadow: 0 25px 50px ...;       /* 過大な影 */
  border-color: var(--primary);
  background: linear-gradient(...);
}
```

**理由**: 「押せる」ことを伝えるために要素が「浮く」必要はない。
border-color の変化だけで十分にインタラクティブであることが伝わる。
エフェクトを重ねるほどコンテンツの主役感が薄れる。

### 5. 視線の流れ設計

「最初に見る → 次に比較する → 最後に行動する」の流れで各画面を構成する。

**index.html（トップ）**:
1. ヒーロー → 「何のカタログか」を一文で伝える
2. フィルタータブ → 「何を探しているか」で絞り込む
3. カードグリッド → 「どれを使うか」を比較する
4. カードクリック → 詳細ページへ遷移

**各コンポーネントページ**:
1. `page-title-block` → 「このコンポーネントは何か・いつ使うか」
2. `demo-block` → 「実際の見た目」
3. `show-code-btn` → 「コードをコピーする」

### 6. 実運用を想定した設計

| シナリオ | 対応方法 |
|---------|---------|
| 長いテキスト | `overflow: hidden; text-overflow: ellipsis` または `word-break: break-word` |
| ゼロ件状態 | 空リスト・テーブルには empty state を必ず表示 |
| ローディング中 | Skeleton または Spinner を表示 |
| フォームエラー | 色（danger）＋アイコン＋テキストの3点セット |
| 無効状態 | `opacity: 0.45` + `cursor: not-allowed` + `pointer-events: none` |

---

## CSSアーキテクチャ

### global.css の構造と役割

```
global.css
├── :root {}               → デザイントークン（ライトモード）
├── [data-theme="dark"] {} → ダークモードの上書き
├── リセット               → ブラウザ差異の統一
├── .container             → 最大幅コンテナ
├── .global-header         → 固定ヘッダー
├── .sidebar               → 左サイドバー（コンポーネントページ用）
├── .main-content          → メインエリア
├── .demo-block            → コンポーネントのプレビューカード
├── .catalog-card          → トップページのカテゴリカード
└── メディアクエリ         → モバイル対応
```

### コンポーネントページのスタイル分離

各ページは `<style>` タグ内にコンポーネント固有スタイルを記述する。
`global.css` はレイアウトと共通UIのみ担当する。

```html
<link rel="stylesheet" href="../styles/global.css">
<style>
  /* このページ専用のコンポーネントスタイル（日本語コメント付き）*/
  .badge { /* バッジの基底スタイル */ }
</style>
```

### 変数の追加ルール

```css
:root {
  /* 追加時は必ず役割コメントを書く */
  --new-token: #value; /* 使う場所: ○○。使わない場所: ××。 */
}
[data-theme="dark"] {
  --new-token: #dark-value; /* ダークモードでも必ずペアで定義 */
}
```

---

## JavaScriptアーキテクチャ（main.js）

全ページで読み込む共通JS。`DOMContentLoaded` で以下を初期化する。

| 関数 | 機能 | 依存 |
|------|------|------|
| `initTheme()` | localStorage からテーマ復元 | 即時実行（FOUC防止） |
| `setupThemeToggle()` | ダークモード切替 | `#theme-toggle` 要素 |
| `setupCodeSnippets()` | Show Code / Copy ボタン | `.show-code-btn`, `.copy-btn` |
| `setupSidebar()` | モバイルサイドバー開閉 | `#menu-toggle`, `#sidebar` |
| `highlightActiveSidebarLink()` | 現在ページをサイドバーでハイライト | `.sidebar-link` |
| `setupRippleButtons()` | リップルエフェクト | `.btn-ripple` クラス |
| `setupMagneticButtons()` | カーソル追従エフェクト | `.btn-magnetic` クラス |
| `setupTiltCards()` | 3Dチルトカード | `.card-tilt` クラス |

---

## 新しいコンポーネントページを追加する手順

### Step 1: 既存ページをコピー

```bash
cp components/badges.html components/newcomponent.html
```

### Step 2: メタ情報を更新

```html
<title>NewComponent — Frontend Design Catalog</title>
```

### Step 3: サイドバーのアクティブリンクを変更

```html
<!-- newcomponent.html では newcomponent.html が active -->
<a href="newcomponent.html" class="sidebar-link active">New</a>
<!-- badges.html は active を外す -->
<a href="badges.html" class="sidebar-link">Badges</a>
```

### Step 4: コンポーネントスタイルを追加

`<style>` タグに日本語コメント付きでCSSを記述:

```css
/* ---- コンポーネントの基底スタイル ---- */
/* display:flex で内部要素を横並びに。gap で間隔統一 */
.new-component {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* ... */
}
```

### Step 5: デモブロックを追加

```html
<div class="demo-block">
  <div class="demo-block-header">
    <div>
      <span class="demo-block-title">1. バリアント名</span>
      <!-- いつ使うかの説明（省略可だが推奨）-->
    </div>
    <button class="show-code-btn" data-target="code-variant-1">▶ Show Code</button>
  </div>
  <div class="demo-block-body">
    <!-- 実際のコンポーネントをここに配置 -->
  </div>
  <div class="code-snippet" id="code-variant-1">
    <button class="copy-btn">Copy</button>
    <pre><code><!-- コピー用の最小コード例 --></code></pre>
  </div>
</div>
```

### Step 6: index.html にカードを追加

```html
<a href="components/newcomponent.html" class="catalog-card"
   data-name="検索用キーワード（日英両方）">
  <div class="catalog-card-icon">
    <!-- stroke="currentColor" で --primary が自動適用 -->
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2">
      <!-- SVGパス -->
    </svg>
  </div>
  <div class="catalog-card-title">コンポーネント名</div>
  <div class="catalog-card-desc">1行の説明文（何ができるかを具体的に）</div>
  <div class="catalog-card-meta">
    <span class="catalog-card-count">N+ 種類</span>
    <span class="catalog-card-arrow">→</span>
  </div>
</a>
```

### Step 7: 全ページのサイドバーに新リンクを追加

全21コンポーネントページの `<aside class="sidebar">` に追記する。

---

## デモブロックのベストプラクティス

### エッジケースを必ずデモする

コンポーネントは「理想状態」だけでなく実際に起こりうる状態も示す:

```html
<!-- ✓ 良い例: エッジケースを含む -->
<div class="demo-block-body">
  <span class="badge badge-success">成功</span>
  <span class="badge badge-danger">エラー</span>
  <!-- 長いテキストでの折り返し確認 -->
  <span class="badge badge-info">このバッジはとても長いラベルテキストを持っています</span>
</div>

<!-- ✗ 悪い例: 理想的なデモのみ -->
<div class="demo-block-body">
  <span class="badge badge-success">OK</span>
</div>
```

### コードスニペットは最小限に

スニペットには「そのコンポーネントの使い方の最小コード」のみ。
全CSSを貼るのではなくHTMLの使い方を中心に記載する。

---

## ダークモード対応

### 自動対応（推奨）

CSS変数を使えば自動的にダークモードに対応する:

```css
/* --text, --bg 等のトークンはダークモードで自動切替される */
.my-component { color: var(--text); background: var(--surface); }
```

### 手動対応（ハードコード色がある場合のみ）

特定の色をハードコードした場合は明示的に上書きする:

```css
/* アクセシビリティ: ライト/ダーク両方でコントラスト比4.5:1以上を確保 */
.alert-success { color: #065f46; }
[data-theme="dark"] .alert-success { color: #6ee7b7; }
```

---

## ブラウザサポート

| ブラウザ | サポート |
|---------|---------|
| Chrome/Edge 最新 | ✓ |
| Firefox 最新 | ✓ |
| Safari 最新 | ✓ |
| iOS Safari / Chrome for Android | ✓ |
| IE11 | ✗ (CSS変数/Flexbox/Clipboard APIを使用) |

---

## ローカル開発

```bash
# ファイルを直接ブラウザで開いても動作するが、サーバー推奨
python3 -m http.server 8080
# または
npx serve .
```

---

## 設計判断の記録

### なぜ外部ライブラリを使わないのか

コンポーネントを直接HTMLプロジェクトにコピーできるようにするため。
TailwindのユーティリティクラスやChakra UIのコンポーネントはそれぞれの環境なしには動かない。
このカタログはどんな環境でも動く。

### なぜカードアイコンを全て同じ色にしたのか

以前は各カードのアイコンに異なるグラデーション色を使っていた。
しかし色の多様性は「意味の多様性」を暗示する。
Navbarsのアイコンが紫でCardsが緑でも、意味上の違いはない。
全アイコンを同じ `--primary` 色で統一することで
「全てのカードは同じ種類のコンテンツである」ことを正確に伝えられる。

### なぜ hover で translateY を使わないのか

「浮く」エフェクトは見た目は派手だが情報の優先度に影響しない純粋な装飾。
border-color の変化だけで「インタラクティブである」ことは十分伝わる。
装飾を削ぎ落とすほど、コンテンツが主役になる。

### なぜカテゴリを4つに分けたのか

「ナビゲーション / コンテンツ / 入力・操作 / フィードバック」の4分類は
UIデザインにおける実際の機能役割に基づいている。
ユーザーが「ページ遷移を示したい」「状態を伝えたい」などの
目的から逆引きできるようにするため。

### なぜグラデーションテキストを廃止したのか

グラデーションテキストは `background-clip: text` で実装するが、
コントラスト比を正確に計算できない。アクセシビリティの観点から
単色テキスト + キーワードのみ `--primary` 色で強調する方式に変更した。
