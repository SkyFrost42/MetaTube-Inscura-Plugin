# MetaTube Inscura 插件

语言版本：[English](README.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

这是一个面向 Inscura 的 MetaTube 元数据刮削插件，用于通过 MetaTube 兼容 API 获取影片与演员信息。
本插件本身不提供元数据服务，也不内置任何站点数据。它只是把 Inscura 的刮削请求转发到你填写的 MetaTube API 服务。

插件遵循 Inscura 的插件开发规范实现，当前同时支持：

- 影片搜索与影片详情刮削
- 演员搜索与演员详情刮削

## 功能说明

本插件声明了 `movie` 和 `actor` 两项能力，因此可在 Inscura 中用于以下场景：

- 通过番号、标题或关键词搜索影片
- 获取影片详情，包括标题、简介、导演、演员、评分、发行日期、封面、样张和预览视频等信息
- 搜索演员
- 获取演员详情，包括别名、生日、身高、三围、国籍、头像和照片等信息

## 安装方法

1. 从项目的 [GitHub Releases](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin/releases) 页面下载正式发布的插件 `.zip` 安装包。
2. 在 Inscura 的插件管理界面安装该 `.zip` 包。
3. 安装完成后，填写插件配置中的 `API Base URL`。
4. 执行测试并启用插件。

如果插件测试通过，说明 Inscura 已能够访问你配置的 MetaTube 服务。

## 配置说明

当前插件只有一个必填配置项：

- `apiUrl`：MetaTube API 的基础地址

示例：

```text
https://your-metatube-server.com
```

请填写服务根地址，不要手动追加 `/v1`。插件会自动请求以下接口：

- `/v1/movies/search?q=...`
- `/v1/movies/{provider}/{id}`
- `/v1/actors/search?q=...`
- `/v1/actors/{provider}/{id}`

## 使用方法

完成安装和配置后，你可以在 Inscura 中直接使用该插件进行刮削：

1. 在插件管理中启用 MetaTube 插件。
2. 确认 `API Base URL` 可正常访问。
3. 在影片或演员刮削界面选择该插件。
4. 输入关键词进行搜索。
5. 从搜索结果中选择正确条目并写入元数据。

## 测试与激活

插件实现了 `test(ctx)` 方法。Inscura 在测试或激活插件时，会先访问你配置的 `apiUrl` 根地址。

这意味着：

- `apiUrl` 不能为空
- 目标服务必须可从 Inscura 所在环境访问
- 根地址需要返回成功状态码，否则插件测试会失败

如果测试失败，常见原因通常是地址填写错误、服务未启动、服务不可达，或你填入了错误的路径。

## 注意事项

- 这是一个依赖远程 MetaTube 服务的插件，无法离线工作。
- 插件不会直接抓取网页，而是依赖 MetaTube 兼容 API 返回结构化数据。
- 建议始终使用 Releases 页面提供的正式发布包，不要随意安装来源不明或自行修改后再分发的构建产物。
- `apiUrl` 应填写站点根地址，例如 `https://example.com`，而不是 `https://example.com/v1`。
- 影片和演员的最终数据质量，取决于你所连接的 MetaTube 服务及其上游数据源。
- 如果服务端返回非 2xx 状态码，插件会将其视为失败。
- 如果服务端字段缺失，插件会回退为空字符串、空数组或 `0`，因此部分条目可能出现信息不完整的情况。
- 当前插件适用于 Inscura API Version 1。

## 合规与法律风险说明

- 本插件仅用于合法的媒体信息整理、索引和元数据管理用途。
- 用户应自行确认对目标 MetaTube 服务、上游数据源及相关媒体内容拥有合法访问和使用权限。
- 请遵守你所在司法辖区的法律法规，以及目标服务的使用条款、版权规则、隐私规则和数据抓取政策。
- 请勿使用本插件获取、整理、传播或分发任何侵犯版权、隐私权、肖像权或其他合法权益的内容。
- 如果相关内容在你的地区受年龄、内容分级、网络访问或传播限制，你应自行承担合规判断与使用责任。
- 插件作者与维护者不对第三方服务返回的数据合法性、完整性、可用性或持续性作保证。
- 本插件不内置任何受保护媒体内容，也不提供用于绕过付费、鉴权、地域限制或其他访问控制的能力。

以上说明不构成法律意见。如你的使用场景涉及版权合规、内容合规或跨境访问风险，建议先咨询专业法律意见。

## 返回的数据范围

影片数据通常包括：

- 基本标识：`id`、`provider`、`number`
- 文本信息：`title`、`summary`、`director`
- 关联信息：`actors`、`maker`、`label`、`series`、`genres`
- 媒体资源：`thumbUrl`、`coverUrl`、`bigThumbUrl`、`bigCoverUrl`、`previewVideoUrl`、`photos`
- 其他信息：`score`、`releaseDate`

演员数据通常包括：

- 基本标识：`id`、`provider`、`name`
- 个人信息：`aliases`、`birthday`、`height`、`measurements`、`nationality`
- 媒体资源：`avatar`、`photos`

## 适用对象

这个插件适合以下用户：

- 已经部署或能够访问 MetaTube 兼容服务的 Inscura 用户
- 希望在 Inscura 中统一使用 MetaTube 数据进行影片与演员刮削的用户
- 希望将 Inscura 与 MetaTube 社区生态接入的用户

## 已知限制

- 插件目前没有额外的高级筛选配置项。
- 插件不负责账号登录、反爬处理、代理配置或服务部署。
- 演员详情中的描述、出道日期、技能和社交链接当前未由插件填充。
- 实际可用字段取决于服务端返回内容，不保证每个条目都完整。

## 语言版本

- [English](README.md)
- [简体中文](README.zh-CN.md)
- [繁體中文](README.zh-TW.md)
- [日本語](README.ja.md)
- [한국어](README.ko.md)
