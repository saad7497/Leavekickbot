/*CMD
  command: /unban
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

if (!params) return;

let parts = params.split("_");
if (parts.length < 2) return;

let chatId = parts[0];
let userId = parts[1];

/* ================== UNBAN USER ================== */
Api.unbanChatMember({
  chat_id: chatId,
  user_id: userId
});

/* ================== MARK FLAG ================== */
Bot.setProperty("just_unbanned_" + userId, true, "boolean");

/* ================== GET CHANNEL NAME ================== */
var chatTitle = Bot.getProperty("chat_title_" + chatId) || "Channel";

/* ================== USER MENTION ================== */
var mention = "<a href='tg://user?id=" + userId + "'>User</a>";

/* ================== EDIT MESSAGE (REMOVE BUTTON) ================== */
if (request.message) {
  Api.editMessageText({
    chat_id: request.message.chat.id,
    message_id: request.message.message_id,
    text:
      "✅ <b>User Unbanned</b>\n\n" +
      "👤 <b>User:</b> " + mention + "\n" +
      "📢 <b>Channel:</b> <b>" + chatTitle + "</b>",
    parse_mode: "HTML"
  });
}

/* ================== NOTIFY USER ================== */
Api.sendMessage({
  chat_id: userId,
  text:
    "🎉 You have been unbanned from <b>" + chatTitle + "</b>",
  parse_mode: "HTML"
});
