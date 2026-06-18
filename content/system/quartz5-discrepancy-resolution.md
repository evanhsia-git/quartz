# Quartz 5 部署問題：解決 Vault 脫節與 Submodule 錯誤

## 📋 問題描述 (Symptom)
在進行 Quartz 5 部署時，發現網站呈現異常：
1. **內容不同步**：Obsidian 中的新筆記、修改後的內容無法反映在網頁上。
2. **Metadata 遺失**：YAML Metadata（如 `description`, `summary`, `priority` 等）在網頁上完全消失。
3. **頁面空白**：點擊目錄進入子頁面時，頁面顯示空白或格式異常。

## 🔍 根本原因分析 (Root Cause)

經過深入調查，發現問題源於兩個層面的脫節：

### 1. 路徑與權限脫節 (Path & Authority Mismatch)
系統中存在兩個獨立的目錄，但其角色與內容不一致：
- **開發端 (Source of Truth)**: `/root/Documents/Obsidian Vault/`
  - 這是使用者實際編輯、存放所有 Metadata 與原始 Markdown 的地方。
- **發布端 (Deployment Target)**: `/root/obsidian-vault/quartz/content/`
  - 這是 Quartz 建置引擎讀取的目錄。

**問題點**：所有的編輯都在「開發端」進行，但 Quartz 卻在「發布端」抓取舊的檔案。這導致發布端缺乏最新的 Metadata，且無法感知開發端的任何變動。

### 2. Git Submodule 誤判 (Gitlink Error)
在修復過程中發現，`quartz/content` 目錄在 Git 中被錯誤地標記為 **Submodule (gitlink, mode 120000)**，而非一般的目錄 (mode 100644)。
- **後果**：GitHub Actions 在建置時，只能看到一個指向某個 commit 的「指標」，而無法讀取到實體的檔案內容。
- **錯誤訊息**：`EACCES: permission denied, scandir '/.../quartz/content'`。這並非真的權限不足，而是因為 Git 無法進入一個「被標記為子模組但實際並未正確初始化」的目錄。

## 🛠️ 解決方案 (Resolution)

### 第一階段：修正 Git 結構
將 `quartz/content` 從 Git Submodule 模式改回一般的目錄模式，確保檔案實體能被 Git 與 GitHub Actions 正確追蹤與讀取。
- 指令關鍵：`git rm --cached quartz/content` $\rightarrow$ `git add quartz/content/` $\rightarrow$ `git commit`。

### 第二階段：建立「同步與發布」工作流 (Sync & Publish)
為了消除「開發端」與「發布端」的脫節，建立了一個自動化同步腳本 `/root/obsidian-vault/sync_vault.sh`。

**工作流程如下：**
1. **鏡像同步 (Rsync Mirroring)**：使用 `rsync` 將開發端的內容完整鏡像到發布端的 `content/` 目錄。
   - 使用 `--delete` 確保兩邊內容完全一致（若 Obsidian 刪除檔案，發布端也會同步刪除）。
   - 自動排除 `.obsidian` 等不需要同步的系統資料夾。
2. **自動化 Git 管理**：腳本會自動檢查發布端是否有內容變動，若有，則自動執行 `git commit` 與 `git push` 觸發 GitHub Actions。

## 💡 教訓與規範 (Lessons Learned)
- **單一事實來源 (Single Source of Truth)**：永遠只在開發端編輯，透過自動化工具進行發布。
- **警覺 Git 模式**：若遇到 `EACCES` 或檔案「看得到但讀不到」的現象，應優先檢查 `git ls-files -s` 是否出現 `120000` 模式。
- **禁止使用 Symlink 部署**：在 CI/CD 環境中，Symlink 會失效，必須使用實體檔案同步。
