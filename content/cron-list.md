---
name: cron-list
title: Cron List Display
description: 顯示所有已安裝 Cron Jobs，使用簡潔的條列式格式。
created: 2026-06-09
updated: 2026-06-13
type: concept
tags: [cronjob, hermes, maintenance]
---

# 目的
提供一個指令 `skill_view(name="cron-list")` 後，能一次呈現全部已設定的排程任務（Cron Jobs），分為執行狀態、名稱、排程時間及 Job ID，方便管理與監控。

# 使用方式
1. 呼叫 `skill_view(name="cron-list")`。
2. 系統會列出所有目前的 cron jobs，包含：
   - 狀態 (Enabled/Paused)
   - 名稱 (Name)
   - 執行方式 (Skill/Script/Agent)
   - 排程時間 (Schedule)
   - Job ID (ID)
3. 輸出格式採用簡潔的項目清單，方便在手機端閱讀。

# 目前排程任務清單（共 10 條）

## 📰 新聞與指標

| # | 名稱 | 執行方式 | 時間 | job_id | 狀態 |
|---|------|----------|------|--------|------|
| 1 | 每日台股新聞 | daily-news-twstock.py | 08:30, 15:00 | 3b19d0669d5a | ✅ |
| 2 | 每日科技新聞 | daily-news-technology.py | 09:00, 17:00 | 3f49f2990e06 | ✅ |
| 3 | 每日股市指標 | daily-news-stock-market.py | 08:30 | a0144cdf0461 | ✅ |
| 4 | 每日美股新聞 | daily-news-usstock.py | 06:30, 08:30 | a7e796ca66c0 | ✅ |

## 🔧 系統維護

| # | 名稱 | 執行方式 | 時間 | job_id | 狀態 |
|---|------|----------|------|--------|------|
| 5 | 每日系統維護 (Lint+備份+Quartz) | daily_maintenance.sh | 05:00 | 545d8fb6a9e8 | ✅ |
| 6 | Hermes Update Check | hermes-agent (Agent) | 每 7200 分鐘 | ed5d30a18e08 | ✅ |
| 7 | 每日 Token 與任務執行報告 | token-usage (Agent) | 08:00 | 85b256249300 | ✅ |

## 📊 台股資料更新（週一至週五）

| # | 名稱 | 執行方式 | 時間 | job_id | 狀態 |
|---|------|----------|------|--------|------|
| 8 | 台股資料更新 批次1 | twse-stock-data (Skill) | 14:00 | e923159f4e35 | ✅ |
| 9 | 台股資料更新 批次2 | twse-stock-data (Skill) | 14:30 | 8be985ea13fb | ✅ |
| 10 | 台股資料更新 批次3 | twse-stock-data (Skill) | 15:00 | 62e2c14bfa17 | ✅ |

# 注意事項
- 此清單為即時狀態，若更新了 cron-job 設定，再次呼叫將更新內容。
- 若需要單獨執行某個 Job，請使用 `cronjob(action='run', job_id='...')`。
- 所有新聞/指標任務的腳本名稱與技能名稱一致，存放於 `/root/.hermes/scripts/`。

# 相關工具
- `cronjob(action='list')` – 獲取 raw 數據。
- `cronjob(action='run', job_id='...')` – 手動觸發執行。
- `cronjob(action='remove', job_id='...')` – 移除不需要的任務。

相關頁面：[[index]]
相關頁面：[[skills-list]]
