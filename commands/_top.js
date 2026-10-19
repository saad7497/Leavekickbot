/*CMD
  command: /top
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

var list = Bot.getProperty("channels_list") || [];

if (list.length === 0) {
  Api.sendMessage({
    chat_id: user.telegramid,
    text: "❌ No channels/groups found"
  });
  return;
}

var data = [];

// collect data
for (var i = 0; i < list.length; i++) {
  var id = list[i];

  var leaves = Bot.getProperty("leave_count_" + id) || 0;
  var title = Bot.getProperty("chat_title_" + id) || "Channel";

  data.push({
    id: id,
    title: title,
    leaves: leaves
  });
}

// sort DESC (highest first)
data.sort(function(a, b) {
  return b.leaves - a.leaves;
});

// limit top 10
var text = "🏆 <b>Top Active Channels</b>\n\n";

for (var j = 0; j < data.length && j < 10; j++) {

  var item = data[j];

  text +=
    (j + 1) + ". 📢 <b>" + item.title + "</b>\n" +
    "🚪 Leaves: <code>" + item.leaves + "</code>\n\n";
}

Api.sendMessage({
  chat_id: user.telegramid,
  text: text,
  parse_mode: "HTML"
});
