---
title: Wiki Schema
created: 2026-05-27
updated: 2026-05-27
type: schema
tags: [schema, rules, wiki]
---

# Wiki Schema

## Domain
本 Wiki 涵蓋：台灣股市資料架構、Hermes Agent 技能管理、Obsidian 知識庫維護、AI/LLM 相關技術概念。

## Conventions
- **檔案命名**：小寫、連字號、無空格（例：`taiwan-stock-data-overview.md`）
- **Frontmatter**：每個 wiki 頁面必須包含 YAML frontmatter（title, created, updated, type, tags, sources）
- **內部連結**：使用 `[[wikilinks]]` 格式，每頁至少 2 個出站連結
- **更新規則**：修改頁面時，務必更新 `updated` 日期
- **索引維護**：新頁面必須加入 `index.md` 對應分類，並更新「Total pages」計數
- **日誌規則**：每個動作必須附加到 `log.md`（格式：`## [YYYY-MM-DD] action | subject`）
- **來源標記**：綜合 3+ 來源的頁面，在段落末附加 `^[raw/articles/source-file.md]`

## 操作規範（⛔ 重要）

### ⚡ 強制前置導航（每次對話必執行）

每次對話開始時，**無論任務大小**，Hermes Agent 必須先執行以下導航序列，才能處理用戶請求：

1. `read_file("SCHEMA.md")` — 了解規範、標籤分類、領域定義
2. `read_file("index.md")` — 瀏覽目錄，定位相關頁面
3. `read_file("log.md", offset=最後 30 行)` — 了解最近變更與上下文

- 此導航是**強制性**的，不可跳過（除非用戶明確說「跳過導航」）
- 導航完成後，簡短回報：「✅ Obsidian 導航完成，已讀取 [X] 個相關頁面」
- 若導航發現與當前任務相關的知識，在處理任務前引用
- 使用 `obsidian-wiki` 技能的導航路徑作為執行框架

### 結構變更審核流程

**任何編輯、移動、刪除 Wiki 頁面或目錄前，必須遵守以下流程：**

1. **告知**：向 Ivan 說明要執行什麼操作
2. **方案**：提供完整的執行方案（包含影響範圍、預計結果）
3. **審核**：等待 Ivan 審核通過後才能執行
4. **執行**：Ivan 核可後才開始操作
5. **記錄**：執行完成後更新 `log.md`

⚠️ **未經 Ivan 審核通過，不得對 Wiki 進行任何結構性變更（包括但不限於：新增/刪除/重新命名 .md 檔案、搬移目錄、修改目錄結構）。**

此規範適用於 Layer 2 所有頁面（concepts/, entities/, comparisons/, queries/）以及輔助檔案（index.md 以外的非核心檔案）。核心檔案（SCHEMA.md, index.md, log.md）如需修改，同樣需要先告知 Ivan。

## Frontmatter 模板
```yaml
---
title: 頁面標題
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | index | log | schema
tags: [從下方標籤分類選取]
sources: [raw/articles/source-name.md]
# 選用品質標記：
confidence: high | medium | low        # 論述支持程度
contested: true                        # 標記有未解矛盾
contradictions: [other-page-slug]      # 衝突頁面
---
```

## Tag Taxonomy（標籤分類）
**台股資料類**：
- `taiwan-stock`, `data-source`, `twse`, `tpex`, `etf`
- `finmind`, `yahoo-finance`, `openbb`
- `pe-ratio`, `pb-ratio`, `roe`, `eps`, `dividend-yield`

**Hermes Agent 類**：
- `hermes`, `skill`, `memory`, `cronjob`, `agents`, `tina`
- `telegram`, `notion`, `obsidian`

**LLM/AI 類**：
- `llm-wiki`, `concept`, `karpathy`, `ai`, `llm`
- `comparison`, `obsidian`, `markdown`

**維護類**：
- `index`, `log`, `maintenance`, `schema`, `navigation`
- `overview`, `setup`, `rules`, `optimization`

規則：頁面標籤必須來自此分類。新標籤需先加入此處，再使用。

## Page Thresholds（頁面建立門檻）
- **建立新頁**：當實體/概念在 2+ 來源出現，或是單一來源的核心主題
- **更新現有頁**：來源提及已涵蓋的主題時，添加資訊而非新建
- **不建立頁面**：僅提及名稱、次要細節、超出領域範圍
- **拆分頁面**：當頁面超過 ~200 行，按子主題拆分並交叉連結
- **封存頁面**：內容完全被取代時，移至 `_archive/`，從索引移除

## Page Types（頁面類型）
### Index Pages（索引頁）
- `index.md`：所有頁面分類目錄（含單行摘要）
- `wiki.md`：頁面索引與關聯圖
- `raw.md`：原始資料來源清單

### Concept Pages（概念頁）
- 每個概念或主題一頁
- 包含：定義/解釋、知識現狀、開放問題、相關概念 `[[wikilinks]]`、來源參考

### Entity Pages（實體頁）
- 每個重要實體一頁（公司、組織、工具、模型）
- 包含：概述、關鍵事實與日期、與其他實體關係 `[[wikilinks]]`、來源參考

### Comparison Pages（比較頁）
- 並排分析（表格格式優先）
- 包含：比較標的與原因、比較維度、結論或綜合、來源

### Query Pages（查詢頁）
- 值得保留的查詢結果（存於 `queries/`）
- 包含：原始問題、綜合答案、引用頁面、執行日期

### Log Pages（日誌頁）
- `log.md`：所有 Wiki 動作的時間軸記錄

## Directory Structure（目錄結構）
```
wiki/
├── SCHEMA.md           # 本檔案
├── index.md            # 分類目錄
├── log.md              # 維護日誌
├── wiki.md             # 頁面索引
├── raw.md              # 原始資料來源
│
├── raw/                # Layer 1: 不可變來源素材
│   ├── articles/       # 網路文章、剪報
│   ├── papers/         # PDF、arxiv 論文
│   ├── transcripts/    # 會議記錄、訪談
│   └── assets/         # 圖片、圖表
│
├── entities/           # Layer 2: 實體頁（公司、組織、工具）
├── concepts/           # Layer 2: 概念頁（主題、技術）
├── comparisons/        # Layer 2: 比較分析頁
└── queries/            # Layer 2: 查詢結果頁
```

## Update Policy（更新政策）
當新資訊與現有內容衝突時：
1. 檢查日期 — 較新來源通常取代較舊來源
2. 若確實矛盾，記錄雙方觀點並標註日期與來源
3. 在 frontmatter 標記矛盾：`contradictions: [page-name]`
4. 在 lint 報告中標記供使用者審查

## Lint Checklist（健康檢查清單）
- [ ] 孤立頁面（無入站連結）
- [ ] 損壞連結（指向不存在頁面）
- [ ] 索引完整性（所有頁面皆列入 `index.md`）
- [ ] Frontmatter 驗證（必要欄位完整、標籤在分類中）
- [ ] 過期內容（90 天未更新）
- [ ] 矛盾頁面（`contested: true` 或 `contradictions:`）
- [ ] 品質訊號（`confidence: low` 頁面）
- [ ] 頁面大小（超過 200 行建議拆分）
- [ ] 標籤稽核（所有使用標籤皆在分類中）
- [ ] 日誌輪轉（`log.md` 超過 500 條時）
