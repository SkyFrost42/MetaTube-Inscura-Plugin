# 謝辞と出典

本プラグインの開発を支える MetaTube と Inscura、および各プロジェクトの開発者・貢献者の皆さまに感謝します。

## Inscura

[Inscura](https://inscura.app) は、本プラグインが動作するメディアライブラリとプラグインの仕組み、開発仕様を提供しています。[InscuraApp](https://github.com/InscuraApp) が公開する以下の参照実装と検証ツールを、本プロジェクトでも活用しています。

## Inscura Scraper Skill

このプラグインは [InscuraApp/inscura-scraper-skill](https://github.com/InscuraApp/inscura-scraper-skill/tree/94190ee7704e285b2ae243af6ee9d22fbc8fb983) の MetaTube 参照実装をもとにしています。

- 参照コミット: `94190ee7704e285b2ae243af6ee9d22fbc8fb983`
- 著作権表示: Copyright (c) 2026 Inscura contributors
- ライセンス: MIT。全文は同梱の `LICENSE` を参照してください。

プラグインの管理リポジトリと作者表示は [SkyFrost42/MetaTube-Inscura-Plugin](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin) を引き継いでいます。参照実装には、本プロジェクトの識別情報、現行 API との互換性、空レビューの処理、日本語のコメントと文書を反映しています。検証用ツールの原文の著作権表示とライセンスは維持しています。

## MetaTube SDK Go

[MetaTube](https://github.com/metatube-community/metatube-sdk-go) が提供する、作品・人物のメタデータ API とセルフホスト可能なサーバーに感謝します。

API の仕様確認に [metatube-community/metatube-sdk-go](https://github.com/metatube-community/metatube-sdk-go/tree/fdadc9c8e321947fb6533fb0beab2a92f1c2b065) を参照しました。確認日は 2026-10-28、コミットは `fdadc9c8e321947fb6533fb0beab2a92f1c2b065` です。

MetaTube SDK は Apache-2.0 ライセンスで公開されています。このプラグインの配布 ZIP に SDK の Go ソース、取得済みのメタデータ、画像、認証情報は含めていません。SDK のライセンスは、情報源が提供するメタデータや画像の使用権を許諾するものではありません。各情報源の利用条件と権利表示に従ってください。
