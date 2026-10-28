# MetaTube for Inscura

[日本語](../README.md) · [English](README.en.md) · [简体中文](README.zh-CN.md) · 繁體中文 · [한국어](README.ko.md)

MetaTube 1.1.0 可透過自行架設的 MetaTube 服務，搜尋並取得影片與人物的中繼資料。外掛 ID 維持 `metatube`，支援 `media` 與 `actor`，作者及儲存庫仍為 [SkyFrost42](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin)。

## 安裝與設定

在 Inscura → 設定 → 外掛 → 從 ZIP 安裝，選取 `metatube-v1.1.0.zip`。將服務根網址填入 `apiUrl`，不必加上 `/v1`，可保留反向代理的子路徑。服務啟用驗證時，請在 `apiToken` 填入管理員設定的 Bearer 權杖；未啟用驗證時可留白。權杖只在 Inscura 的設定畫面輸入，不放入原始碼或網址。

啟用外掛會透過受保護的唯讀端點 `/v1/db/version` 測試連線。之後在刮削畫面選取外掛與資料來源。連線成功不代表所有上游來源都可使用。除了連線資訊，其餘設定可沿用預設值。

| 設定 | 鍵 | 必填 | 預設值 | 說明 |
| --- | --- | --- | --- | --- |
| 服務位址 | `apiUrl` | 是 | 留白 | 填寫 MetaTube 根位址，包含 http:// 或 https://。 |
| Bearer 權杖（選填） | `apiToken` | 否 | 留白 | 由服務管理員提供；未開啟驗證時留空。僅透過 Authorization 標頭傳送。 |
| 影片來源 | `movieProviders` | 否 | `["default"]` | 僅選中 MetaTube 時使用。預設或空清單交由服務端選擇；原生來源選擇優先。 |
| 演員來源 | `actorProviders` | 否 | `["default"]` | 僅選中 MetaTube 時使用。空值/default 使用服務端預設；原生來源優先。 |
| 使用快取補全搜尋 | `fallback` | 否 | `true` | 將 fallback 交給 MetaTube，使用資料庫補全搜尋結果，不代表外掛重試。 |
| 詳情模式 | `detailMode` | 否 | `"full"` | 完整模式傳送 lazy=false 更新上游；快取模式傳送 lazy=true。 |
| 回傳圖片 URL | `includeImages` | 否 | `true` | 預設開啟，保留重要圖片資產。回傳圖片 URL；套用中繼資料時 Inscura 下載支援的圖片。仍須遵守來源圖片使用條款。 |
| 圖片位址模式 | `imageMode` | 否 | `"proxy"` | 建議代理模式：MetaTube primary/backdrop 介面區分海報與封面，不附加權杖。直連使用上游 URL；預覽圖片仍使用來源 URL。 |
| 回傳預覽圖片 | `includePreviewImages` | 否 | `true` | 需同時開啟回傳圖片 URL。 |
| 預覽圖片數量上限 | `maxPreviewImages` | 否 | `20` | 限制回傳的預覽圖片 URL 數量，範圍 0–100。 |
| 預覽影片 URL | `previewVideoMode` | 否 | `"auto"` | 自動優先 HLS，其次 MP4。外掛只回傳 URL，不播放或下載影片。 |
| 回傳評論 | `includeReviews` | 否 | `false` | 會額外請求 API，將評論放入自訂文字欄位，預設關閉。評論請求失敗會報錯。 |
| 評論數量上限 | `maxReviews` | 否 | `5` | 限制匯入評論數量，範圍 0–50。為 0 時不請求評論。 |
| 回傳演員延伸欄位 | `includeActorExtendedFields` | 否 | `true` | 回傳已有日期、別名、身高三圍、技能及已宣告的自訂屬性；缺失值不補造。 |
| 回傳來源自訂欄位 | `includeCustomFields` | 否 | `true` | 保留來源 provider/ID、頁面與圖片 URL、來源時長（分鐘），不修改本機檔案時長。 |
| 請求逾時（秒） | `requestTimeout` | 否 | `30` | 單次請求逾時，5–180 秒。 |

## 運作方式

- Inscura 中直接選取的來源優先於 `movieProviders` / `actorProviders`。兩個清單僅在選取彙整來源 MetaTube 時生效。空清單或含有 `default` 的清單會交由伺服器選擇；多個指定來源依序查詢，依 provider 與 ID 的組合排除重複結果。
- 圖片與預覽圖片預設開啟。關閉 `includeImages` 會省略所有圖片網址，包括自訂欄位中的網址。代理模式使用 MetaTube 的 `primary` / `backdrop`，直接模式使用來源網址；預覽圖片與人物圖庫均保留來源網址，不附加權杖。下載、解碼、儲存及顯示是否成功，仍須分別確認。
- 預覽圖片上限為 0–100 張，預設 20 張；0 表示不傳回預覽圖片。影片的 `auto` 優先選用 HLS，其次 MP4。評論預設關閉，開啟後會增加請求；上限為 0–50 則，0 表示不發出請求。已開啟的評論擷取失敗會回報錯誤。
- `includeCustomFields` 控制來源資訊與來源片長；評論及人物延伸欄位由各自的設定獨立控制。來源片長以分鐘存入自訂欄位，不變更本機檔案的片長。
- 僅將已確認的 FANZA 五分制換算成十分制。其他來源尚未確認評分尺度前會省略評分。不以空字串或 0 填補未知欄位，也不從姓名產生虛構人物 ID。影片演職員以 `cast` / `crew` 傳回。
- 標準服務提供 30 個影片來源與 Gfriends 人物來源，另有 MetaTube 彙整選項。這是相容性快照，並非所有網站皆可使用的保證。標準 Gfriends 主要提供姓名、圖片及來源頁面；開啟延伸欄位不會補出來源未提供的生日或三圍。
- 搜尋的 404 代表找不到結果；詳細資料或評論的 404、401/403、429、網路錯誤、無效 JSON 及識別資訊不符均回報錯誤。只有評論成功回應中的 `data:null` 視為沒有評論。不會自動重試。
- MetaTube 搜尋與詳細資料 API 沒有語言參數，外掛不呼叫翻譯 API。設定標籤的五語系支援與 Inscura 的中繼資料翻譯是不同功能；巢狀欄位的實際翻譯結果仍須驗證。

外掛只傳回中繼資料與網址，不讀寫原始媒體。套用中繼資料時，由 Inscura 下載並儲存支援的圖片。

## 來源與驗證

2026-10-28 已核對 [MetaTube 官方原始碼](https://github.com/metatube-community/metatube-sdk-go/tree/fdadc9c8e321947fb6533fb0beab2a92f1c2b065)，涵蓋路由、驗證、模型、圖片、評論、FANZA 評分及 Gfriends 行為。實作以 [Inscura Scraper Skill](https://github.com/InscuraApp/inscura-scraper-skill/tree/94190ee7704e285b2ae243af6ee9d22fbc8fb983) 的 MIT 參考實作為基礎；著作權及授權資訊見根目錄 `ATTRIBUTION.md`、`LICENSE`。SDK 的 Apache-2.0 授權不包含上游中繼資料與圖片的使用權，請遵守各來源的使用條款。尚未查到通用的公開流量上限，收到 429 時請稍後再試。

各層級的驗證狀態以根目錄 [README 驗證紀錄](../README.md#検証状況) 為準。目前未設定實際服務，實網 API、圖片下載與解碼、Inscura 安裝與執行、圖片儲存與顯示，以及翻譯均未驗證。合成回應測試不能取代這些確認。

## 開發與升級

使用 Node.js 18.13 以上版本，無須安裝 npm 相依套件。編輯 `src/index.js` 與 `manifest.json`；`npm run build` 產生單一入口檔，`npm run validate` 驗證，`npm test` 執行測試，`npm run pack` 打包。官方工具與測試位於 `vendor/inscura-scraper-skill/`，合成測試資料不會放入安裝包。

1.1.0 保留外掛 ID 與既有 `apiUrl` 設定鍵，新增項目提供預設值，不遷移資料庫或原始媒體。舊 `movie` 介面改為 `media`，並移除寫死的第三方鏡像網域替換。完整分析見 [更新紀錄（日文）](UPGRADE.md)。
