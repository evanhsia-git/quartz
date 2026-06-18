1|# Quartz 5 完整建置與問題排除指南
2|
3|本指南記錄了在 Linux (Root 權限) 環境下，全新建置 Quartz v5 並與 Obsidian Vault 進行雙向綁定、發布至 GitHub 的完整流程，同時包含建置過程中遇到的權限、循環軟連結（Symlink Loop）與 Git 狀態異常的解決方案。
4|
5|---
6|
7|## 📂 目標資料夾架構
8|
9|為了保持原始筆記與網頁生成器的獨立性，採用以下分離架構：
10|
11|```text
12|/root/Documents/
13|│
14|├── Obsidian Vault/        # 原始 Obsidian 筆記軟體資料夾（後台）
15|│   ├── concepts/
16|│   ├── entities/
17|│   ├── projects/
18|│   └── ...
19|│
20|└── Quartz/                # Quartz v5 專案主程式（前台）
21|    ├── content/           # 軟連結（Symlink），直接指向外層的 Obsidian Vault
22|    ├── quartz.config.ts   # 核心網頁設定檔
23|    ├── package.json
24|    └── public/            # 編譯產生的靜態網頁檔案（預設被 .gitignore）
25|```
26|
27|---
28|
29|## 🛠️ 第一部分：從零開始建置步驟
30|
31|### 1. 建立 Obsidian 基礎目錄
32|手動建立你規劃的 Obsidian 資料夾與子目錄（可先放入測試用的 .md 筆記）：
33|
34|```bash
35|mkdir -p "/root/Documents/Obsidian Vault/concepts"
36|mkdir -p "/root/Documents/Obsidian Vault/entities"
37|mkdir -p "/root/Documents/Obsidian Vault/projects"
38|```
39|
40|### 2. 複製 Quartz v5 專案
41|切換到工作目錄並從官方 GitHub 複製最新版 Quartz：
42|
43|```bash
44|cd /root/Documents/
45|git clone https://github.com/jackyzha0/quartz.git Quartz
46|```
47|
48|### 3. 安裝依賴套件
49|進入 Quartz 目錄並執行安裝：
50|
51|```bash
52|cd /root/Documents/Quartz
53|npm install
54|```
55|
56|### 4. 初始化 Quartz 組態 (補丁方案)
57|由於在 root 權限下執行 `npx quartz create` 的自動化腳本容易因 Linux 安全機制被攔截，導致 `.quartz/plugins` 遺失而報錯（`Could not resolve "../../.quartz/plugins"`）。
58|
59|請務必手動補齊空殼檔案與組態：
60|
61|```bash
62|# 建立隱藏的 .quartz 組態目錄與 plugins 樁程式
63|mkdir -p .quartz/plugins
64|echo "export const CustomOgImagesEmitterName = 'CustomOgImagesEmitter';" > .quartz/plugins/index.inline.ts
65|echo "export const CustomOgImagesEmitterName = 'CustomOgImagesEmitter';" > .quartz/plugins/index.ts
66|```
67|
68|### 5. 手動建立 Obsidian 與 Quartz 的橋樑
69|不要使用自動化指令綁定，直接用 Linux 最底層的絕對路徑建立符號連結（Symlink）：
70|
71|```bash
72|# 如果 Quartz 內已有自動產生的 content，先刪除
73|rm -rf /root/Documents/Quartz/content
74|
75|# 建立正確的軟連結
76|ln -s "/root/Documents/Obsidian Vault" /root/Documents/Quartz/content
77|```
78|
79|### 6. 本地啟動測試
80|執行以下指令編譯並啟動本機伺服器：
81|
82|```bash
83|npx quartz build --serve
84|```
85|當畫面上出現 `Serving at: http://localhost:8080` 時，即可開啟瀏覽器輸入網址預覽網頁。
86|
87|---
88|
89|## ❌ 第二部分：常見問題與終極排除
90|
91|### 問題一：無限迴圈、檔案數量異常暴增（Found 9880 input files）
92|**原因分析**：在先前的嘗試中，不小心在 Obsidian Vault 資料夾「內部」又建立了一個指向自己或指向 content 的軟連結，導致 Quartz 掉入遞迴迷宮。
93|
94|**解決手段**：
95|```bash
96|# 1. 斷開 Quartz 端連線
97|cd /root/Documents/Quartz
98|rm -rf content
99|
100|# 2. 找出並徹底刪除隱藏在 Obsidian Vault 內的所有循環軟連結
101|# (此指令只會刪除壞掉的捷徑，絕對不會傷到 .md 筆記)
102|find "/root/Documents/Obsidian Vault" -type l -delete
103|
104|# 3. 重新建立乾淨的橋樑
105|ln -s "/root/Documents/Obsidian Vault" /root/Documents/Quartz/content
106|```
107|
108|### 問題二：Git 處於斷頭狀態、無法更名分支（fatal: cannot rename the current branch while not on any）
109|**原因分析**：本地 Git 快取錯亂，或是處於沒有 Commit 的虛擬指標狀態，導致執行 `git branch -M v5` 失敗。
110|
111|**解決手段**：直接將舊 Git 紀錄拔除重灌，從源頭鎖定 v5 分支。
112|
113|```bash
114|cd /root/Documents/Quartz
115|
116|# 1. 物理刪除損壞的 Git 紀錄
117|rm -rf .git
118|
119|# 2. 重新初始化 Git
120|git init
121|
122|# 3. 直接建立並切換至 v5 分支
123|git checkout -b v5
124|
125|# 4. 重新暫存並提交
126|git add .
127|git commit -m "init: quartz v5 clean architecture"
128|```
129|
130|---
131|
132|## 🚀 第三部分：重新推送到現有 GitHub Repo
133|完成上述 Git 修復後，執行以下指令強行覆蓋遠端舊資料，將全新的 Quartz 5 專案與自動化工作流（GitHub Actions）推上雲端：
134|
135|```bash
136|# 1. 綁定你的 GitHub 遠端儲存庫
137|git remote add origin https://github.com/evanhsia-git/obsidian-vault.git
138|
139|# 2. 強制推送並覆蓋遠端舊資料 (-f)
140|git push -u origin v5 -f
141|```
142|**GitHub Pages 提示**：推送成功後，請至 GitHub 儲存庫網頁端的 `Settings` $\rightarrow$ `Pages`，將 `Build and deployment` 的 `Source` 設定為 `Deploy from a branch`，並將分支指向 `gh-pages` 即可完成線上發布。
143|
144|---
145|
146|## 📝 第四部分：日常更新工作流 (Workflow)
147|環境通電後，未來只要你在 Obsidian 裡新增或修改了筆記，只需回到 Linux 終端機執行這流暢的三部曲，網站就會在 1 分鐘內自動同步更新：
148|
149|```bash
150|cd /root/Documents/Quartz
151|
152|# 1. 讓 Git 捕捉最新變更的筆記
153|git add .
154|
155|# 2. 記錄更新訊息
156|git commit -m "feat: update notes"
157|
158|# 3. 推送到 GitHub (日常更新不需加 -f)
159|git push origin v5
160|```
161|

---

## 第五部分：最佳方案 (The Golden Standard)

為了達到最高的穩定性與架構清晰度，建議採用以下「物理分離」的架構：

- **`/root/Documents/Obsidian Vault/`** $ightarrow$ **真理來源 (Source of Truth)**
- **`/root/Documents/Quartz/`** $ightarrow$ **發布專用 (Deployment Target)**
- **`rsync --delete`** $ightarrow$ **同步機制**
- **GitHub Actions** $ightarrow$ **自動建站流程**

---

## 第六部分：同步策略與備份方式

在選擇同步手段時，必須考慮到「雲端建置環境」的特性。

### 方案 A：使用軟連結 (Symbolic Link)
使用 `ln -s` 將 `Quartz/content` 指向 `Obsidian Vault`。

* **優點**：
    - 本機測試與預覽完全正常，無需額外同步步驟。
* **缺點**：
    - **GitHub Repository 不會儲存實際內容**：在 Git 中，軟連結只會儲存一個路徑字串。
    - **雲端建置失效**：當 GitHub Actions 在雲端伺服器執行時，它讀取的是一個「指向本機路徑」的死連結，**無法看到你的筆記**，導致建置出的網頁是空的或報錯。

| 平台 | 支援程度 | 說明 |
| :--- | :---: | :--- |
| **本機 Quartz 預覽** | ✅ | 完全支援 |
| **GitHub Pages** | ❌ | 抓不到連結後的實際檔案 |
| **Cloudflare Pages** | ❌ | 同上 |
| **Netlify** | ❌ | 同上 |

### 方案 B：使用 Rsync (實體同步) — **強烈推薦**

使用 `rsync` 將內容實體拷貝到 `Quartz/content/`。

* **優點**：
    - **GitHub Actions 最穩**：雲端建置引擎讀取的是真實存在的檔案。
    - **不怕軟連結問題**：徹底解決了雲端環境無法解析路徑的問題。
* **缺點**：
    - 需要在發布前執行一次同步指令。

---

### 🛠️ 進階工具：一鍵發布腳本 (`publish.sh`)

為了簡化操作，建議建立一個自動化腳本，將「同步」與「推送」合併為一步：

```bash
#!/bin/bash
# 1. 同步筆記內容 (使用 --delete 確保刪除在 Obsidian 中已移除的檔案)
rsync -av --delete   "/root/Documents/Obsidian Vault/"   "/root/Documents/Quartz/content/"

# 2. 進入 Quartz 目錄並推送
cd /root/Documents/Quartz
git add .
git commit -m "Auto Publish: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin v5
```

**使用方法**：
```bash
chmod +x publish.sh
./publish.sh
```

---

## 💡 總結與專家建議

以您的需求（**VPS + Obsidian + GitHub Pages + Quartz 5**）來看，最專業且不容易出問題的架構是：

1.  **目錄分離**：維持 `/root/Documents/Obsidian Vault` 與 `/root/Documents/Quartz` 的獨立性。
2.  **實體同步**：**不要**在 GitHub 上使用 Symbolic Link，請務必使用 `rsync` 搬移內容。
3.  **流程自動化**：透過 `publish.sh` 腳本確保每次發布的內容與 Commit 紀錄都是乾淨且一致的。
