---
title: Log
created: 2026-05-31
updated: 2026-06-03
type: log
tags: [maintenance]
---

## [2026-05-28] migrate | 記憶量化事實遷移至 Wiki
- **原因**：防止 Memory 容量飽和，將碎片化事實固化為結構化知識。
- **動作**：建立 4 個新概念頁面：
    - `concepts/twse-api-mapping.md` (API 映射)
    - `concepts/stock-database-state.md` (資料庫狀態)
    - `concepts/stock-automation-config.md` (自動化配置)
    - `concepts/financial-preferences.md` (金融偏好)
- **結果**：更新 index.md，成功將所有股票量化事實從 Memory 遷移至 Wiki。

## [2026-05-29] update_cron_jobs | 調整美股與台股新聞每日執行時間至 08:30 台灣時間
- **動作**：更新兩個 cron 任務的排程，將執行時間設為 UTC 00:30（即台灣時間 08:30）。
- **結果**：cronjob `738f30be4987`（美股新聞）和 `7e5238414e15`（台股新聞）均已設定為 `30 0 * * *`，確保每日台灣時間 08:30 執行。

## [2026-05-30] daily_task_summary | 每日任務摘要
- **migrate_memory_to_wiki**: created 4 concept pages and moved quantitative facts from Memory to Wiki; index.md updated.
- **update_cron_jobs**: adjusted US and Taiwan stock news cron schedules to run daily at 08:30 Taiwan time (UTC 00:30); removed data source statistics.
- **twsE_financial_data_enrichment**: completed TWSE OpenAPI financial statement extraction; updated SQLite DBs with ROE, EPS, net margin, debt ratio, revenue fields.
- **generate_and_send_pdf_report**: generated institutional equity research PDF for ticker 2317 and successfully sent it via Telegram.
- **install_fonts_noto_cjk**: installed `fonts-noto-cjk` package to enable proper CJK rendering in PDFs.
- **switch_default_model**: updated config.yaml to use `deepseek/deepseek-v4-flash:free` via OpenRouter; confirmed free model availability.
- **configure_searxng_search**: set `web.search_backend=searxng` and `SEARXNG_URL=http://localhost:8080`; verified SearXNG search works.
- **log_update**: appended this daily_task_summary entry to the Obsidian log.md file.
- 2026-05-31 14:40 | [CRITICAL] 確立 Telegram 檔案傳送標準規範，禁止使用 MEDIA 參數，強制使用 curl-based sender。
- 2026-05-31 17:01 [CRITICAL] 禁用所有 LaTeX 格式輸出，強制改用 Unicode 符號，以解決 Telegram 顯示亂碼問題。

## [2026-06-01] system_update | Obsidian 強制導航機制建立
- **原因**：將 Obsidian 從「檔案存放區」提升為「外部長期記憶體」，確保每次對話都有記憶上下文。
- **動作**：
  1. 更新 `obsidian-wiki` 技能：加入「⚡ 強制前置導航」章節，明確規定每次對話必執行 SCHEMA → index → log。
  2. 更新 `SCHEMA.md`：加入「強制前置導航」規範與「結構變更審核流程」分區。
  3. 更新 `concepts/obsidian-wiki-conventions.md`：新增繁體中文語言規範與 Wiki 使用規範頁面。
  4. 更新 `memory`（user + memory）：將強制導航行為寫入持久記憶。
  5. 更新 `index.md`：新增 obsidian-wiki-conventions 頁面連結。
- **結果**：Obsidian 導航成為強制性前置步驟，每次對話開始時自動執行。

## [2026-06-01] language_rule | 確立繁體中文對話規範
- **原因**：確保所有對話與問答一律使用繁體中文。
- **動作**：建立 `concepts/obsidian-wiki-conventions.md`，寫入語言規範與 Wiki 操作規範。
- **結果**：index.md 已更新，log.md 已記錄。

## [2026-06-02] ingest | 添加「全體市場公開發行公司彙總表」與興櫃公司資訊
- **說明**：紀錄緩衝整理全市場公司彙總表與興櫃公司簡表的資訊，並將其加入公司實體頁面。
- **行動**：
  1. 完成 `全体市場公開發行公司彙總表` Obsidian 實體頁面（已建立）。
  2. 完成 `興櫃公司基本資料` Obsidian 實體頁面（已建立）。
  3. 依 `log.md` 標準格式添加相關條目。
- **結果**：所有欄位說明與下載資訊已沉澱至 Wiki；`log.md` 已新增事件記錄。

<<<<<<< HEAD
## [2026-06-01] free_models_list | 建立 OpenRouter 免費模型完整列表
- **原因**：原本只記錄 8 個 vision 模型，但 OpenRouter 實際上有 25 個免費模型。需要完整列表供未來選擇。
- **動作**：
  1. 查詢 OpenRouter API `/v1/models`，篩選所有免費模型。
  2. 建立 `concepts/openrouter-free-models.md`：完整記錄 25 個模型的 ID、上下文、模態、特點、快速選擇指南。
  3. 更新 `index.md`：加入新頁面連結，總頁面數 22 → 23。
  4. 將 `https://openrouter.ai/openrouter/free/activity` 列為免費模型查詢首選來源。
- **結果**：免費模型完整列表已沉澱至 Obsidian。
- **規範**：未來需要使用免費模型時，優先查此頁面確認可用性。

## [2026-06-01] gemini_pricing | 建立 Gemini API 定價摘要
- **原因**：需要掌握 Google Gemini 各模型的定價，以便選擇最具成本效益的方案。
- **動作**：
  1. 閱讀 Google 官方定價頁面（https://ai.google.dev/gemini-api/docs/pricing）
  2. 建立 `concepts/gemini-api-pricing.md`：整理所有模型定價（文字/圖片/影片/音訊/嵌入/工具）、降成本技巧、淘汰警告。
  3. 更新 `index.md`：加入新頁面連結，總頁面數 23 → 24。
- **結果**：Gemini API 完整定價資訊已沉澱至 Obsidian。

## [2026-06-01] nvidia_free_models | 建立 NVIDIA Build 免費模型列表
- **原因**：NVIDIA Build 提供 100+ 免費模型，涵蓋 LLM/視覺/語音/OCR/安全等領域，需要完整列表供未來選擇。
- **動作**：
  1. 閱讀 https://build.nvidia.com/models 與免費 API 指南。
  2. 建立 `concepts/nvidia-build-free-models.md`：整理 100+ 模型的 ID、參數、上下文、特色，含 LLM/視覺/語音/嵌入/安全/文件智慧/物理 AI 等分類。
  3. 更新 `index.md`：加入新頁面連結，總頁面數 24 → 25。
- **結果**：NVIDIA Build 完整免費模型列表已沉澱至 Obsidian。
- **重點**：Nemotron 3 Super 120B 支援 1M 上下文、53M 下載量；API 端點為 `https://integrate.api.nvidia.com/v1`；僅需 Email 註冊，無需信用卡。

## [2026-06-01] obsidian_lint | Obsidian 全面優化與修正
- **原因**：例行健康檢查，發現多項問題。
- **動作**：
  1. **LaTeX 修正**：掃描並修正 memory、skills、obsidian 中所有 `$→$` → `→`、`$\text{...}$` → 純文字等 LaTeX 格式。共修正 169 處。
  2. **Frontmatter 補全**：為 `2026-06-01 daily task summary.md` 和 `telegram-file-delivery-standard.md` 補上 frontmatter。
  3. **Wikilinks 補充**：為 22 個孤立頁面補上至少 2 個出站 wikilinks。
  4. **檔案拆分**：將 nvidia-build-free-models.md（214 行）拆分為 7 個子頁面。
- **結果**：Obsidian 結構已優化完成。

## [2026-06-02] ingest | Manus 精選案例與實際應用
- **來源**: Awesome Manus Use Cases (https://awesome.manus.space/) — 278 個社群案例
- **動作**: 建立 `concepts/manus-use-cases.md`，涵蓋 6 大分類
- **比較**: 加入 Manus vs Hermes Agent 對照表
- **結果**: index.md 已更新（總頁面數 34）

## [2026-06-03] ingest | FinLab (Entity page creation)

## [2026-06-03] ingest | TradingAgents (Entity page creation)

## [2026-06-03] ingest | Blave Quant Skill (Entity page creation)

## [2026-06-03] ingest | 股票組合回測分析 (Query page creation)

## [2026-06-03] maintenance | Core file frontmatter update

## [2026-06-03] maintenance | Update TWSE skill with throttling and retry logic

## [2026-06-03] ingest | Create concept/api-rate-limiting-strategies.md

## [2026-06-03] ingest | Model error messages concept page creation

## [2026-06-03] maintenance | 將 karpathy-llm-wiki-gist.md 內容翻譯為繁體中文版
- **原因**：確保所有筆記均符合繁體中文規範，提升知識庫可讀性。
- **動作**：將該檔案中的英文段落翻譯為繁體中文，保留結構與連結。
- **結果**：Wiki 內容已完全中文化，符合語言規範。

## [2026-06-03] maintenance | 更新新聞推送標準
- **動作**：更新 `daily-stock-news` 技能規範，統一設定為「固定 10 則」、「強制分行」及「超過 3,500 字元分段傳送 (1/2)」的標準。
- **結果**：已同步至 Wiki 與所有 Cron Jobs 執行邏輯中。
=======
## [2026-06-16 19:30:00] fix | 更新每日股市指標 skill 與輸出限制
- **原因**：使用者要求補充說明文字，並嚴格限制輸出格式（禁止範本以外的文字）。
- **內容**：
    - 更新 SKILL.md：加入「嚴格輸出限制」章節（禁止推理過程、英文工作語言、來源標註、額外分隔線等）
    - 更新 SKILL.md：加入「補充說明規範」（每項 1-2 句，精簡）
    - 更新 cron job prompt：明確規定禁止輸出範本以外的文字
    - 綁定 skill 從 `daily-stock-news` 改為 `daily-news-stock-market`
- **結果**：SKILL.md、Python 腳本、cron job prompt 三者同步更新。
## [2026-06-16 14:58:51] lint | Quick sample check completed
## [2026-06-16 15:24:19] lint | Quick sample check completed
## [2026-06-16 15:56:28] lint | Quick sample check completed
## [2026-06-16 15:57:13] lint | Quick sample check completed
## [2026-06-16 16:03:52] lint | Quick sample check completed
## [2026-06-16 16:09:01] lint | Quick sample check completed
## [2026-06-16 16:10:33] lint | Quick sample check completed
## [2026-06-16 16:17:11] lint | Quick sample check completed
## [2026-06-16 21:00:32] lint | Quick sample check completed
## [2026-06-17 21:00:53] lint | Quick sample check completed
>>>>>>> 286beb7 (Auto backup: 2026-06-17 21:00 (UTC))
