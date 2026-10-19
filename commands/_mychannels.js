/*CMD
  command: /mychannels
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

var userId = user.telegramid || (request.from && request.from.id);

// ✅ DELETE MESSAGE (works for both message + callback)
if (request.message) {
  Api.deleteMessage({
    chat_id: request.message.chat.id,
    message_id: request.message.message_id
  });
}

if (request.callback_query) {
  Api.deleteMessage({
    chat_id: request.callback_query.message.chat.id,
    message_id: request.callback_query.message.message_id
  });
}

// ✅ GET USER CHANNELS
var list = Bot.getProperty("user_channels_" + userId) || [];

if (list.length === 0) {
  Api.sendMessage({
    chat_id: userId,
    text: "❌ <b>No Channels or Groups Found</b>",
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔙 Back", callback_data: "/back" }]
      ]
    }
  });
  return;
}

// ✅ BUILD BUTTONS
var buttons = [];

for (var i = 0; i < list.length; i++) {
  var id = list[i];
  var title = Bot.getProperty("chat_title_" + id) || "Channel";

  buttons.push([
    {
      text: "📢 " + title,
      callback_data: "/channel_info " + id
    }
  ]);
}

// ✅ BACK BUTTON
buttons.push([
  { text: "🔙 Back", callback_data: "/back" }
]);

// ✅ SEND MESSAGE
Api.sendMessage({
  chat_id: userId,
  text: "📊 <b>Your Connected Channels & Groups</b>\n\nSelect one to view details:",
  parse_mode: "HTML",
  reply_markup: {
    inline_keyboard: buttons
  }
});
