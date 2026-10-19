/*CMD
  command: /back
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

var msg =
"<b>👋 Hey</b> " + user.first_name + " <b>Welcome Again!</b>\n\n" +
"<b>🔥 I'm @LeaveKickerBot</b>, <i>Ready to manage and protect your channel ⚡️</i>\n\n" +
"<b>😎 How it works:</b>\n" +
"<i>1. Add me to your channel with admin permission\n" +
"2. Sit back — I will handle leave/kick actions automatically</i>\n\n" +
"<b>😁 Why Choose Me?</b>\n" +
"<blockquote expandable>" +
"• ⚡ Super Fast Processing\n" +
"• 🛠 No setup required\n" +
"• 🤖 Fully automated protection system" +
"</blockquote>";

var keyboard = {
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
      }
    ]
  ]
};

Api.editMessageText({
  chat_id: request.message.chat.id,
  message_id: request.message.message_id,
  text: msg,
  parse_mode: "HTML",
  reply_markup: keyboard
});
