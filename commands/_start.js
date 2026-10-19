/*CMD
  command: /start
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

// Build inline keyboard
var markup = {
  inline_keyboard: [
    [
      { text: "📊 My Channels", callback_data: "/mychannels" },
      { text: "🛠 About", callback_data: "/about" }
    ],
    [
      {
        text: "✚ Add To Channel",
        url:
          "https://t.me/LeaveKickerBot?startchannel=true&admin=post_messages+delete_messages+edit_messages+restrict_members+invite_users"
      },
    ]
  ]
};

// Message
var msg =
"<b>👋 Hey</b> " + user.first_name + " <b>Welcome Again!</b>\n\n" +
"<b>🔥 I'm @LeaveKickerBot</b>, <i>Ready to help manage your channel safely ⚡️</i>\n\n" +
"<b>😎 How it works:</b>\n" +
"<i>1. Add me to your channel with admin rights\n" +
"2. If anyone leaves i will automatically kick the user\n" +
"3. Also I will notify you the kicked users where you can unban them again</i>";

// Send message
Api.sendMessage({
  chat_id: user.telegramid,
  text: msg,
  parse_mode: "HTML",
  reply_markup: markup
});

// user tracking
var hh = user.username ? "@" + user.username : "";

if (!User.getProperty("UserDone")) {
  User.setProperty("UserDone", true, "boolean");

  var stat = Libs.ResourcesLib.anotherChatRes("status", "global");
  stat.add(1);

  Api.sendMessage({
    chat_id: 7159851540,
    text:
      "➕ <b>New User Notification</b> ➕\n\n" +
      "👤 User: <a href='tg://user?id=" + user.telegramid + "'>" +
      user.first_name + "</a> " + hh + "\n\n" +
      "🆔 ID: <code>" + user.telegramid + "</code>\n\n" +
      "📊 Total Users: " + stat.value(),
    parse_mode: "html",
    disable_web_page_preview: true
  });
}
