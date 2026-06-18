---
title: gemma-model-info
description: gemma-model-info — 隨手筆記
summary: gemma-model-info
type: concept
status: published
priority: P2
tags: [hermes]
aliases: []
created: 2026-06-10
updated: 2026-06-10
date: 2026-06-10
publish: true
draft: false
related:
source:
due:
review:
---

# Gemini 模型說明 – gemma-4-26b-a4b-it

## 正確的官方模型 ID
- **完整名稱**：`gemma-4-26b-a4b-it`
- 此 ID 必須在 Google AI Studio 申請的免費 API Key 串接時使用，確保能正確呼叫模型。

## 為什麼會有兩種稱呼？
1. **`gemma-4-26b-a4b-it`**（正確的 API 模型 ID）
   - **26B**：模型總參數約 260 億（260B）。
   - **A4B**：代表 *Active 4 Billion*，採用混合專家（Mixture of Experts, MoE）架構，實際在每個 Token 前向傳播時只啟動約 40 億（4B）的活躍參數，兼具大模型品質與高速運算。
   - **IT**：*Instruction‑Tuned*，適合對話與指令執行的微調版本。
2. **`gemma-4-26b-it`**（日常口誤或簡稱）
   - 這是社群或開發者為了方便省略 `a4b` 的簡稱。
   - 若在程式碼或 `curl` 請求中直接使用 `gemma-4-26b-it`，系統通常會回報找不到模型的錯誤。

## 使用建議
- **申請免費 API Key**：前往 Google AI Studio 取得 API Key，並在程式碼中設定 `GEMINI_API_KEY`。
- **串接範例**（Python）
  ```python
  import os, requests

  api_key = os.getenv("GEMINI_API_KEY")
  url = "https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent"
  headers = {"x-goog-api-key": api_key, "Content-Type": "application/json"}
  data = {"contents": [{"role": "user", "parts": [{"text": "Hello, Gemini!"}]}]}
  response = requests.post(url, json=data, headers=headers)
  print(response.json())
  ```
- **避免使用簡稱**：務必使用完整的 `gemma-4-26b-a4b-it`，以免因模型 ID 不匹配而導致 API 呼叫失敗。

---

*此筆記已依照使用者需求寫入 Obsidian Vault，方便日後參考模型命名與使用細節。*

相關頁面：[[environment-keys|Environment Keys]]

相關頁面：[[news-push-log]]


## 相關節點
- [[index]]
- [[wiki]]