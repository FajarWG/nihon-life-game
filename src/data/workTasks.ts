import type { WorkTask } from "@/core/types";

/** Sample IT-company tickets — extend by following WorkTask. Kind decides the mini-game widget. */
export const WORK_TASKS: WorkTask[] = [
  {
    id: "w-css-color", kind: "bug-css", level: "N5",
    title: "ボタンの色が違います", titleEn: "The button color is wrong",
    body: [
      { jp: "ログインボタンの色が赤になっています。", en: "The login button has turned red.", idn: "Tombol login berubah jadi merah." },
      { jp: "青にしてください。", en: "Please make it blue.", idn: "Tolong ubah jadi biru." },
    ],
    question: "Which CSS fixes the ticket?",
    options: [
      ".login-btn { background: blue; }",
      ".login-btn { background: red; }",
      ".login-btn { font-size: blue; }",
    ],
    answer: ".login-btn { background: blue; }",
    pay: 800,
  },
  {
    id: "w-css-size", kind: "bug-css", level: "N4",
    title: "文字が小さすぎます", titleEn: "The text is too small",
    body: [
      { jp: "画面のタイトルの文字が小さすぎて、読めません。", en: "The screen title text is too small to read.", idn: "Teks judul layar terlalu kecil sampai tidak terbaca." },
      { jp: "24ピクセルに直してください。", en: "Please fix it to 24 pixels.", idn: "Tolong perbaiki menjadi 24 piksel." },
    ],
    question: "Which CSS fixes the ticket?",
    options: [
      "h1 { font-size: 24px; }",
      "h1 { width: 24px; }",
      "h1 { font-size: 2.4px; }",
    ],
    answer: "h1 { font-size: 24px; }",
    pay: 1000,
  },
  {
    id: "w-label-1", kind: "ui-label", level: "N5",
    title: "画面のラベルを確認してください", titleEn: "Please check the screen labels",
    body: [{ jp: "新しい画面のボタンのラベルです。意味を確認してください。", en: "These are the new screen's button labels. Please confirm their meanings.", idn: "Ini label tombol layar baru. Tolong pastikan artinya." }],
    question: "Match each Japanese UI label to its meaning.",
    pairs: [
      ["ログイン", "Log in"],
      ["検索", "Search"],
      ["設定", "Settings"],
      ["送信", "Send"],
    ],
    pay: 700,
  },
  {
    id: "w-git-1", kind: "git-order", level: "N4",
    title: "作業の手順を覚えましょう", titleEn: "Learn the workflow steps",
    body: [{ jp: "山田さん：「うちのチームのGitの流れです。順番に並べてみてください。」", en: "Yamada: \"This is our team's Git flow. Try putting it in order.\"", idn: "Yamada: \"Ini alur Git tim kita. Coba urutkan.\"" }],
    question: "Arrange the Git workflow in order.",
    tiles: ["git pull", "git checkout -b fix/button", "コードを直す", "git commit", "git push", "プルリクエストを出す"],
    pay: 900,
  },
  {
    id: "w-meeting-1", kind: "meeting", level: "N4",
    title: "会議の連絡", titleEn: "Meeting notice",
    body: [
      { jp: "お疲れ様です。", en: "Good work, everyone.", idn: "Terima kasih kerja kerasnya, semuanya." },
      { jp: "明日のデザインレビューは木曜日の15時からです。", en: "Tomorrow's design review is Thursday from 3 PM.", idn: "Design review besok hari Kamis mulai pukul 15.00." },
      { jp: "会議室Bに集まってください。", en: "Please gather in meeting room B.", idn: "Silakan berkumpul di ruang rapat B." },
    ],
    question: "When and where is the design review?",
    options: ["Thursday 15:00, Room B", "Tuesday 15:00, Room B", "Thursday 5:00, Room D"],
    answer: "Thursday 15:00, Room B",
    pay: 800,
  },
  {
    id: "w-js-onclick", kind: "bug-js", level: "N3",
    title: "onClickが動きません", titleEn: "onClick isn't working",
    body: [
      { jp: "ボタンを押しても、onClickが実行されません。", en: "Even when I press the button, onClick doesn't execute.", idn: "Meski tombol ditekan, onClick tidak jalan." },
      { jp: "山田さん：「関数の呼び出し方を確認してください。」", en: "Yamada: \"Please check how the function is being called.\"", idn: "Yamada: \"Tolong periksa cara pemanggilan fungsinya.\"" },
    ],
    question: "Which code correctly calls the function on click?",
    options: [
      "<button onClick={handleClick}>送信</button>",
      "<button onClick={handleClick()}>送信</button>",
      "<button onclick=\"handleClick\">送信</button>",
    ],
    answer: "<button onClick={handleClick}>送信</button>",
    pay: 1100,
  },
  {
    id: "w-review-loop", kind: "code-review", level: "N3",
    title: "コードレビューのコメント", titleEn: "Code review comment",
    body: [
      { jp: "先輩がコードをレビューしました。", en: "My senpai reviewed the code.", idn: "Senior saya me-review kode ini." },
      { jp: "「このループの中でAPIを呼び出すのは良くないです。ループの外に出してください。」", en: "\"Calling the API inside this loop isn't good. Please move it outside the loop.\"", idn: "\"Memanggil API di dalam loop ini kurang baik. Tolong pindahkan ke luar loop.\"" },
    ],
    question: "Which line should be moved outside the loop, according to the review?",
    options: [
      "API を呼び出す行 (fetch(...))",
      "変数を宣言する行 (let i = 0)",
      "ループの終了条件 (i < items.length)",
    ],
    answer: "API を呼び出す行 (fetch(...))",
    pay: 1200,
  },
  {
    id: "w-docs-auth", kind: "docs", level: "N3",
    title: "APIドキュメントを読む", titleEn: "Read the API documentation",
    body: [
      { jp: "新しいAPIのドキュメントです。", en: "This is the documentation for the new API.", idn: "Ini dokumentasi API baru." },
      { jp: "「このエンドポイントは、認証トークンが必要です。トークンがない場合、401エラーが返されます。」", en: "\"This endpoint requires an auth token. Without a token, a 401 error is returned.\"", idn: "\"Endpoint ini butuh token autentikasi. Tanpa token, akan dikembalikan error 401.\"" },
    ],
    question: "What happens if there's no auth token?",
    options: ["A 401 error is returned", "The request succeeds anyway", "The server restarts"],
    answer: "A 401 error is returned",
    pay: 900,
  },
  {
    id: "w-meeting-release", kind: "meeting", level: "N3",
    title: "リリース前の確認", titleEn: "Pre-release check-in",
    body: [
      { jp: "お疲れ様です。", en: "Good work, everyone.", idn: "Terima kasih kerja kerasnya, semuanya." },
      { jp: "明日の朝、本番環境にリリースします。", en: "Tomorrow morning, we'll release to production.", idn: "Besok pagi, kita akan rilis ke lingkungan produksi." },
      { jp: "何か問題があれば、今日中に報告してください。", en: "If there are any issues, please report them by end of today.", idn: "Kalau ada masalah, tolong laporkan sebelum hari ini berakhir." },
    ],
    question: "By when should issues be reported?",
    options: ["By end of today", "By next week", "After the release"],
    answer: "By end of today",
    pay: 1000,
  },
];

export const tasksForLevel = (level: string) => WORK_TASKS.filter(t => t.level === level || level !== "N5" && t.level === "N5");
