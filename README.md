# 📅 今日のトピックジャンプボタン (Today Jump Button)

Webページ内の「日付が含まれる見出し（h2〜h5など）」を自動検索し、本日の日付のセクションへ滑らかにスクロール移動（スムーススクロール）するJavaScript/HTMLスニペットです。

## ✨ 特徴
- **自動日付検出**: 実行時の日付（例: `10月1日`, `10/1`, `10/01` など）を検出して該当の見出しへジャンプします。
- **最新トピックのフォールバック**: 本日の日付が見つからない場合、今日以前で最も新しい過去のトピックへ自動誘導します。
- **視覚的フィードバック**: スクロール移動後、該当要素を黄色く2秒間ハイライト表示します。

## 🚀 デモ (GitHub Pages)
[デモページはこちら](https://uchida55.github.io/today-jump-button/)

## 🛠 導入方法 (Usage)

ご自身のHTMLファイルの任意の場所（ボタンを表示させたい場所）に以下のコードを貼り付けてください。

```html
<p dir="ltr" style="text-align: left;">登録キー：ght</p>

<!-- 今日のトピックへ飛ぶ大きなボタン -->
<div style="text-align: center; margin: 15px 0;">
    <button type="button" onclick="jumpToToday()" style="background-color: #28a745; color: #ffffff; font-size: 18px; font-weight: bold; padding: 14px 28px; border: none; border-radius: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.15); cursor: pointer; transition: transform 0.2s, background-color 0.2s;">
        📅 今日のトピック（日付）へ直接ジャンプ ⬇
    </button>
</div>

<script>
    // JavaScript処理コードをここに追加
</script>
