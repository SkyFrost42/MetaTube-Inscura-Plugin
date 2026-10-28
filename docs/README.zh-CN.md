# MetaTube for Inscura

[日本語](../README.md) · [English](README.en.md) · **简体中文** · [繁體中文（台灣）](README.zh-TW.md) · [한국어](README.ko.md)

MetaTube 1.1.0 通过你自建的 MetaTube 服务刮削影片和人物信息，支持搜索与详情获取。插件 ID 保持为 `metatube`，能力为 `media` 和 `actor`，作者及仓库仍为 [SkyFrost42](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin)。

## 安装与配置

在 Inscura → 设置 → 插件 → 从 ZIP 安装，选择 `metatube-v1.1.0.zip`。填入服务根地址 `apiUrl`，不需要追加 `/v1`，可以保留反向代理子路径；服务启用鉴权时，再填写管理员设置的 Bearer 令牌 `apiToken`。令牌仅在 Inscura 中填写，不放入源码或 URL。服务未启用鉴权时可留空。

启用插件会访问受保护的只读接口 `/v1/db/version` 进行连接测试。随后在刮削界面选择插件和来源。连接测试成功不代表每个上游来源都可用。除连接信息外，其余配置可采用默认值。

| 设置 / 键 | 必填 | 默认值 | 用途 / 取值来源 |
| --- | --- | --- | --- |
| 服务地址 / `apiUrl` | 是 | 空 | 由服务器管理员提供 MetaTube 根地址，包含 http:// 或 https://。 |
| Bearer 令牌（可选） / `apiToken` | 否 | 空 | 由服务管理员提供；未开启鉴权时留空。仅经 Authorization 请求头发送。 |
| 影片来源 / `movieProviders` | 否 | `["default"]` | 仅选中 MetaTube 时使用。默认或空列表交由服务端选择；原生来源选择优先。 |
| 演员来源 / `actorProviders` | 否 | `["default"]` | 仅选中 MetaTube 时使用。空值/default 使用服务端默认；原生来源优先。 |
| 使用缓存补全搜索 / `fallback` | 否 | `true` | 将 fallback 交给 MetaTube，使用其数据库补全搜索结果，不代表插件重试。 |
| 详情模式 / `detailMode` | 否 | `"full"` | 完整模式发送 lazy=false 刷新上游；缓存模式发送 lazy=true。 |
| 返回图片 URL / `includeImages` | 否 | `true` | 默认开启，保留重要图片资产。返回图片 URL；应用元数据时 Inscura 下载受支持的图片。仍须遵守来源图片使用条款。 |
| 图片地址模式 / `imageMode` | 否 | `"proxy"` | 推荐代理模式：MetaTube primary/backdrop 接口区分海报与封面，不拼接令牌。直连使用上游 URL；预览图片仍使用来源 URL。 |
| 返回预览图片 / `includePreviewImages` | 否 | `true` | 需同时开启返回图片 URL。 |
| 预览图片数量上限 / `maxPreviewImages` | 否 | `20` | 限制返回的预览图片 URL 数量，范围 0–100。 |
| 预览视频 URL / `previewVideoMode` | 否 | `"auto"` | 自动优先 HLS，其次 MP4。插件只返回 URL，不播放或下载视频。 |
| 返回评论 / `includeReviews` | 否 | `false` | 会额外请求 API，将评论放入自定义文本字段，默认关闭。评论请求失败会报错。 |
| 评论数量上限 / `maxReviews` | 否 | `5` | 限制导入评论数量，范围 0–50。为 0 时不请求评论。 |
| 返回演员扩展字段 / `includeActorExtendedFields` | 否 | `true` | 返回已有日期、别名、身高三围、技能及已声明的自定义属性；缺失值不补造。 |
| 返回来源自定义字段 / `includeCustomFields` | 否 | `true` | 保留来源 provider/ID、页面与图片 URL、来源时长（分钟），不修改本地文件时长。 |
| 请求超时（秒） / `requestTimeout` | 否 | `30` | 单次请求超时，5–180 秒。 |

## 行为说明

- Inscura 中直接选择的来源优先于 `movieProviders` / `actorProviders`。这两个列表只在选择聚合来源 MetaTube 时生效。空列表或包含 `default` 的任何列表均交由服务端选择；多个具体来源依次查询，以 provider 和 ID 的组合去重。
- 图片及预览图默认开启。`includeImages=false` 会省略所有图片 URL，包括自定义字段中的图片地址。代理模式使用 MetaTube 的 `primary` / `backdrop`；直连模式使用源站地址。预览图和人物图库始终保留源站 URL，图片 URL 不附带令牌。图片能否下载、解码、保存与展示仍需分别验证。
- 预览图上限为 0–100，默认 20；设为 0 时不返回预览图。视频 `auto` 优先 HLS，再选 MP4。评论默认关闭，启用后增加请求；评论上限为 0–50，0 表示不请求。主动启用的评论获取失败会报错。
- `includeCustomFields` 只控制来源信息与来源时长；评论及人物扩展字段由各自开关独立控制。来源时长以分钟保存在自定义字段，不会改写本地文件时长。
- 仅将已核实的 FANZA 五分制换算为十分制；其他来源的评分尺度未核实前省略。未知字段不填入空字符串或 0，不从人物姓名伪造 ID。影片演职人员使用 `cast` / `crew`。
- 标准服务声明 30 个影片来源及人物来源 Gfriends，另提供 MetaTube 聚合选择。这是兼容快照，不保证所有站点可用。标准 Gfriends 主要提供姓名、图片和来源页面；人物扩展开关不会补造不存在的生日、三围等信息。
- 搜索 404 表示无匹配；详情或评论 404、401/403、429、网络错误、无效 JSON 及身份不一致均报错。仅评论成功响应中的 `data:null` 视为空评论。没有自动重试。
- MetaTube 搜索和详情没有语言参数，插件不调用翻译 API。五语言配置标签与 Inscura 的元数据翻译是不同能力，嵌套字段的实际翻译效果仍需验证。

插件只返回元数据和 URL，不读取或改写原始媒体。下载和保存受支持的图片由 Inscura 在应用元数据时完成。

## 致谢

感谢以下项目的开发者和贡献者，为本插件提供基础能力与开发支持：

- [MetaTube](https://github.com/metatube-community/metatube-sdk-go)：提供影片与人物元数据 API，以及可自行部署的服务端。
- [Inscura](https://inscura.app)：提供媒体库、插件机制与开发规范。本插件还使用了 [Inscura Scraper Skill](https://github.com/InscuraApp/inscura-scraper-skill) 的参考实现和校验工具。

源码署名与许可详见 [ATTRIBUTION.md](../ATTRIBUTION.md) 和 [LICENSE](../LICENSE)。项目默认首页为日文，可通过顶部导航切换语言。

## 来源与验证

2026-10-28 核对了 [MetaTube 官方源码](https://github.com/metatube-community/metatube-sdk-go/tree/fdadc9c8e321947fb6533fb0beab2a92f1c2b065)，包括路由、鉴权、模型、图片、评论、FANZA 评分和 Gfriends 行为。实现基于 [Inscura Scraper Skill](https://github.com/InscuraApp/inscura-scraper-skill/tree/94190ee7704e285b2ae243af6ee9d22fbc8fb983) 的 MIT 参考实现；署名与许可见根目录 `ATTRIBUTION.md`、`LICENSE`。SDK 的 Apache-2.0 许可不授予上游元数据和图片的使用权，请遵守各来源条款。未查到统一公开限流值，遇到 429 请稍后再试。

具体验证状态以根目录 [README 的验证记录](../README.md#検証状況) 为准。当前未配置真实服务，实网 API、图片下载与解码、Inscura 安装和运行、图片保存与展示、翻译均未验证。合成响应测试不能替代这些验证。

## 开发与升级

Node.js 18.13 及以上，无需安装 npm 依赖。编辑 `src/index.js` 和 `manifest.json`；`npm run build` 生成单文件入口，`npm run validate` 校验，`npm test` 运行测试，`npm run pack` 打包。官方工具和测试在 `vendor/inscura-scraper-skill/`，合成测试数据不会进入安装包。

1.1.0 保留插件 ID 与已有 `apiUrl` 键，新增项提供默认值，不进行数据库或原始媒体迁移。旧 `movie` 接口升级为 `media`，同时移除了硬编码第三方镜像域名替换。完整分析见 [更新记录（日语）](UPGRADE.md)。
