# 1.0.5 から 1.1.0 への更新メモ

## 確認した問題

旧版は `movie`、`searchMovies`、`getMovieDetail` を使っていました。現在の Inscura は `media`、`searchMedia`、`getMediaDetail` を呼び出します。また、旧 manifest には情報源と取得可能な項目の宣言がなく、既定ソースの選択や項目ごとの設定に対応できませんでした。

作品の `actors` / `director`、人物のトップレベル `hobby` / `bloodType` / `cupSize` は現在の返却型と一致しません。人物検索の `matchScore` は空文字になっていました。値がない場合も空文字や 0 を返していたため、「未提供」と実際の値を区別できませんでした。

旧版の接続テストはサーバーのルート URL の成功応答だけを確認しており、トークンが正しいことを確かめられませんでした。検索 404 と詳細 404 も同じエラー扱いでした。画像 URL には、特定の第三者ミラーへホスト名を書き換える処理がありました。

## 採用した変更

| 対象 | 1.1.0 の動作 |
| --- | --- |
| メソッドと宣言 | `media` / `actor` の検索・詳細メソッドを実装し、情報源と標準・カスタム項目を宣言する。 |
| 作品の出演者・スタッフ | `cast` / `crew` に構造化して返す。人物名から ID は作らない。 |
| 人物の拡張項目 | 現行標準項目に対応しない血液型・趣味・カップサイズ等は宣言済みカスタム項目へ返す。 |
| 値の正規化 | 未提供値を省略し、日付と URL を確認する。FANZA の評価を 5 点満点から 10 点満点へ換算する。 |
| 認証 | 任意の Bearer トークンを Authorization ヘッダーに載せ、認証対象の `/v1/db/version` で接続確認する。 |
| エラー | 検索 404 のみ空結果。詳細・レビュー 404、認証、レート制限、不正応答、通信失敗は明示する。 |
| 空レビュー | 成功応答の `data:null` のみ空配列に正規化する。HTTP エラーや欠落した `data` は許容しない。 |
| 画像 | 固定ミラーへの書き換えを削除し、MetaTube の画像プロキシ API または情報源 URL を使用する。画像は既定で有効。 |
| 設定 | 接続先、認証、集約ソースの絞り込み、詳細モード、画像・動画・レビュー、拡張項目、タイムアウトの 16 項目を用意する。 |
| 開発 | 単一 CommonJS ソースを Node.js でビルドする。Vite 依存を取り除き、検証用ツールと合成応答テストを同梱する。 |
| 文書 | 日本語を既定とし、英語・簡体字中国語・繁体字中国語・韓国語の説明も更新する。 |

`includeCustomFields` と人物拡張・レビューは独立した設定です。`includeImages=false` は関連画像の設定より優先します。`default` を含む集約ソースのフィルターはサーバーに選択を任せます。

## 互換性の判断

プラグイン ID `metatube`、既存の設定キー `apiUrl`、作者 SkyFrost42、管理・更新先リポジトリを維持しています。追加設定には初期値を定義しています。Inscura のデータベース構造、ライブラリ設定の保存形式、元のメディアファイルには変更を加えません。

今回の契約確認では、Inscura の `docs/plugin-development.md` にある一部の例が実装より古いことが分かりました。作品データの実際の Rust 型 `NormalizedMedia` / `MediaScrapeSearchResult` は `number`、`summary`、`score`、`thumbUrl`、`coverUrl` 等を使用しています。`NormalizedActor` も Skill の現行の返却型と整合しています。本プラグインは実際の型と Skill の `result-types.md` に合わせ、文書例の古い別名を返しません。Inscura 本体の文書やソースは、この更新の対象には含めていません。

標準 MetaTube の情報源一覧を採用しており、experimental ビルド専用の追加ソースは宣言していません。利用するサーバーに未宣言のソースがある場合は、manifest、実行時の一覧、設定の選択肢、取得項目をそろえて更新する必要があります。

## 参照した資料

確認日: 2026-10-28。

- [MetaTube SDK Go](https://github.com/metatube-community/metatube-sdk-go/tree/fdadc9c8e321947fb6533fb0beab2a92f1c2b065): `fdadc9c8e321947fb6533fb0beab2a92f1c2b065`
- [Inscura Scraper Skill](https://github.com/InscuraApp/inscura-scraper-skill/tree/94190ee7704e285b2ae243af6ee9d22fbc8fb983): `94190ee7704e285b2ae243af6ee9d22fbc8fb983`
- Inscura 本体の `src-tauri/src/services/scraper_plugin/types.rs`、`runtime.rs`、`media_scrape/types.rs`、`actor_scrape/types.rs`

検証結果は [README の検証状況](../README.md#検証状況) を参照してください。実サーバーへの接続や Inscura での実行を行わずに、動作確認済みとは記載しません。
