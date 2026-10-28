# MetaTube for Inscura

[日本語](../README.md) · **English** · [简体中文](README.zh-CN.md) · [繁體中文（台灣）](README.zh-TW.md) · [한국어](README.ko.md)

MetaTube 1.1.0 searches and retrieves movie and person metadata from your self-hosted MetaTube server. The plugin keeps ID `metatube`, author and repository [SkyFrost42](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin), and implements the current `media` and `actor` capabilities.

## Install and configure

In Inscura → Settings → Plugins → Install from ZIP, select `metatube-v1.1.0.zip`. Set `apiUrl` to your server root URL, including HTTP or HTTPS; do not append `/v1`. A reverse-proxy base path is supported. Enter the administrator-configured Bearer token in `apiToken` only if your server requires authentication. Keep tokens in Inscura settings, never in source files or URLs.

Enabling the plugin tests the protected, read-only `/v1/db/version` endpoint. Then select the plugin and source in the scraping interface. A connection test does not establish that every upstream source works. Defaults are suitable for the remaining settings.

| Setting | Key | Required | Default | Description |
| --- | --- | --- | --- | --- |
| Server URL | `apiUrl` | yes | empty | Your MetaTube root URL, including http:// or https://. |
| Bearer token (optional) | `apiToken` | no | empty | Get it from your server administrator; leave empty if authentication is disabled. Sent in Authorization only. |
| Movie sources | `movieProviders` | no | `["default"]` | Used only with the MetaTube source. Default or an empty list lets the server select sources; a native source selection takes priority. |
| Actor sources | `actorProviders` | no | `["default"]` | Used only with MetaTube. Empty/default uses server defaults; selecting a native source overrides this list. |
| Include cached search results | `fallback` | no | `true` | Pass fallback to MetaTube to supplement searches from its database. This is not a plugin retry loop. |
| Detail mode | `detailMode` | no | `"full"` | Full sends lazy=false for upstream refresh; cached sends lazy=true. |
| Include image URLs | `includeImages` | no | `true` | Enabled by default to preserve image assets. Return image URLs; Inscura downloads supported images when applying metadata. Source image terms still apply. |
| Image URL mode | `imageMode` | no | `"proxy"` | Proxy is recommended: MetaTube primary/backdrop endpoints distinguish posters and covers without embedding tokens. Direct uses upstream URLs. Preview photos retain their source URLs. |
| Include preview photos | `includePreviewImages` | no | `true` | Requires image URLs to be enabled. |
| Maximum preview photos | `maxPreviewImages` | no | `20` | Limit returned preview photo URLs, from 0 to 100. |
| Preview video URL | `previewVideoMode` | no | `"auto"` | Auto prefers HLS then MP4. The plugin returns a URL only and never plays or downloads it. |
| Include reviews | `includeReviews` | no | `false` | Makes an extra API request and imports reviews into custom text fields. Disabled by default. A failed review request is reported as an error. |
| Maximum reviews | `maxReviews` | no | `5` | Limit imported reviews, from 0 to 50. Zero skips the reviews request. |
| Include extended actor fields | `includeActorExtendedFields` | no | `true` | Return available dates, aliases, measurements, skills and declared custom traits. Missing values stay omitted. |
| Include source custom fields | `includeCustomFields` | no | `true` | Preserve source provider/ID, page and image URLs, and source runtime in minutes. Does not modify the local file duration. |
| Request timeout (seconds) | `requestTimeout` | no | `30` | Per-request timeout, 5–180 seconds. |

## Behavior

- A source selected directly in Inscura overrides `movieProviders` / `actorProviders`. These filters apply only to the aggregate MetaTube source. An empty list or any list containing `default` delegates source selection to the server. Multiple concrete sources are queried sequentially and deduplicated by provider plus ID.
- Images and preview photos default on. Disabling `includeImages` removes every image URL, including custom fields. Proxy mode uses MetaTube `primary` / `backdrop`; direct mode keeps upstream URLs. Preview photos and actor galleries retain upstream URLs in either mode. Tokens are never appended to image URLs. Retrieval, decoding, persistence and display need separate verification.
- Preview photos are limited to 0–100, default 20; zero disables them. Video `auto` prefers HLS, then MP4. Reviews default off and require an extra request when enabled; the limit is 0–50, with zero skipping the request. Requested review failures are reported as errors.
- `includeCustomFields` controls source provenance and runtime. Reviews and actor extensions have independent controls. Source runtime is a custom value in minutes and never changes the local file duration.
- Only the verified FANZA five-point rating scale is converted to ten points. Other scales are omitted until verified. Unknown data is not padded with empty strings or zeros, and names are never fabricated into actor IDs. Movie credits use `cast` / `crew`.
- The standard-server snapshot declares 30 movie sources, Gfriends for actors, and the aggregate MetaTube selector. This is not a guarantee of upstream availability. Standard Gfriends mainly supplies names, images and source pages; enabling extensions cannot produce missing birthdays or measurements.
- Search 404 means no match. Detail/review 404, 401/403, 429, network errors, malformed JSON and mismatched identities remain errors. Only successful review `data:null` becomes an empty review list. There are no automatic retries.
- MetaTube search/detail APIs have no language parameter; the plugin does not call translation APIs. Five-language settings labels and Inscura metadata translation are separate. Actual translation of nested fields remains unverified.

The plugin returns metadata and URLs only. It does not access or modify original media. Inscura downloads and saves supported images when applying metadata.

## Acknowledgements

Thank you to the developers and contributors behind the projects that make this plugin possible:

- [MetaTube](https://github.com/metatube-community/metatube-sdk-go) provides the movie and person metadata API and self-hosted server used by this plugin.
- [Inscura](https://inscura.app) provides the media library, plugin system and development specification. This plugin also uses the reference implementation and validation tools from [Inscura Scraper Skill](https://github.com/InscuraApp/inscura-scraper-skill).

See [ATTRIBUTION.md](../ATTRIBUTION.md) and [LICENSE](../LICENSE) for source credits and license details.

## Sources and verification

[Official MetaTube source](https://github.com/metatube-community/metatube-sdk-go/tree/fdadc9c8e321947fb6533fb0beab2a92f1c2b065) was reviewed on 2026-10-28 for routes, authentication, models, images, reviews, FANZA ratings and Gfriends behavior. The implementation adapts the MIT reference in [Inscura Scraper Skill](https://github.com/InscuraApp/inscura-scraper-skill/tree/94190ee7704e285b2ae243af6ee9d22fbc8fb983); see root `ATTRIBUTION.md` and `LICENSE`. The SDK's Apache-2.0 license does not license upstream metadata or images. Follow source terms. No universal published rate limit was found; retry later after HTTP 429.

See the root [verification record](../README.md#検証状況) for per-level status. No real server is configured: live API, image retrieval/decoding, installation and execution in Inscura, image persistence/display and translation have not been tested. Synthetic responses cannot establish those outcomes.

## Development and upgrade

Use Node.js 18.13 or newer; no npm dependency installation is needed. Edit `src/index.js` and `manifest.json`. Run `npm run build`, `npm run validate`, `npm test` and `npm run pack` for build, validation, tests and packaging. The upstream toolkit is bundled under `vendor/inscura-scraper-skill/`. Synthetic fixtures are excluded from install packages.

Version 1.1.0 keeps the plugin ID and existing `apiUrl` key. New settings have defaults; there is no database or original-media migration. The old `movie` API becomes `media`, and the hardcoded third-party mirror rewrite is removed. See [upgrade notes in Japanese](UPGRADE.md).
