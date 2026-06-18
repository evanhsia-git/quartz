# 新聞 RSS 來源測試報告

> 測試日期：2026-06-16
> 測試方式：`feedparser.parse()` 抓取各 RSS 來源，檢查回傳則數與內容品質

---

## 一、台股新聞 RSS

| 來源 | 狀態 | 則數 | 台股相關 | 連結品質 | 備註 |
|------|------|------|----------|----------|------|
| ETtoday 財經 | ✅ | 50 | ~25 | 完整新聞網頁 | 品質最佳，幾乎無雜訊 |
| Yahoo 台股綜合 | ✅ | 50 | ~30 | 完整新聞網頁 | 主力來源，需過濾公告 |
| 自由時報財經 | ✅ | 40 | ~20 | 完整新聞網頁 | 需過濾非股市 |
| Yahoo 台股新聞 | ✅ | 50 | ~20 | 完整新聞網頁 | 含公告，需過濾 |
| 中央社產經 | ⚠️ | 20 | ~5 | 完整新聞網頁 | 混入大樂透等非股市 |
| 鉅亨網台股 | ❌ | 0 | - | - | 已失效 |
| 聯合新聞網股市 | ❌ | 0 | - | - | 已失效 |
| MoneyDJ | ❌ | 0 | - | - | 已失效 |
| PChome 股市 | ❌ | 0 | - | - | 已失效 |

**目前腳本使用**：ETtoday + 自由時報 + Yahoo 台股綜合

---

## 二、科技新聞 RSS

| 來源 | 狀態 | 則數 | 語言 | 連結品質 | 備註 |
|------|------|------|------|----------|------|
| TechNews 科技新報 | ✅ | 40 | 中文 | 完整新聞網頁 | 台灣科技新聞主力 |
| INSIDE | ✅ | 10 | 中文 | 完整新聞網頁 | 優質科技媒體 |
| iThome | ✅ | 30 | 中文 | 完整新聞網頁 | IT 專業媒體 |
| TechOrange | ✅ | 20 | 中文 | 完整新聞網頁 | 科技商業新聞 |
| TechCrunch | ✅ | 20 | 英文 | 完整新聞網頁 | 國際科技新聞 |
| The Verge | ✅ | 10 | 英文 | 完整新聞網頁 | 科技生活 |
| Ars Technica | ✅ | 20 | 英文 | 完整新聞網頁 | 深度科技報導 |
| Wired | ✅ | 50 | 英文 | 完整新聞網頁 | 科技文化 |
| MIT Tech Review | ✅ | 10 | 英文 | 完整新聞網頁 | 學術科技 |
| VentureBeat | ✅ | 7 | 英文 | 完整新聞網頁 | AI/新創 |
| ZDNet | ✅ | 20 | 英文 | 完整新聞網頁 | IT 產業 |
| CNET | ✅ | 25 | 英文 | 完整新聞網頁 | 科技產品 |
| 數位時代 | ❌ | 0 | - | - | 已失效 |
| IEEE Spectrum | ❌ | 0 | - | - | 已失效 |

**目前腳本使用**：TechNews + INSIDE + iThome + TechOrange（中文優先）+ TechCrunch + The Verge + Ars Technica + Wired + MIT Tech Review + VentureBeat（英文備用）

---

## 三、美股新聞 RSS

| 來源 | 狀態 | 則數 | 語言 | 連結品質 | 備註 |
|------|------|------|------|----------|------|
| Yahoo 美股 | ✅ | 50 | 中文 | 完整新聞網頁 | 主力，需過濾公告 |
| 鉅亨網全球 | ✅ | 100 | 中文 | 完整新聞網頁 | 含台股，需過濾 |
| CNBC Top News | ✅ | 30 | 英文 | 完整新聞網頁 | 國際財經 |
| Wall Street Journal | ✅ | 20 | 英文 | 完整新聞網頁 | 深度財經 |
| Financial Times | ✅ | 10 | 英文 | 完整新聞網頁 | 國際財經 |
| Yahoo Finance EN | ✅ | 48 | 英文 | 完整新聞網頁 | 美國市場 |
| The Street | ✅ | 50 | 英文 | 完整新聞網頁 | 投資分析 |
| Fox Business | ✅ | 20 | 英文 | 完整新聞網頁 | 商業新聞 |
| Investing.com | ✅ | 10 | 英文 | 完整新聞網頁 | 市場綜觀 |
| Seeking Alpha | ✅ | 30 | 英文 | 完整新聞網頁 | 投資研究 |
| Benzinga | ✅ | 10 | 英文 | 完整新聞網頁 | 金融快訊 |
| MarketWatch | ❌ | 0 | - | - | 擋爬蟲，回傳 0 則 |
| Thomson Reuters | ❌ | 10 | - | - | 只有 IR 公告，非一般新聞 |
| CNN Top Stories | ❌ | 69 | - | - | 內容為 2023 年舊新聞，非即時 |
| Barron's | ❌ | 0 | - | - | 已失效 |
| AP News | ❌ | 0 | - | - | 已失效 |

**目前腳本使用**：Yahoo 美股 + 鉅亨網全球（中文優先）+ CNBC + WSJ + FT + Yahoo Finance EN + The Street + Fox Business + Investing.com + Seeking Alpha（英文備用）

---

## 四、失效來源清單

| 來源 | URL | 類別 |
|------|-----|------|
| 鉅亨網台股 | `https://www.cnyes.com/rss/taiex.rss` | 台股 |
| 聯合新聞網股市 | `https://udn.com/rssfeed/news/cate/2/6644` | 台股 |
| 聯合新聞網財經 | `https://udn.com/rssfeed/news/cate/2/6645` | 台股 |
| MoneyDJ | `https://www.moneydj.com/rss/news.aspx` | 台股 |
| PChome 股市 | `https://news.pchome.com.tw/rss/stock` | 台股 |
| 數位時代 | `https://www.bnext.com.tw/feed/rss` | 科技 |
| IEEE Spectrum | `https://spectrum.ieee.org/feed/` | 科技 |
| MarketWatch | `https://feeds.content.dowj.io/public/rss/mw_topstories` | 美股 |
| Reuters | `https://www.reutersagency.com/feed/` | 美股 |
| Barron's | `https://www.barrons.com/rss` | 美股 |
| CNN Business | `https://rss.cnn.com/rss/money_news_international.rss` | 美股 |
| AP News | `https://apnews.com/index.rss` | 美股 |

---

## 五、維護注意事項

- 本報告應每月更新一次，重新測試所有來源
- 若來源失效，應立即從腳本 `RSS_SOURCES` 移除
- 新增來源時需先測試確認可連結到完整新聞網頁
- **禁止使用** `blogwatcher-cli`（已棄用）
- 所有腳本使用 `no_agent` 模式，Python 直接輸出純文字
