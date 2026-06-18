# Sync & Publish Workflow (Obsidian $\rightarrow$ Quartz)

## 核心架構
為了確保「開發環境 (Development)」與「部署環境 (Deployment)」的同步，並解決 GitHub Actions 無法讀取本地路徑的問題，本系統採用 **Rsync Mirroring (鏡像同步)** 模式。

- **Source of Truth (開發端)**: `/root/Documents/Obsidian Vault/` (Obsidian 編輯器使用)
- **Deployment Repo (發布端)**: `/root/obsidian-vault/quartz/content/` (Quartz 建置使用)

## 為什麼不能使用 Symlink (軟連結)?
雖然在 VPS 本機可以使用 `ln -s` 將兩個目錄連起來，但 **GitHub Actions 運行在遠端雲端環境**。當你將 Symlink Push 到 GitHub 時，遠端伺服器只會看到一個「指向本地路徑」的無效指標，無法讀取實際檔案，這會導致：
1. GitHub Actions 建置失敗 (Permission Denied / File Not Found)。
2. 網站內容顯示為空或僅剩首頁。

## 標準作業程序 (SOP)

### 1. 編輯階段
在 Obsidian 中進行所有的筆記撰寫、Metadata (YAML) 修改與目錄結構調整。

### 2. 同步與發布階段
當準備好更新網站時，執行同步腳本：
```bash
/root/obsidian-vault/sync_vault.sh
```

**腳本執行邏輯：**
1. **Rsync Mirroring**: 使用 `rsync` 將 Obsidian Vault 的內容完全鏡像到 Quartz 的 `content/` 目錄。
   - 自動排除 `.obsidian/`、`.trash/` 等系統與暫存資料夾。
   - 使用 `--delete` 確保如果 Obsidian 刪除了筆記，網站也會同步刪除，避免死連結。
2. **Git Automation**: 
   - 自動偵測 `quartz/` 目錄是否有變動。
   - 若有變動，自動執行 `git add`、`git commit` 並 `git push`。

### 3. 驗證階段
1. 前往 [GitHub Actions](https://github.com/evanhsia-git/obsidian-vault/actions) 查看 `Deploy Quartz to GitHub Pages` 工作流是否成功。
2. 刷新網站網址，確認內容、Metadata 與目錄結構是否正確同步。

## 相關工具
- **同步腳本**: `/root/obsidian-vault/sync_vault.sh`
- **部署工作流**: `.github/workflows/deploy.yml`
