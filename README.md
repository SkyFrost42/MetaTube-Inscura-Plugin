# MetaTube for Inscura

**日本語** · [English](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin/blob/main/docs/README.en.md) · [简体中文](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin/blob/main/docs/README.zh-CN.md) · [繁體中文（台灣）](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin/blob/main/docs/README.zh-TW.md) · [한국어](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin/blob/main/docs/README.ko.md)

セルフホストの MetaTube サーバーから、作品と人物のメタデータを取得する Inscura 用プラグインです。作品・人物の検索と詳細取得に対応しています。

- バージョン: **1.1.0** / プラグイン ID: `metatube` / `apiVersion: 1`
- 作者・管理リポジトリ: [SkyFrost42](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin)
- 対応機能: `media`・`actor`
- 設定画面: 日本語・英語・簡体字中国語・繁体字中国語・韓国語

日本語を既定の説明とし、英語・簡体字中国語・台湾繁体字中国語・韓国語の README は上部のリンクから参照できます。インストール用 ZIP には、この日本語 README を同梱しています。

## インストール

1. Inscura の **設定 → プラグイン → ZIP からインストール** で、配布された `metatube-v1.1.0.zip` を選択します。
2. `apiUrl` に利用する MetaTube のルート URL を入力します。`http://` または `https://` が必要です。末尾に `/v1` を付ける必要はありません。リバースプロキシのサブパスは指定できます。
3. サーバーで認証を有効にしている場合は、管理者が設定したトークンを `apiToken` に入力します。認証なしの構成では空欄にします。
4. プラグインを有効にします。この操作で、認証対象の読み取り専用 API `/v1/db/version` を使った接続テストが実行されます。
5. メタデータ取得画面で MetaTube と情報源を選び、検索結果から対象を指定します。

URL とトークンの初期値は空欄です。トークンは Inscura の設定画面で入力してください。接続テストの成功は、すべての情報源が利用できることを意味しません。

## 設定

通常は接続情報だけを設定すれば使えます。画像の取得は有効、詳細は情報源へ問い合わせる `full`、レビューの追加取得は無効が初期設定です。サーバー URL は運用するサーバーの公開先、トークンはそのサーバーの管理設定から確認します。それ以外の項目は利用目的に合わせて選択できます。

| 設定 / キー | 必須 | 初期値 | 内容・入手先 |
| --- | --- | --- | --- |
| サーバーURL / `apiUrl` | 必須 | 空欄 | 運用するサーバーのルート URL。サーバー管理者に確認します。 |
| Bearer トークン（任意） / `apiToken` | 任意 | 空欄 | 認証を有効にしたサーバーの管理者が設定するトークン。認証なしの場合は空欄。 |
| 作品の情報源 / `movieProviders` | 任意 | `["default"]` | MetaTube 選択時の検索先。空のリスト、または default を含む場合はサーバーに任せます。 |
| 人物の情報源 / `actorProviders` | 任意 | `["default"]` | MetaTube 選択時の人物の検索先。直接選択した情報源を優先します。 |
| キャッシュで検索結果を補完 / `fallback` | 任意 | `true` | サーバーのデータベースから検索結果を補完します。 |
| 詳細の取得方法 / `detailMode` | 任意 | `"full"` | full は最新情報を取得し、lazy はキャッシュを優先します。 |
| 画像 URL を取得 / `includeImages` | 任意 | `true` | すべての画像 URL を返すかどうかを指定します。 |
| 画像の取得方法 / `imageMode` | 任意 | `"proxy"` | proxy は MetaTube 経由、direct は情報源の URL を使用します。 |
| プレビュー画像を取得 / `includePreviewImages` | 任意 | `true` | 作品のプレビュー写真を返します。画像 URL の取得も有効にする必要があります。 |
| プレビュー画像の最大枚数 / `maxPreviewImages` | 任意 | `20` | 0〜100 枚。0 はプレビュー写真を返しません。 |
| プレビュー動画の形式 / `previewVideoMode` | 任意 | `"auto"` | auto は HLS、MP4 の順に選択。hls、mp4、off も指定できます。 |
| レビューを取得 / `includeReviews` | 任意 | `false` | レビューをカスタム項目として返します。追加リクエストが発生します。 |
| レビューの最大件数 / `maxReviews` | 任意 | `5` | 0〜50 件。0 の場合はレビューを取得しません。 |
| 人物の拡張情報を取得 / `includeActorExtendedFields` | 任意 | `true` | 情報源にあるプロフィール項目と拡張属性を返します。 |
| 情報源のカスタム項目を取得 / `includeCustomFields` | 任意 | `true` | 情報源の ID、URL、分単位の再生時間などを保持します。 |
| タイムアウト（秒） / `requestTimeout` | 任意 | `30` | 各リクエストの待ち時間。5〜180 秒。 |

Inscura 側で個別の情報源を選んだ場合は、その選択を優先します。`movieProviders` と `actorProviders` は、集約ソースの **MetaTube** を選んだときだけ使われます。空のリスト、または `default` を一つでも含むリストは、検索先をサーバーに任せます。複数の情報源は順に検索し、同じ provider と ID の組み合わせだけを重複排除します。

<details>
<summary>ツールによる設定一覧（manifest から自動生成）</summary>

<!-- inscura:config:start -->
| Setting / 设置项 | Key | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- | --- |
| Server URL / 服务地址 | `apiUrl` | text | yes | (empty) | Your MetaTube root URL, including http:// or https://. / 填写 MetaTube 根地址，包含 http:// 或 https://。 |
| Bearer token (optional) / Bearer 令牌（可选） | `apiToken` | password | no | (empty) | Get it from your server administrator; leave empty if authentication is disabled. Sent in Authorization only. / 由服务管理员提供；未开启鉴权时留空。仅经 Authorization 请求头发送。 |
| Movie sources / 影片来源 | `movieProviders` | multiSelect | no | `["default"]` | Used only with the MetaTube source. Default or an empty list lets the server select sources; a native source selection takes priority. / 仅选中 MetaTube 时使用。默认或空列表交由服务端选择；原生来源选择优先。 |
| Actor sources / 演员来源 | `actorProviders` | multiSelect | no | `["default"]` | Used only with MetaTube. Empty/default uses server defaults; selecting a native source overrides this list. / 仅选中 MetaTube 时使用。空值/default 使用服务端默认；原生来源优先。 |
| Include cached search results / 使用缓存补全搜索 | `fallback` | boolean | no | `true` | Pass fallback to MetaTube to supplement searches from its database. This is not a plugin retry loop. / 将 fallback 交给 MetaTube，使用其数据库补全搜索结果，不代表插件重试。 |
| Detail mode / 详情模式 | `detailMode` | select | no | `"full"` (Refresh upstream / 刷新上游) | Full sends lazy=false for upstream refresh; cached sends lazy=true. / 完整模式发送 lazy=false 刷新上游；缓存模式发送 lazy=true。 |
| Include image URLs / 返回图片 URL | `includeImages` | boolean | no | `true` | Enabled by default to preserve image assets. Return image URLs; Inscura downloads supported images when applying metadata. Source image terms still apply. / 默认开启，保留重要图片资产。返回图片 URL；应用元数据时 Inscura 下载受支持的图片。仍须遵守来源图片使用条款。 |
| Image URL mode / 图片地址模式 | `imageMode` | select | no | `"proxy"` (MetaTube proxy URLs / MetaTube 代理 URL) | Proxy is recommended: MetaTube primary/backdrop endpoints distinguish posters and covers without embedding tokens. Direct uses upstream URLs. Preview photos retain their source URLs. / 推荐代理模式：MetaTube primary/backdrop 接口区分海报与封面，不拼接令牌。直连使用上游 URL；预览图片仍使用来源 URL。 |
| Include preview photos / 返回预览图片 | `includePreviewImages` | boolean | no | `true` | Requires image URLs to be enabled. / 需同时开启返回图片 URL。 |
| Maximum preview photos / 预览图片数量上限 | `maxPreviewImages` | number | no | `20` | Limit returned preview photo URLs, from 0 to 100. / 限制返回的预览图片 URL 数量，范围 0–100。 |
| Preview video URL / 预览视频 URL | `previewVideoMode` | select | no | `"auto"` (Auto / 自动) | Auto prefers HLS then MP4. The plugin returns a URL only and never plays or downloads it. / 自动优先 HLS，其次 MP4。插件只返回 URL，不播放或下载视频。 |
| Include reviews / 返回评论 | `includeReviews` | boolean | no | `false` | Makes an extra API request and imports reviews into custom text fields. Disabled by default. A failed review request is reported as an error. / 会额外请求 API，将评论放入自定义文本字段，默认关闭。评论请求失败会报错。 |
| Maximum reviews / 评论数量上限 | `maxReviews` | number | no | `5` | Limit imported reviews, from 0 to 50. Zero skips the reviews request. / 限制导入评论数量，范围 0–50。为 0 时不请求评论。 |
| Include extended actor fields / 返回演员扩展字段 | `includeActorExtendedFields` | boolean | no | `true` | Return available dates, aliases, measurements, skills and declared custom traits. Missing values stay omitted. / 返回已有日期、别名、身高三围、技能及已声明的自定义属性；缺失值不补造。 |
| Include source custom fields / 返回来源自定义字段 | `includeCustomFields` | boolean | no | `true` | Preserve source provider/ID, page and image URLs, and source runtime in minutes. Does not modify the local file duration. / 保留来源 provider/ID、页面与图片 URL、来源时长（分钟），不修改本地文件时长。 |
| Request timeout (seconds) / 请求超时（秒） | `requestTimeout` | number | no | `30` | Per-request timeout, 5–180 seconds. / 单次请求超时，5–180 秒。 |

The scraping language is injected by Inscura as `ctx.config.language`; it is not a plugin setting.
<!-- inscura:config:end -->

</details>

- `includeImages` を無効にすると、カスタム項目を含むすべての画像 URL を省略します。プレビュー写真もこの設定に従います。
- `proxy` は MetaTube の `primary` / `backdrop` API を使います。`direct` は情報源の URL を使います。プレビュー写真と人物の写真一覧には、どちらの場合も情報源の URL を使います。画像 URL にトークンは付けません。
- プレビュー写真の上限は 0〜100 枚です。初期値は 20 枚、0 は写真を返さない指定です。動画の `auto` は HLS を優先し、なければ MP4 を選びます。
- レビューは追加リクエストを伴います。取得数の上限は 0〜50 件で、0 の場合は問い合わせません。有効にしたレビュー取得の失敗はエラーとして通知します。
- `includeCustomFields` は提供元情報と再生時間のカスタム項目を制御します。人物の拡張項目とレビューは、それぞれの設定で独立して制御します。
- `fallback` はサーバー内のデータベースを使った検索結果の補完です。`full` は `lazy=false`、`lazy` は `lazy=true` を送信します。プラグイン内での自動再試行は行いません。
- タイムアウトはリクエストごとに 5〜180 秒の範囲で適用します。初期値は 30 秒です。

## 取得できるデータ

作品ではタイトル、番号、あらすじ、出演者・スタッフ、メーカー、レーベル、シリーズ、ジャンル、発売日、画像、プレビュー動画を扱います。人物では氏名、画像、提供元ページに加え、サーバーが返す場合に限り別名やプロフィール項目を扱います。**標準の Gfriends は主に氏名・画像・提供元ページを返します。設定を有効にしても、上流にない生年月日やスリーサイズを補うことはできません。**

評価は尺度を確認できた FANZA の 5 点満点を 10 点満点に換算します。ほかの情報源の評価は、尺度を確認するまで省略します。不明な値を空文字や 0 で補完したり、人物名から架空の ID を生成したりしません。情報源が返す再生時間は分単位のカスタム項目に保存でき、ローカルファイルの再生時間を書き換えません。

標準ビルドの MetaTube に合わせて、集約ソースと 30 個の作品ソース、人物ソース Gfriends を宣言しています。これは互換性のためのスナップショットです。独自ビルドで追加されたソースや、現在停止中の情報源まで利用できることを保証するものではありません。

検索 API の 404 は「該当なし」として返します。詳細・レビュー取得の 404、認証エラー、429、通信失敗、不正な JSON、ID の不一致はエラーです。レビューの成功応答で `data: null` が返った場合だけ、空のレビューとして扱います。

MetaTube の検索・詳細 API に言語指定はないため、翻訳 API は呼びません。設定ラベルの多言語対応と、Inscura による取得後のメタデータ翻訳は別の機能です。翻訳可能な項目は宣言していますが、入れ子のクレジットやカスタム項目が実際に翻訳されるかは、利用する Inscura のビルドと設定に依存します。

プラグインが返すのはメタデータと URL だけです。元のメディアファイルを読み書きしたり、画像・動画を直接保存したりしません。対応画像のダウンロードと保存は、メタデータ適用時に Inscura が行います。

## 謝辞

このプラグインの開発を支える、次のプロジェクトと開発者・貢献者の皆さまに感謝します。

- [MetaTube](https://github.com/metatube-community/metatube-sdk-go): 作品・人物のメタデータを取得する API と、セルフホスト可能なサーバーを提供してくださっています。
- [Inscura](https://inscura.app): メディアライブラリとプラグインの仕組み、開発仕様を提供してくださっています。[Inscura Scraper Skill](https://github.com/InscuraApp/inscura-scraper-skill) の参照実装と検証ツールも活用しています。

使用した実装の著作権表示とライセンスは [ATTRIBUTION.md](ATTRIBUTION.md) と [LICENSE](LICENSE) を参照してください。

## データソースとライセンス

2026-10-28 に [MetaTube SDK Go](https://github.com/metatube-community/metatube-sdk-go/tree/fdadc9c8e321947fb6533fb0beab2a92f1c2b065) のルーティング、認証、作品・人物モデル、画像・レビュールート、FANZA の評価尺度、Gfriends の実装を確認しました。確認したコミットは `fdadc9c8e321947fb6533fb0beab2a92f1c2b065` です。利用するサーバーのバージョンや設定は別途確認が必要です。

実装は [Inscura Scraper Skill](https://github.com/InscuraApp/inscura-scraper-skill/tree/94190ee7704e285b2ae243af6ee9d22fbc8fb983) の MetaTube 参照実装をもとにしています。著作権表示と MIT ライセンスは同梱の `LICENSE` に記載しています。詳しくは `ATTRIBUTION.md` を参照してください。

MetaTube SDK の Apache-2.0 ライセンスは、情報源が提供するメタデータや画像の利用権を許諾するものではありません。各情報源の利用条件に従ってください。全情報源に共通する公開のレート上限は確認できていません。429 が返った場合は、時間を置いてから再実行してください。

## 検証状況

| Level | Status | 確認内容・残っている項目 |
| --- | --- | --- |
| Static | passed | 2026-10-28: ソースの構造・宣言・構文・公開メソッドを検証。887 組の表示文言と 33 件の情報源ラベルについて、5 言語の欠落がないことを確認。 |
| Fixtures | passed | 2026-10-28: 参照仕様の 11 テストと空レビューの回帰テストが成功（12/12）。作品 FANZA・人物 Gfriends の検索から詳細取得までの 2 経路も成功。設定切り替え、画像 URL、認証・HTTP・不正応答を確認。 |
| Live API | not run | 接続先が未設定。実サーバーでの認証、検索から詳細取得、画像 URL の取得・デコードは未確認。 |
| In-app | not run | 実際の Inscura でのインストール、QuickJS 実行、画像保存・表示、翻訳は未確認。 |

実行環境は macOS / Node.js 26.7.0 です。検証ツールは制約付きの Node.js VM を使っており、QuickJS 本体や Windows での実行は未確認です。最終 ZIP の展開後の検証結果は、アーカイブ外の納品レポートを参照してください。

合成応答による検証は、実サーバーや情報源への到達性を示すものではありません。画像 URL の生成と、画像のダウンロード・デコード・保存・表示は、それぞれ別に検証する必要があります。ZIP の最終 SHA-256 と詳細な実行記録は、アーカイブの外にある納品レポートに記録します。

## 開発

Node.js 18.13 以降を使用します。npm パッケージの追加インストールは不要です。編集対象は `src/index.js` と `manifest.json` で、ビルド後の `index.js` は QuickJS で直接実行する単一の CommonJS ファイルです。

```sh
npm run build
npm run validate
npm test
npm run pack
```

検証用ツールは `vendor/inscura-scraper-skill/` に同梱しています。`fixtures/` のデータは架空の検証用データです。ビルドやテストは原本のメディアやライブラリにアクセスしません。インストール用 ZIP には `manifest.json`、`index.js`、`README.md`、`ATTRIBUTION.md`、`LICENSE` だけを含めます。

1.0.5 からの変更点と互換性の判断は、ソースツリーの `docs/UPGRADE.md` にまとめています。プラグイン ID と既存の `apiUrl` は維持しています。新しい項目には初期値があり、データベースの変更や既存メディアの移行は行いません。
