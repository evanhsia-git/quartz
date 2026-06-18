---
title: Wiki Schema
created: 2026-05-27
updated: 2026-06-16
version: 2.1
type: schema
tags: [schema, rules, wiki, optimization, rag, obsidian-graph]
---
# Wiki Schema claude
---

## Domain（知識庫四大領域）

本 Wiki 系統為知識管理的核心架構，涵蓋四大核心領域：

1. **台灣股市資料架構**：資料源、財務指標與儲存規範。
2. **Hermes Agent 技能管理**：Agent 核心能力、工具整合與自動化排程。
3. **Obsidian 知識庫維護**：檔案組織、雙向連結與自動化健康檢查。
4. **AI/LLM 相關技術概念**：大語言模型應用、RAG 架構、Prompt 工程與系統設計。

---

## Conventions（通用規範）

| 規範項目 | 規則 |
|---|---|
| 檔案命名 | 全小寫、`-` 分隔、禁止空格（例：`taiwan-stock-data-overview.md`） |
| Frontmatter | 所有 Wiki 頁面（除 raw/ 素材外）必須包含完整 YAML Frontmatter |
| 出站連結 | 每篇新頁面至少 **2 個** `[[wikilinks]]` 出站連結 |
| 入站連結 | 建立新頁後，必須在既有相關頁面補上指向新頁的入站連結 |
| 孤立節點 | **嚴禁**——任何頁面不得無連結游離於圖譜之外 |
| 更新日期 | 頁面任何內容修改後，同步更新 Frontmatter `updated` 欄位 |
| 索引維護 | 新頁建立後立即歸入 `index.md`，並更新對應分類的「Total pages」計數 |
| 日誌規則 | 結構變更或頁面增刪，Append 至 `log.md`（格式：`## [YYYY-MM-DD] action \| subject`） |
| 來源標記 | 綜合 3 個（含）以上原始來源時，段落末附說明式腳註（例：`^[raw/articles/source-file.md]`） |

---

## 目錄結構（Directory Structure）

```
wiki/
├── SCHEMA.md           # 本規範檔案（架構、規則、RAG 與標籤稅則）
├── index.md            # 全站分類目錄 / MOC（含頁面計數與單行摘要）
├── log.md              # 維護日誌（時間軸流水帳）
├── wiki.md             # 頁面索引與圖譜關聯拓撲中心節點
├── raw.md              # 原始 RAG 資料來源清單快照
│
├── raw/                # Layer 1：唯讀，不可變原始 RAG 素材
│   ├── articles/       # 網路文章、技術剪報、部落格
│   ├── papers/         # PDF 論文、arXiv 文獻
│   ├── transcripts/    # 會議記錄、語音轉文字訪談
│   └── assets/         # 圖片、靜態圖表
│
├── entities/           # Layer 2：實體頁（公司、工具、模型）→ 圖譜實體節點
├── concepts/           # Layer 2：概念頁（技術、理論）→ 圖譜概念節點
├── comparisons/        # Layer 2：比較分析頁（並排表格）→ 圖譜橋接節點
└── queries/            # Layer 2：高價值查詢結果與綜合回答 → 圖譜沉澱節點
```

---

## 🧠 RAG Pipeline（檢索增強與圖譜轉化）

```
[Layer 1: raw/ 原始素材]
        │
        ▼  (Agent：語意理解 → 清洗 → 重組)
[Layer 2: 結構化頁面]
        │
        ▼  (自動建立 [[wikilinks]])
[Obsidian 知識圖譜節點點亮]
```

### 三階段執行流程

**Step 1 — Retrieve（語意檢索）**
優先對 `raw/` 中的文章、論文、會議紀錄進行關鍵字與語意檢索。

**Step 2 — Augment（脈絡增強）**
結合多個檢索片段，比對 `concepts/` 或 `entities/` 既有頁面，確認有無時效性衝突。

**Step 3 — Generate & Link（網狀生成）**
- 禁止生成孤立純文字塊。
- 自動識別文字中的實體與核心概念，包裹為 `[[既有頁面]]` 或 `[[預期新頁面]]`。
- 透過密集雙向連結，將 Layer 1 碎片資料轉化為圖譜**高密度核心節點（Hubs）**。

---

## ⚡ 強制前置導航（每次對話必執行）

> **優先級最高，任何任務開始前不得跳過（除非 Ivan 明確指定「跳過導航」）。**

```
導航序列（依序、連續執行）：

1. read_file("SCHEMA.md")          → 對齊標籤分類、RAG 規範、最新規則
2. read_file("index.md")           → 定位目錄架構，找出目標頁面與相關節點
3. read_file("log.md", offset=-10) → 讀取最新 10 行日誌，理解近期變更脈絡
                                     ↳ 同一對話中若未執行任何寫入，第二輪起跳過此步驟
```

**導航完成後，單行回報：**
```
✅ 導航完成｜已快取 [X] 個核心節點，RAG 檢索源與圖譜上下文已對齊。
```

> 若發現與當前任務高度相關的既有知識，在任務執行前以 `[[wikilinks]]` 形式主動引用。

---

## 🔄 結構變更審核流程（Gatekeeping）

> ⚠️ **未獲 Ivan 明確核可，Agent 不得執行任何結構性變更。**
> 適用範圍：所有 Layer 2 目錄（`concepts/`、`entities/`、`comparisons/`、`queries/`）及核心輔助檔案。

**🚨 P0 豁免條款：孤立節點、損壞連結、Frontmatter 缺失屬於結構性錯誤，Agent 可直接修復，無需等待審核。修復完成後立即 Append 至 `log.md`。**

```
[1. 告知 Ivan] → [2. 提供完整方案] → [3. 等待審核] → [4. 獲准執行] → [5. 記錄 log.md]
```

| 步驟 | 行動 | 要求 |
|---|---|---|
| 1. 告知 | 主動說明欲執行的結構性變更目標 | 清楚、無歧義 |
| 2. 方案 | 列出影響範圍（受影響檔案 + 圖譜連結變更）與預計結果 | 具體、可追蹤 |
| 3. 審核 | **暫停所有自動化變更**，等待 Ivan 明確核可指令 | 不得自行推進 |
| 4. 執行 | 依核可方案執行原子化操作 | 嚴謹、逐步 |
| 5. 記錄 | 操作完成後立即 Append 至 `log.md` | 第一時間完成 |

---

## Frontmatter 範本

### 必填欄位（所有頁面）

```yaml
---
title: 頁面標題
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | index | log | schema
tags: [從下方標籤分類選取]
sources: [raw/articles/source-name.md]
---
```

### 選用欄位（僅在衝突或可信度需標注時使用）

```yaml
# 加入上方 Frontmatter 尾部，按需附加：
confidence: high | medium | low   # 論述與 RAG 來源的信任度
contested: true                   # 標記存在未解矛盾（圖譜呈現衝突節點）
contradictions: [other-page-slug] # 衝突/矛盾的關聯頁面 ID
```

> Agent 建檔時**預設不輸出選用欄位**，僅在來源衝突或 Ivan 明確要求時才附加。

---

## 標籤分類體系（Tag Taxonomy）

> 所有頁面 `tags` 欄位必須嚴格限定於以下標籤池。引入新標籤前，必須先修改本 Schema，**嚴禁擅自建立體系外標籤**。

| 領域 | 允許標籤 |
|---|---|
| 台灣股市資料 | `taiwan-stock` `data-source` `twse` `tpex` `etf` `finmind` `yahoo-finance` `openbb` `pe-ratio` `pb-ratio` `roe` `eps` `dividend-yield` |
| Hermes Agent | `hermes` `skill` `memory` `cronjob` `agents` `tina` `telegram` `notion` `obsidian` |
| LLM / AI / RAG | `llm-wiki` `concept` `karpathy` `ai` `llm` `rag` `embedding` `vector-db` `comparison` `markdown` |
| 系統維護與管理 | `index` `log` `maintenance` `schema` `navigation` `overview` `setup` `rules` `optimization` `backup` `archive` `snapshot` |

---

## Page Types（頁面類型規範）

### Index Pages（索引頁）
- **`index.md`**：全站分類總目錄（MOC），含各頁面單行精煉摘要與總頁數計數。
- **`wiki.md`**：頁面全域索引與圖譜核心節點。
- **`raw.md`**：不可變 RAG 原始素材來源清單快照。

### Concept Pages（概念頁）— `concepts/`
必備結構：
1. 定義與核心解釋
2. 當前知識現狀
3. 開放性問題
4. 關聯概念 `[[wikilinks]]` 雙向連結
5. 原始 RAG 來源參考

### Entity Pages（實體頁）— `entities/`
必備結構：
1. 實體概述
2. 關鍵事實 / 歷史時間軸
3. 與其他實體的關係網絡 `[[wikilinks]]`
4. 參考來源

### Comparison Pages（比較頁）— `comparisons/`
必備結構：
1. 優先使用 Markdown 表格格式
2. 比較對象與動機
3. 多維度度量分析
4. 綜合結論

### Query Pages（查詢頁）— `queries/`
必備結構：
1. 原始 Prompt / 問題
2. 多源綜合答案
3. 被引用的 Wiki 圖譜頁面連結
4. 執行日期與快照日期

### Log Pages（日誌頁）
- **`log.md`**：全自動與手動 Wiki 變更動作的時間軸流水帳。

---

## Page Thresholds（頁面建立與維護門檻）

| 操作 | 觸發條件 |
|---|---|
| **建立新頁** | 特定實體或概念在 **≥ 2 個**獨立 RAG 來源中被提及，或屬於單一來源的核心主題 |
| **更新現有頁** | 新來源提及的主題已存在既有頁面時，增補至原頁面，**禁止建立重複頁面**（避免節點分裂） |
| **拒絕建檔** | 僅提及名稱、無實質脈絡的次要細節、或超出四大 Domain 範圍的資訊 |
| **拆分頁面** | 單一頁面超過 **200 行**時，依子主題拆分，並以 `[[wikilinks]]` 雙向交叉連結 |
| **封存頁面** | 內容時效過期或已被新頁面完全取代時，移至 `_archive/`，並從 `index.md` 與動態連結移除 |

---

## Update Policy（衝突與更新政策）

當 RAG 新資訊與既有圖譜節點內容發生邏輯衝突時，依序執行：

1. **時效性優先**：比對來源日期，較新日期通常具較高修正優先權。
2. **保留矛盾**：若雙方皆具參考價值且無法直接覆蓋，同時保留兩者，精確標註各自獲取日期與 raw 來源。
3. **標記元數據**：Frontmatter 設為 `contested: true`，`contradictions: [page-slug]` 填入衝突頁面（圖譜將拉出矛盾關聯線）。
4. **回報 Ivan**：主動提示有未解矛盾，等待人工裁決。

---

## 🔍 Lint Checklist（圖譜健康檢查）

> **觸發條件（事件驅動）**：結構變更完成後自動執行，或 Ivan 明確要求時執行。非上述情境不主動觸發。

```
[ ] 孤立節點     — 掃描無入站/出站連結的 Layer 2 頁面，強制修復（P0 豁免審核）
[ ] 損壞連結     — 掃描指向已刪除、不存在或拼錯的 [[wikilinks]]（P0 豁免審核）
[ ] 索引完整性   — 確保所有 Layer 2 RAG 沉澱檔案準確列於 index.md
[ ] Frontmatter  — 驗證必要欄位完整，tags 完全符合 Taxonomy 標籤池
[ ] 內容過期     — 標記超過 90 天未更新的頁面，提示是否需 RAG 增補
[ ] 矛盾追蹤     — 列出所有 contested: true 的衝突弧線，提示 Ivan 人工精簡
[ ] 體積控制     — 精準抓出超過 200 行的頁面，提交「拆分與圖譜對齊方案」
[ ] 日誌健康度   — log.md 超過 500 條紀錄時，主動提示進行日誌輪轉
```

---

## ⚙️ Agent 效率最佳化規範（v2.1）

### 快取策略（Cache-First）
- 導航完成後，SCHEMA / index / log 摘要應保存於當次對話的工作記憶（Context Buffer）。
- 同一對話中重複操作相同分類的頁面，**跳過重複讀取**，直接使用快取狀態。
- 同一對話中若未執行任何寫入，第二輪起跳過 `log.md` 讀取步驟。
- 僅在以下情境重新讀取：(a) Ivan 明確要求刷新；(b) 已執行結構變更後需驗證一致性。

### 原子化輸出（Atomic Output）
每次 Agent 輸出必須包含下列三個區塊（缺一不可）：

```
[RESULT]    本次操作的直接結果（新增/修改的頁面內容或摘要）
[LINKS]     本次操作「新增或修改」的 [[wikilinks]] delta 清單（既有連結不重複列出）
[LOG_ENTRY] 對應 log.md 的追加記錄行（格式：## [YYYY-MM-DD] action | subject）
```

> `[LINKS]` 僅列本次操作產生的 delta，不重複輸出已存在的連結。

### 批次操作優化（Batch Mode）
- 若 Ivan 指示需建立 **≥ 3 頁**新頁面，Agent 應先產出完整**批次計畫表**（含頁面名稱、type、預計 tags、關聯節點），獲得確認後才開始逐頁執行。
- **≤ 2 頁**直接執行，不產計畫表。
- 批次操作中，圖譜連結應於**所有頁面生成完畢後**統一補全，避免中途出現暫時性孤立節點。

### 任務優先級（Task Priority）
```
P0（立即執行，豁免審核）— 結構性錯誤修復（孤立節點、損壞連結、Frontmatter 缺失）
P1（當次完成）          — Ivan 明確指定的新頁建立、內容更新
P2（本次附帶）          — 關聯頁面的入站連結補全、索引更新
P3（定期批次）          — Lint 健康檢查、過期內容標記、日誌輪轉建議
```

### 精簡回報原則
- 非錯誤情境下，導航回報與操作確認以**單行**為上限。
- 多步驟操作使用**進度條格式**而非逐步敘述：
  ```
  [1/3] ✅ SCHEMA 讀取完成 | [2/3] ✅ index 定位完成 | [3/3] ✅ log 對齊完成
  ```

---

## 版本變更紀錄

| 版本 | 日期 | 變更摘要 |
|---|---|---|
| v2.1 | 2026-06-16 | log 讀取縮短至 -10 行；LINKS 改為 delta 輸出；Lint 改事件驅動；批次門檻補充 ≤2 頁直接執行；Frontmatter 選用欄位移至附錄；P0 豁免 Gatekeeping 審核 |
| v2.0 | 2026-06-10 | 新增 Agent 效率最佳化補充規範 |
| v1.0 | 2026-05-27 | 初始版本 |
