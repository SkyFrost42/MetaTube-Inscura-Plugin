# MetaTube Inscura 外掛

語言版本：[English](../README.md) | [简体中文](README.zh-CN.md) | 繁體中文 | [日本語](README.ja.md) | [한국어](README.ko.md)

這是一個面向 Inscura 的 MetaTube 中繼資料刮削外掛，用於透過 MetaTube 相容 API 取得影片與演員資訊。
此外掛本身不提供任何中繼資料服務，也不內建任何站點資料。它只是將 Inscura 的刮削請求轉發到你所設定的 MetaTube API 服務。

此外掛依照 Inscura 的外掛開發規範實作，目前同時支援：

- 影片搜尋與影片詳情刮削
- 演員搜尋與演員詳情刮削

## 功能說明

此外掛宣告了 `movie` 與 `actor` 兩項能力，因此可在 Inscura 中用於以下場景：

- 依番號、標題或關鍵字搜尋影片
- 取得影片詳情，包括標題、簡介、導演、演員、評分、發行日期、封面、樣張與預覽影片等資訊
- 搜尋演員
- 取得演員詳情，包括別名、生日、身高、三圍、國籍、頭像與照片等資訊

## 安裝方法

1. 從專案的 [GitHub Releases](https://github.com/SkyFrost42/MetaTube-Inscura-Plugin/releases) 頁面下載正式發布的外掛 `.zip` 安裝包。
2. 在 Inscura 的外掛管理介面安裝該 `.zip` 套件。
3. 安裝完成後，填寫外掛設定中的 `API Base URL`。
4. 執行測試並啟用外掛。

如果測試通過，表示 Inscura 已能存取你設定的 MetaTube 服務。

## 設定說明

目前此外掛只有一個必填設定項：

- `apiUrl`：MetaTube API 的基礎網址

範例：

```text
https://your-metatube-server.com
```

請填寫服務根網址，不要手動加上 `/v1`。外掛會自動請求以下端點：

- `/v1/movies/search?q=...`
- `/v1/movies/{provider}/{id}`
- `/v1/actors/search?q=...`
- `/v1/actors/{provider}/{id}`

## 使用方法

完成安裝與設定後，你可以直接在 Inscura 中使用此外掛進行刮削：

1. 在外掛管理中啟用 MetaTube 外掛。
2. 確認 `API Base URL` 可以正常存取。
3. 在影片或演員刮削介面選擇此外掛。
4. 輸入關鍵字進行搜尋。
5. 從搜尋結果中選擇正確條目並寫入中繼資料。

## 測試與啟用

此外掛實作了 `test(ctx)` 方法。當 Inscura 測試或啟用外掛時，會先請求你所設定的 `apiUrl` 根網址。

這表示：

- `apiUrl` 不能為空
- 目標服務必須可從 Inscura 所在環境存取
- 根網址必須回傳成功狀態碼，否則外掛測試會失敗

如果測試失敗，常見原因通常是網址填寫錯誤、服務未啟動、服務不可達，或你填入了錯誤的路徑。

## 注意事項

- 這是一個依賴遠端 MetaTube 服務的外掛，無法離線運作。
- 外掛不會直接抓取網站，而是依賴 MetaTube 相容 API 回傳的結構化資料。
- 建議始終使用 Releases 頁面提供的正式發布包，不要隨意安裝來源不明或自行修改後再散布的建置產物。
- `apiUrl` 應填寫站點根網址，例如 `https://example.com`，而不是 `https://example.com/v1`。
- 影片與演員的最終資料品質，取決於你所連接的 MetaTube 服務及其上游資料來源。
- 如果服務端回傳非 2xx 狀態碼，外掛會將其視為失敗。
- 如果服務端欄位缺失，外掛會回退為空字串、空陣列或 `0`，因此部分條目可能出現資訊不完整的情況。
- 目前此外掛適用於 Inscura API Version 1。

## 合規與法律風險說明

- 此外掛僅用於合法的媒體資訊整理、索引與中繼資料管理用途。
- 使用者應自行確認對目標 MetaTube 服務、上游資料來源及相關媒體內容擁有合法的存取與使用權限。
- 請遵守你所在地司法轄區的法律法規，以及目標服務的使用條款、著作權規則、隱私規則與資料抓取政策。
- 請勿使用此外掛取得、整理、傳播或散布任何侵害著作權、隱私權、肖像權或其他合法權益的內容。
- 如果相關內容在你的地區受到年齡分級、內容分級、網路存取或傳播限制，你應自行承擔合規判斷與使用責任。
- 外掛作者與維護者不對第三方服務回傳資料的合法性、完整性、可用性或持續性作任何保證。
- 此外掛不內建任何受保護媒體內容，也不提供用於繞過付費、驗證、地域限制或其他存取控制的能力。

以上說明不構成法律意見。如果你的使用情境涉及著作權合規、內容合規或跨境存取風險，建議先諮詢專業法律意見。

## 回傳資料範圍

影片資料通常包括：

- 基本識別：`id`、`provider`、`number`
- 文字資訊：`title`、`summary`、`director`
- 關聯資訊：`actors`、`maker`、`label`、`series`、`genres`
- 媒體資源：`thumbUrl`、`coverUrl`、`bigThumbUrl`、`bigCoverUrl`、`previewVideoUrl`、`photos`
- 其他資訊：`score`、`releaseDate`

演員資料通常包括：

- 基本識別：`id`、`provider`、`name`
- 個人資訊：`aliases`、`birthday`、`height`、`measurements`、`nationality`
- 媒體資源：`avatar`、`photos`

## 適用對象

此外掛適合以下使用者：

- 已部署或能夠存取 MetaTube 相容服務的 Inscura 使用者
- 希望在 Inscura 中統一使用 MetaTube 資料進行影片與演員刮削的使用者
- 希望將 Inscura 與 MetaTube 社群生態整合的使用者

## 已知限制

- 外掛目前沒有額外的進階篩選設定項。
- 外掛不負責帳號登入、反爬處理、代理設定或服務部署。
- 演員詳情中的描述、出道日期、技能與社群連結目前尚未由外掛填充。
- 實際可用欄位取決於服務端回傳內容，不保證每個條目都完整。

## 語言版本

- [English](../README.md)
- [简体中文](README.zh-CN.md)
- 繁體中文
- [日本語](README.ja.md)
- [한국어](README.ko.md)
