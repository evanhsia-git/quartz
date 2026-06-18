---
title: Quartz 5 安裝與部署指南
description: Quartz v5.0.0 在 GitHub Pages 上的正確安裝、建置與部署流程
summary: Quartz 5 完整安裝指南，包含相依性修正、GitHub Actions 設定與常見問題排解
type: concept
status: published
priority: P1
tags: [quartz, github-pages, deployment, static-site]
aliases: [quartz-deploy, quartz5-install]
created: 2026-06-17
updated: 2026-06-17
date: 2026-06-17
publish: true
draft: false
related:
  - concepts/hermes-workflow
  - concepts/llm-wiki-concept
source:
due:
review:
---

# Quartz 5 安裝與部署指南

> **版本**：Quartz v5.0.0
> **環境**：Ubuntu 24.04 (glibc) / GitHub Actions (ubuntu-latest)
> **目標**：將 Obsidian Vault 部署為 Quartz 5 靜態網站

---

## 📋 前置條件

| 項目 | 要求 |
|------|------|
| Node.js | >= 22 |
| npm | >= 10.9.2 |
| Git | 任意版本 |
| GitHub Pages | 啟用，Source 設為 **GitHub Actions** |

---

## 🔧 安裝步驟

### 1. 克隆 Quartz 5 源碼

> ⚠️ **重要**：Quartz 5 **不是 npm 套件**，不能 `npm install quartz`。必須從 GitHub 克隆。

```bash
cd /path/to/your-repo
rm -rf quartz  # 清除舊版
git clone https://github.com/jackyzha0/quartz.git quartz
cd quartz
```

### 2. 安裝相依性

```bash
cd quartz
npm install
```

> ⚠️ **注意**：`lightningcss-linux-x64-musl` 在 glibc 環境（Ubuntu）會報錯，但它是 optional 依賴，不影響建置。

### 3. 連結 Obsidian Vault 內容

```bash
# 在 quartz/ 目錄下建立 symlink 指向 Obsidian Vault 的 content/
ln -sf "/root/Documents/Obsidian Vault/content" content
```

### 4. 設定 `quartz.config.yaml`

```yaml
configuration:
  contentDirPath: "./content"
  pageTitle: 你的網站名稱
  locale: zh-TW
  baseUrl: "https://你的用戶名.github.io/倉庫名"
  # ... 其他設定
```

### 5. 本地建置測試

```bash
npx tsx bootstrap-cli.mjs build
```

成功後會在 `quartz/public/` 產生 `index.html` 等靜態檔案。

---

## ⚙️ GitHub Actions 設定

### `.github/workflows/deploy.yml`

```yaml
name: Deploy Quartz to GitHub Pages
on:
  push:
    branches:
      - main
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: quartz/package-lock.json

      - name: Install Dependencies
        working-directory: quartz
        run: npm install

      - name: Build Quartz
        working-directory: quartz
        run: npx tsx ./bootstrap-cli.mjs build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: quartz/public

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 關鍵設定說明

| 設定 | 說明 |
|------|------|
| `environment: github-pages` | `deploy-pages@v4` **必須**有此設定，否則報錯 `Missing environment` |
| `id: deployment` | 讓 `environment.url` 能正確取得部署 URL |
| `cache-dependency-path` | 指定 `quartz/package-lock.json` 以正確快取 |
| `node-version: '22'` | Quartz 5 需要 Node.js >= 22 |

---

## 🔍 常見問題排解

### 問題 1：`ERR_MODULE_NOT_FOUND: Cannot find package 'yargs'`

**原因**：`yargs` 被放在 `devDependencies`，但 CI 只安裝 `dependencies`。

**解決**：將 `yargs` 移至 `dependencies`：

```json
{
  "dependencies": {
    "yargs": "^18.0.0"
  }
}
```

### 問題 2：`Unknown argument: config`

**原因**：`bootstrap-cli.mjs` 不支援 `--config` 參數。

**解決**：直接使用 `npx tsx ./bootstrap-cli.mjs build`，Quartz 會自動讀取 `quartz.config.yaml`。

### 問題 3：`Missing environment` 錯誤

**原因**：`deploy-pages@v4` 需要 `environment: github-pages`。

**解決**：在 job 中加入：
```yaml
environment:
  name: github-pages
  url: ${{ steps.deployment.outputs.page_url }}
```

### 問題 4：網頁顯示 XML 而非 HTML

**原因**：GitHub Pages 的 Source 仍指向 `gh-pages` 分支，而非 GitHub Actions。

**解決**：
1. 前往 **Settings → Pages**
2. 將 **Source** 改為 **GitHub Actions**

### 問題 5：`EBADPLATFORM` 錯誤（lightningcss）

**原因**：`lightningcss-linux-x64-musl` 只支援 Alpine Linux。

**解決**：這是 optional 依賴，不影響建置。可忽略或使用 `--omit=optional`。

---

## 📁 目錄結構

```
obsidian-vault/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署設定
├── quartz/                      # Quartz 5 源碼（從 jackyzha0/quartz 克隆）
│   ├── bootstrap-cli.mjs       # CLI 入口
│   ├── quartz.config.yaml      # Quartz 設定
│   ├── content -> /path/to/Obsidian Vault/content  # symlink
│   ├── public/                 # 建置產物（不提交到 git）
│   ├── node_modules/           # 相依性（不提交到 git）
│   └── package.json
├── content/                     # Obsidian Vault 內容
└── ...
```

---

## ✅ 驗證清單

- [ ] `quartz/` 目錄包含完整 Quartz 5 源碼
- [ ] `quartz/content` 正確指向 Obsidian Vault 內容
- [ ] `quartz/package.json` 中 `yargs` 在 `dependencies`
- [ ] `deploy.yml` 包含 `environment: github-pages`
- [ ] GitHub Pages Source 設為 **GitHub Actions**
- [ ] 本地 `npx tsx bootstrap-cli.mjs build` 成功產生 `public/index.html`
- [ ] GitHub Actions 工作流執行成功

---

## 📚 參考資源

- [Quartz 官方文件](https://quartz.jzhao.xyz)
- [Quartz GitHub Repo](https://github.com/jackyzha0/quartz)
- [GitHub Pages 設定說明](https://docs.github.com/en/pages)
