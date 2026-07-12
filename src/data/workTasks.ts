import type { WorkTask } from "@/core/types";

/** Sample IT-company tickets — extend by following WorkTask. Kind decides the mini-game widget. */
export const WORK_TASKS: WorkTask[] = [
  {
    id: "w-css-color", kind: "bug-css", level: "N5",
    title: "ボタンの色が違います", titleEn: "The button color is wrong",
    body: [
      { jp: "ログインボタンの色が赤になっています。", en: "The login button has turned red." },
      { jp: "青にしてください。", en: "Please make it blue." },
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
      { jp: "画面のタイトルの文字が小さすぎて、読めません。", en: "The screen title text is too small to read." },
      { jp: "24ピクセルに直してください。", en: "Please fix it to 24 pixels." },
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
    body: [{ jp: "新しい画面のボタンのラベルです。意味を確認してください。", en: "These are the new screen's button labels. Please confirm their meanings." }],
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
    body: [{ jp: "山田さん：「うちのチームのGitの流れです。順番に並べてみてください。」", en: "Yamada: \"This is our team's Git flow. Try putting it in order.\"" }],
    question: "Arrange the Git workflow in order.",
    tiles: ["git pull", "git checkout -b fix/button", "コードを直す", "git commit", "git push", "プルリクエストを出す"],
    pay: 900,
  },
  {
    id: "w-meeting-1", kind: "meeting", level: "N4",
    title: "会議の連絡", titleEn: "Meeting notice",
    body: [
      { jp: "お疲れ様です。", en: "Good work, everyone." },
      { jp: "明日のデザインレビューは木曜日の15時からです。", en: "Tomorrow's design review is Thursday from 3 PM." },
      { jp: "会議室Bに集まってください。", en: "Please gather in meeting room B." },
    ],
    question: "When and where is the design review?",
    options: ["Thursday 15:00, Room B", "Tuesday 15:00, Room B", "Thursday 5:00, Room D"],
    answer: "Thursday 15:00, Room B",
    pay: 800,
  },
];

export const tasksForLevel = (level: string) => WORK_TASKS.filter(t => t.level === level || level !== "N5" && t.level === "N5");
