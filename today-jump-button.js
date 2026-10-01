
## 2. `today-jump-button.js`

これが本体です。

```javascript
/*
 * Today Jump Button
 * Version: v0.5
 *
 * 優先順位
 * 1. 今日
 * 2. 直近の過去
 * 3. 過去がなければ最も近い未来
 */

(function () {

    const VERSION = 'v0.5';


    /*
     * 年のない月日について、
     * 前年・今年・翌年の中から
     * 今日に最も近い年を採用する
     */
    function resolveYear(month, day, today) {

        const baseYear = today.getFullYear();

        const candidates = [
            new Date(baseYear - 1, month - 1, day),
            new Date(baseYear,     month - 1, day),
            new Date(baseYear + 1, month - 1, day)
        ];

        let bestDate = null;
        let bestDiff = Infinity;

        for (let i = 0; i < candidates.length; i++) {

            const candidate = candidates[i];

            // 2月31日などの不正日付を除外
            if (
                candidate.getMonth() + 1 !== month ||
                candidate.getDate() !== day
            ) {
                continue;
            }

            const diff = Math.abs(
                candidate.getTime() - today.getTime()
            );

            if (diff < bestDiff) {
                bestDiff = diff;
                bestDate = candidate;
            }
        }

        return bestDate;
    }


    /*
     * 見出し文字列から日付を取り出す
     */
    function extractDate(text, today) {

        let match;
        let year = null;
        let month = null;
        let day = null;


        // -----------------------------
        // 2026年10月1日
        // -----------------------------
        match = text.match(
            /(\d{4})年(\d{1,2})月(\d{1,2})日/
        );

        if (match) {

            year  = parseInt(match[1], 10);
            month = parseInt(match[2], 10);
            day   = parseInt(match[3], 10);
        }


        // -----------------------------
        // 2026/10/1
        // -----------------------------
        if (!match) {

            match = text.match(
                /(?:^|[^\d])(\d{4})\/(\d{1,2})\/(\d{1,2})(?!\d)/
            );

            if (match) {

                year  = parseInt(match[1], 10);
                month = parseInt(match[2], 10);
                day   = parseInt(match[3], 10);
            }
        }


        // -----------------------------
        // 10月1日
        // -----------------------------
        if (!match) {

            match = text.match(
                /(\d{1,2})月(\d{1,2})日/
            );

            if (match) {

                month = parseInt(match[1], 10);
                day   = parseInt(match[2], 10);
            }
        }


        // -----------------------------
        // 10/1
        // 10/01
        //
        // 10/1 と 10/10 を区別
        // -----------------------------
        if (!match) {

            match = text.match(
                /(?:^|[^\d/])(\d{1,2})\/(\d{1,2})(?![\d/])/
            );

            if (match) {

                month = parseInt(match[1], 10);
                day   = parseInt(match[2], 10);
            }
        }


        if (month === null || day === null) {
            return null;
        }


        if (
            month < 1 ||
            month > 12 ||
            day < 1 ||
            day > 31
        ) {
            return null;
        }


        let topicDate;


        // 年が明記されている
        if (year !== null) {

            topicDate = new Date(
                year,
                month - 1,
                day
            );


            // 不正日付
            if (
                topicDate.getFullYear() !== year ||
                topicDate.getMonth() + 1 !== month ||
                topicDate.getDate() !== day
            ) {
                return null;
            }
        }

        // 年がない
        else {

            topicDate = resolveYear(
                month,
                day,
                today
            );

            if (!topicDate) {
                return null;
            }
        }


        return {
            date: topicDate,
            month: month,
            day: day,
            text: month + '月' + day + '日'
        };
    }


    /*
     * 対象見出しへスクロール
     */
    function scrollToTopic(element) {

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });


        const originalBg =
            element.style.backgroundColor;

        element.style.backgroundColor =
            '#fff3cd';


        setTimeout(function () {

            element.style.backgroundColor =
                originalBg;

        }, 2000);
    }


    /*
     * メイン処理
     */
    function jumpToToday() {

        const now = new Date();

        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );


        const todayMonth =
            today.getMonth() + 1;

        const todayDay =
            today.getDate();


        /*
         * Moodle等を想定
         */
        const elements =
            document.querySelectorAll(
                'h2, h3, h4, h5, .sectionname, .contenttitle'
            );


        let todayElement = null;


        /*
         * 直近の過去
         */
        let previousElement = null;
        let previousDate = null;
        let previousText = '';


        /*
         * 最も近い未来
         */
        let nextElement = null;
        let nextDate = null;
        let nextText = '';


        for (let i = 0; i < elements.length; i++) {

            const text =
                elements[i].textContent ||
                elements[i].innerText ||
                '';


            const result =
                extractDate(text, today);


            if (!result) {
                continue;
            }


            const topicDate =
                result.date;


            /*
             * 今日
             */
            if (
                topicDate.getTime() ===
                today.getTime()
            ) {

                todayElement =
                    elements[i];

                break;
            }


            /*
             * 過去
             *
             * 今日以前で
             * 一番新しい日付を保持
             */
            if (topicDate < today) {

                if (
                    previousDate === null ||
                    topicDate > previousDate
                ) {

                    previousDate =
                        topicDate;

                    previousElement =
                        elements[i];

                    previousText =
                        result.text;
                }
            }


            /*
             * 未来
             *
             * 今日より後で
             * 一番近い日付を保持
             */
            if (topicDate > today) {

                if (
                    nextDate === null ||
                    topicDate < nextDate
                ) {

                    nextDate =
                        topicDate;

                    nextElement =
                        elements[i];

                    nextText =
                        result.text;
                }
            }
        }


        /*
         * 1. 今日がある
         */
        if (todayElement) {

            scrollToTopic(
                todayElement
            );

            return;
        }


        /*
         * 2. 今日がない
         *    → 直近の過去
         */
        if (previousElement) {

            alert(
                '本日（' +
                todayMonth +
                '月' +
                todayDay +
                '日）のトピックはありません。\n\n' +

                '直近のトピック（' +
                previousText +
                '）へ移動します。'
            );


            scrollToTopic(
                previousElement
            );

            return;
        }


        /*
         * 3. 過去がない
         *    → 最も近い未来
         */
        if (nextElement) {

            alert(
                '本日以前のトピックはありません。\n\n' +

                '次のトピック（' +
                nextText +
                '）へ移動します。'
            );


            scrollToTopic(
                nextElement
            );

            return;
        }


        /*
         * 日付がない
         */
        alert(
            '日付が含まれるトピックを見つけられませんでした。'
        );
    }


    /*
     * HTML側から
     * onclick="jumpToToday()"
     * で呼べるように公開
     */
    window.jumpToToday =
        jumpToToday;


    /*
     * バージョン表示
     */
    document.addEventListener(
        'DOMContentLoaded',
        function () {

            const versions =
                document.querySelectorAll(
                    '.today-jump-version'
                );

            versions.forEach(
                function (element) {

                    element.textContent =
                        VERSION;
                }
            );
        }
    );

})();
