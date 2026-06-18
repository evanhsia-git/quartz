# 閉環執行與演進框架 (Closed-loop Execution & Evolution Framework)

這套框架旨在建立 AI Agent 與自動化系統在處理複雜任務時的「高可靠性」標準，避免「流程斷層」（例如：僅更新文件而未修改邏輯）與「假裝成功」的問題。

---

## 一、 如何確實執行使用者任務 (Reliable Execution)
**核心原則：從「描述目標」轉向「拆解路徑」。**

1. **需求解構 (Deconstruction)**
   - 禁止直接開始寫程式。
   - 必須先將需求拆解為：**輸入 (Input)** $\rightarrow$ **邏輯 (Logic)** $\rightarrow$ **輸出 (Output)**。
   - *範例*：需求為「修改股市報告格式」 $\rightarrow$ 輸入：Yahoo/FRED 數據 $\rightarrow$ 邏輯：雙行格式化 $\rightarrow$ 輸出：Telegram 訊息。

2. **建立執行計畫 (Planning)**
   - 在執行前，必須明確區分 **「實體修改 (Side-effect)」** 與 **「知識更新 (Documentation)」**。
   - 任務必須採取 **原子化操作 (Atomicity)**：邏輯修改與文件更新應視為兩個獨立步驟。

---

## 二、 如何檢查任務執行結果 (Verification)
**核心原則：證據優先 (Evidence-first)，禁止「假裝成功」。**

檢查任務必須通過 **「三位一體驗證」**：

1. **系統驗證 (System Verification)**
   - 確認工具層級（如 `write_file`, `patch`, `terminal`）回傳 `success: true`。

2. **實體驗證 (Physical Verification)**
   - **核心要求**：禁止僅憑工具回傳結果判斷成功。
   - 必須透過 `read_file` 或 `terminal` (如 `cat`, `python script.py`) 讀取 **實體檔案內容** 或 **執行輸出**。
   - 驗證內容必須包含：文字、空格、符號、換行。

3. **需求對照 (Requirement Cross-check)**
   - 將「實體驗證」得到的結果，與使用者的「原始範本/規範」進行逐行比對。

---

## 三、 如何改善任務執行狀況 (Continuous Improvement)
**核心原則：根本原因分析 (RCA) 與 知識沉澱 (Sedimentation)。**

當任務失敗或被使用者糾正時，應啟動以下流程：

1. **根本原因分析 (Root Cause Analysis, RCA)**
   - **邏輯錯誤 (Logic Error)**：程式碼邏輯不符需求 $\rightarrow$ 修正程式碼。
   - **流程斷層 (Process Gap)**：修改了 A 卻忘了修改 B $\rightarrow$ 建立 Check-list。
   - **環境偏差 (Environment Drift)**：API 變動或 Key 失效 $\rightarrow$ 更新環境變數或建立備援。

2. **知識沉澱 (Sedimentation)**
   - **更新 Skill**：將「正確的流程」與「避坑指南」寫入 `SKILL.md`。
   - **更新 Memory**：將使用者的偏好與判斷準則寫入 Persistent Memory。

---

## 四、 指令與標準對照表 (Summary Table)

當使用者發現執行偏差時，可直接下達以下指令以強制啟動高標準流程：

| 發現問題 | 指令 | 預期動作 |
| :--- | :--- | :--- |
| **只改了文件沒改程式** | 「請進行 **實體驗證 (Physical Verification)**」 | 停止對話，立即 `read_file` 檢查程式碼並執行測試。 |
| **產出格式不對** | 「請進行 **需求對照 (Cross-check)**」 | 將產出與範本逐字比對，找出不一致處。 |
| **我想確保以後不再出錯** | 「請將此流程納入 **Skill/Memory**」 | 將此次教訓轉化為標準作業程序 (SOP)。 |
| **我不確定你改了哪裡** | 「請提供 **驗證證據 (Evidence)**」 | 提供 `read_file` 的內容截圖或 `terminal` 的執行 log。 |
