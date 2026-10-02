<!-- 今日のトピックへ飛ぶ大きなボタン -->
<div style="text-align:center; margin:15px 0;">

    <button type="button" onclick="jumpToToday()" style="
                background-color:#28a745;
                color:#ffffff;
                font-size:18px;
                font-weight:bold;
                padding:14px 28px;
                border:none;
                border-radius:30px;
                box-shadow:0 4px 6px rgba(0,0,0,0.15);
                cursor:pointer;
            ">
        📅 今日のトピック（日付）へ直接ジャンプ ⬇
    </button>

    <div style="
        font-size:10px;
        color:#999;
        margin-top:3px;
    ">
        v0.5
    </div>

</div>

<script>
    function jumpToToday() {

        var now = new Date();

        var today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        var todayYear = today.getFullYear();
        var todayMonth = today.getMonth() + 1;
        var todayDay = today.getDate();

        var elements = document.querySelectorAll(
            'h2, h3, h4, h5, .sectionname, .contenttitle'
        );

        var todayElement = null;

        // 今日以前で最も新しい日
        var previousElement = null;
        var previousDate = null;
        var previousText = '';

        // 過去が存在しない場合に使う未来の日
        var nextElement = null;
        var nextDate = null;
        var nextText = '';


        for (var i = 0; i < elements.length; i++) {

            var text =
                elements[i].textContent ||
                elements[i].innerText ||
                '';

            var year = null;
            var month = null;
            var day = null;

            var match;


            // --------------------------------
            // 2026年10月2日
            // --------------------------------
            match = text.match(
                /(\d{4})年(\d{1,2})月(\d{1,2})日/
            );

            if (match) {
                year = parseInt(match[1], 10);
                month = parseInt(match[2], 10);
                day = parseInt(match[3], 10);
            }


            // --------------------------------
            // 2026/10/2
            // --------------------------------
            if (!match) {

                match = text.match(
                    /(\d{4})\/(\d{1,2})\/(\d{1,2})/
                );

                if (match) {
                    year = parseInt(match[1], 10);
                    month = parseInt(match[2], 10);
                    day = parseInt(match[3], 10);
                }
            }


            // --------------------------------
            // 10月2日
            // --------------------------------
            if (!match) {

                match = text.match(
                    /(\d{1,2})月(\d{1,2})日/
                );

                if (match) {
                    month = parseInt(match[1], 10);
                    day = parseInt(match[2], 10);
                }
            }


            // --------------------------------
            // 10/2、10/02
            // --------------------------------
            if (!match) {

                match = text.match(
                    /(?:^|[^\d])(\d{1,2})\/(\d{1,2})(?!\d)/
                );

                if (match) {
                    month = parseInt(match[1], 10);
                    day = parseInt(match[2], 10);
                }
            }


            // 日付がなければ次へ
            if (month === null || day === null) {
                continue;
            }


            // 基本は今年
            if (year === null) {
                year = todayYear;

                /*
                 * 年またぎ対策
                 *
                 * 今日が1～2月で
                 * 11～12月の見出しなら前年
                 *
                 * 今日が11～12月で
                 * 1～2月の見出しなら翌年
                 */
                if (
                    todayMonth <= 2 &&
                    month >= 11
                ) {
                    year = todayYear - 1;
                } else if (
                    todayMonth >= 11 &&
                    month <= 2
                ) {
                    year = todayYear + 1;
                }
            }


            var topicDate = new Date(
                year,
                month - 1,
                day
            );


            // --------------------------------
            // 不正な日付を除外
            // 例：2月31日
            // --------------------------------
            if (
                topicDate.getFullYear() !== year ||
                topicDate.getMonth() + 1 !== month ||
                topicDate.getDate() !== day
            ) {
                continue;
            }


            var topicText =
                month + '月' + day + '日';


            // =================================
            // 1. 今日そのもの
            // =================================
            if (
                topicDate.getTime() === today.getTime()
            ) {

                todayElement = elements[i];
                break;
            }


            // =================================
            // 2. 今日より過去
            //    最も新しいものを保持
            // =================================
            if (topicDate < today) {

                if (
                    previousDate === null ||
                    topicDate > previousDate
                ) {

                    previousDate = topicDate;
                    previousElement = elements[i];
                    previousText = topicText;
                }
            }


            // =================================
            // 3. 今日より未来
            //    最も近いものを保持
            // =================================
            if (topicDate > today) {

                if (
                    nextDate === null ||
                    topicDate < nextDate
                ) {

                    nextDate = topicDate;
                    nextElement = elements[i];
                    nextText = topicText;
                }
            }
        }


        // =====================================
        // ① 今日がある
        // =====================================
        if (todayElement) {

            scrollToTopic(todayElement);
            return;
        }


        // =====================================
        // ② 今日がない
        //    → 直近の過去を優先
        // =====================================
        if (previousElement) {

            alert(
                '本日（' +
                todayMonth + '月' +
                todayDay + '日）のトピックはありません。\n\n' +
                '直近のトピック（' +
                previousText +
                '）へ移動します。'
            );

            scrollToTopic(previousElement);
            return;
        }


        // =====================================
        // ③ 過去が1件もない
        //    → 最も近い未来へ
        // =====================================
        if (nextElement) {

            alert(
                '本日以前のトピックはありません。\n\n' +
                '次のトピック（' +
                nextText +
                '）へ移動します。'
            );

            scrollToTopic(nextElement);
            return;
        }


        alert(
            '日付が含まれるトピックを見つけられませんでした。'
        );
    }


    /* --------------------------------
       指定したトピックへ移動
    -------------------------------- */
    function scrollToTopic(element) {

        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        var originalBg =
            element.style.backgroundColor;

        element.style.backgroundColor =
            '#fff3cd';

        setTimeout(function() {

            element.style.backgroundColor =
                originalBg;

        }, 2000);
    }
</script>
