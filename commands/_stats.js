/*CMD
  command: /stats
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

var users = Libs.ResourcesLib.anotherChatRes("status", "global").value() || 0;
var channels = Libs.ResourcesLib.anotherChatRes("channels", "global").value() || 0;

Api.sendPhoto({
  chat_id: user.telegramid,
  photo: "https://t.me/roughuploderbeta7181/96",
  caption:
    "📊 <b>Live Bot Statistics</b>\n\n" +
    "👥 <b>Total Users:</b> <code>" + users + "</code>\n" +
    "📢 <b>Total Channels:</b> <code>" + channels + "</code>\n\n" +
    "⚡ <i>Real-time analytics powered by @" + bot.name + "</i>",
  parse_mode: "HTML"
});
