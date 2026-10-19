/*CMD
  command: /about
  help: 
  need_reply: false
  auto_retry_time: 
  folder: 

  <<ANSWER

  ANSWER

  <<KEYBOARD

  KEYBOARD
  aliases: 
  group: 
CMD*/

let currentTime = new Date();
let timeOffset = 5.5 * 60 * 60 * 1000;
let localTime = new Date(currentTime.getTime() + timeOffset);

// time
let hours = localTime.getUTCHours();
let minutes = localTime.getUTCMinutes();
let seconds = localTime.getUTCSeconds();

let ampm = hours >= 12 ? "PM" : "AM";
hours = hours % 12;
hours = hours ? hours : 12;

minutes = minutes < 10 ? "0" + minutes : minutes;
seconds = seconds < 10 ? "0" + seconds : seconds;

let formattedTime = hours + ":" + minutes + ":" + seconds + " " + ampm;

// date
let year = currentTime.getFullYear();
let month = (currentTime.getMonth() + 1).toString().padStart(2, "0");
let day = currentTime.getDate().toString().padStart(2, "0");
let TodayDate = year + "-" + month + "-" + day;

// stats
let stat = Libs.ResourcesLib.anotherChatRes("status", "global");

// message
let msg =
"<i>👋 Hi! I'm</i> @LeaveKickerBot, <i>your Auto Kicker Bot.</i> ⚡\n\n" +
"<b>🧑‍💻 Add me to your channel with admin rights.\n" +
"⚡ I will auto-kick users who leave after joining.\n\n</b>" +
"📊 <b>Live Stats -</b>\n" +
"<blockquote>" +
"👥 Total Users: <code>" + stat.value() + "</code>\n" +
"📆 Date: " + TodayDate + "\n" +
"⏰ Real-time: " + formattedTime +
"</blockquote>";

let buttons = [
  [
    { text: "📊 My Channels", callback_data: "/mychannels" },
    { text: "🔙 Back", callback_data: "/back" }
  ],
  [
    {
      text: "✚ Add To Channel",
      url:
        "https://t.me/LeaveKickerBot?startchannel=true&admin=post_messages+delete_messages+edit_messages+restrict_members+invite_users"
    }
  ]
];

Api.editMessageText({
  chat_id: request.message.chat.id,
  message_id: request.message.message_id,
  text: msg,
  parse_mode: "HTML",
  reply_markup: { inline_keyboard: buttons }
});
