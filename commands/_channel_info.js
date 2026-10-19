/*CMD
  command: /channel_info
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

var chatId = params;
if (!chatId) return;

var title = Bot.getProperty("chat_title_" + chatId) || "Channel";

var leaves = Bot.getProperty("leave_count_" + chatId) || 0;
var bans = Bot.getProperty("ban_count_" + chatId) || 0;

// delete previous message (clean UI)
if (request.message) {
  Api.deleteMessage({
    chat_id: request.message.chat.id,
    message_id: request.message.message_id
  });
}

Api.answerCallbackQuery({
  callback_query_id: request.id
});

Api.sendMessage({
  chat_id: user.telegramid,
  text:
    "📊 <b>Your Channel Details</b>\n\n" +
    "<b>📢 Channel Name: </b><i>" + title + "</i>\n" +
    "🆔 <b>Channel Id: </b><code>" + chatId + "</code>\n\n" +
    "📉 Leaves: <code>" + leaves + "</code>\n" +
    "🚫 Kick/Removed: <code>" + bans + "</code>\n",
  parse_mode: "HTML",
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔙 Back", callback_data: "/mychannels" }],
      [{ text: "🏠 Home", callback_data: "/back" }]
    ]
  }
});
