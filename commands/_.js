/*CMD
  command: *
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

if (!request) return;

if (typeof request === "string") {
  try {
    request = JSON.parse(request);
  } catch (e) {
    return;
  }
}

/* ================== ✅ CHANNEL/GROUP COUNT ================== */
var chatId =
  (request.message && request.message.chat.id) ||
  (request.channel_post && request.channel_post.chat.id);

var chatType =
  (request.message && request.message.chat.type) ||
  (request.channel_post && request.channel_post.chat.type);

if (chatId && chatType !== "private") {

  var key = "counted_" + chatId;

  if (!Bot.getProperty(key)) {

    Bot.setProperty(key, true, "boolean");

    var channels = Libs.ResourcesLib.anotherChatRes("channels", "global");
    channels.add(1);

    // ✅ SAVE CHAT TITLE
    var title =
      (request.message && request.message.chat.title) ||
      (request.channel_post && request.channel_post.chat.title) ||
      "Unknown";

    Bot.setProperty("chat_title_" + chatId, title, "string");

    // ✅ GLOBAL LIST ONLY (NO USER HERE)
    var globalList = Bot.getProperty("channels_list") || [];

    if (globalList.indexOf(chatId.toString()) === -1) {
      globalList.push(chatId.toString());
      Bot.setProperty("channels_list", globalList, "json");
    }
  }
}

/* ================== JOIN REQUEST HANDLE ================== */
if (!request) return;

if (typeof request === "string") {
  try {
    request = JSON.parse(request);
  } catch (e) {
    return;
  }
}

let info = request.chat_join_request;

if (info) {
  let userinfo =
  "[" + info.from.first_name + "]" + "(" + "tg://user?id=" + info.from.id + ")"
  Api.sendMessage({
    chat_id: info.from.id,
    text: "*👋 Hey Welcome To The Bot*\n\n" +
    "*🔥 I'm @LeaveKickerBot,* _Channel protection bot ⚡️_\n\n" +
    "*😎 How it works:*\n" +
    "1. Add Me To Your Channel With Admin Permission\n" +
    "2. I will Automatically Protect Your Channel",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "❤️‍🔥 Start Me",
            url: "https://t.me/LeaveKickerBot?start=start",
           style: "success"
          }
        ],
        [
          {
            text: "➕ Add Your Channel",
            url: "https://t.me/LeaveKickerBot?startchannel=true&admin=post_messages+delete_messages+edit_messages+restrict_members+invite_users",
            style: "success"
          }
        ],
          [
{ text: "Join ✅", url: "https://t.me/pantherxsaad" },
        { text: "Join ✅", url: "https://t.me/+HdI0vVOk60RmMTE9" }
        ], 
      ]
    },
    parse_mode: "Markdown" // Add this line for parsing
  });
  
  Api.approveChatJoinRequest({
    chat_id: info.chat.id,
  });
}

/* ================== ADMIN + BOT ADDED ================== */
if (request.my_chat_member) {

  var data = request.my_chat_member;
  var chat = data.chat;

  var chatId = chat.id;
  var newStatus = data.new_chat_member.status;
  var adminId = data.from.id;

  var chatTitle = chat.title || "Unknown";
  var chatType = chat.type || "group";

  if (newStatus === "administrator") {

    Bot.setProperty("admin_of_" + chatId, adminId, "integer");

    // ✅ SAVE CHAT TITLE
    Bot.setProperty("chat_title_" + chatId, chatTitle, "string");

    // ✅ GLOBAL LIST
    var globalList = Bot.getProperty("channels_list") || [];

    if (globalList.indexOf(chatId.toString()) === -1) {
      globalList.push(chatId.toString());
      Bot.setProperty("channels_list", globalList, "json");
    }

    // ✅ USER-SPECIFIC LIST (CORRECT PLACE)
    var userChannels = Bot.getProperty("user_channels_" + adminId) || [];

    if (userChannels.indexOf(chatId.toString()) === -1) {
      userChannels.push(chatId.toString());
      Bot.setProperty("user_channels_" + adminId, userChannels, "json");
    }

    Api.sendMessage({
      chat_id: adminId,
      text:
        "✅ <b>Bot added as admin</b>\n\n" +
        "<b>🔥 Type:</b> " + (chatType === "channel" ? "Channel" : "Group") + "\n" +
        "<b>🏷️ Title:</b> " + chatTitle + "\n" +
        "<b>🆔 ID:</b> <code>" + chatId + "</code>",
      parse_mode: "HTML"
    });
  }
}

/* ================== AUTO KICKER ================== */
if (request.chat_member) {

  var data = request.chat_member;
  if (!data.new_chat_member) return;

  var chatId = data.chat.id;
  var user = data.new_chat_member.user;
  var status = data.new_chat_member.status;

  var kickedId = user.id;
  var kickedName = user.first_name || "No name";

  Bot.setProperty("chat_title_" + chatId, data.chat.title, "string");

  if (status === "left") {

    var leaves = Bot.getProperty("leave_count_" + chatId) || 0;
    leaves++;
    Bot.setProperty("leave_count_" + chatId, leaves, "integer");

    if (Bot.getProperty("just_unbanned_" + kickedId)) {
      Bot.setProperty("just_unbanned_" + kickedId, false, "boolean");
      return;
    }

    Api.banChatMember({
      chat_id: chatId,
      user_id: kickedId
    });

    var banCount = Bot.getProperty("ban_count_" + chatId) || 0;
    banCount++;
    Bot.setProperty("ban_count_" + chatId, banCount, "integer");

    var adminId = Bot.getProperty("admin_of_" + chatId);

    if (adminId) {

      var chatTitle = data.chat.title || "Unknown";

      var mention =
        "<a href='tg://user?id=" + kickedId + "'>" +
        kickedName +
        "</a>";

      var msg =
        "🚫 <b>User Left & Kicked:</b>\n\n" +
        "👤 User: " + mention + "\n" +
        "🆔 ID: <code>" + kickedId + "</code>\n" +
        "📢 Channel: <b>" + chatTitle + "</b>";

      Api.sendMessage({
        chat_id: adminId,
        text: msg,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Unban",
                callback_data: "/unban " + chatId + "_" + kickedId
              }
            ]
          ]
        }
      });
    }
  }
}
