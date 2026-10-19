/*CMD
  command: /export
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

// Command: /export
// Create ONE command named /export. Answer and Keyboard empty, Wait for answer OFF, no Auto Retry.
//
// Usage (send these to your bot, in order):
//   /export start      -> collects every chat/user record into a List (runs in background)
//   /export read 1     -> prints page 1 of the collected records as JSON lines (then 2, 3, ...)
//   /export bot        -> prints your bot-level properties as JSON
//
// Copy the printed text into files:  users.jsonl  and  bot_properties.json

// ---------- EDIT THIS SECTION ----------
const ADMIN_TELEGRAM_ID = "7159851540";            // your own Telegram user ID
const CHAT_PREFIXES = ["chat_title_", "leave_count_", "ban_count_"]; // read as prefix + Telegram chat ID
const USER_PROPS = ["status"];                                // User.setProp names to export
const USER_RESOURCES = [];                                    // ResLib names, e.g. ["energy"]
const BOT_PROPS = ["status", "channels"];                     // Bot.setProp names to export
const PER_PAGE = 20;
// ---------------------------------------

function isAdmin() {
  return !!user && String(user.telegramid) === ADMIN_TELEGRAM_ID;
}

function sendChunked(text) {
  for (var i = 0; i < text.length; i += 3500) {
    Bot.sendMessage(text.slice(i, i + 3500), { parse_mode: null });
  }
}

function collectRecord() {
  if (!chat) { return; }
  var rec = {
    chat: { id: chat.id, chatid: chat.chatid, type: chat.chat_type, title: chat.title || null },
    user: null,
    chat_props: {},
    user_props: {},
    user_resources: {}
  };
  CHAT_PREFIXES.forEach(function (p) {
    var name = p + chat.chatid;
    var v = Bot.getProp(name, null);
    if (v !== null && v !== undefined) { rec.chat_props[name] = v; }
  });
  if (user) {
    rec.user = {
      id: user.id,
      telegramid: user.telegramid,
      username: user.username || null,
      first_name: user.first_name || null,
      last_name: user.last_name || null
    };
    USER_PROPS.forEach(function (n) {
      var v = User.getProp(n, null);
      if (v !== null && v !== undefined) { rec.user_props[n] = v; }
    });
    USER_RESOURCES.forEach(function (n) {
      rec.user_resources[n] = ResLib.userRes(n).value();
    });
  }
  Bot.setProp({
    name: "export:" + chat.id,
    value: rec,
    type: "json",
    list: "export_users"
  });
}

// 1) Called by Bot.runAll once for every eligible chat
if (options && options.task) {
  collectRecord();
  return;
}

// 2) Called once after the runAll task is created
if (options && options.run_all_task) {
  if (isAdmin()) {
    Bot.sendMessage(
      "Collecting started (task " + options.run_all_task.id + "). " +
      "When it shows finished in Broadcasts, send: /export read 1",
      { parse_mode: null }
    );
  }
  return;
}

// 3) Everything below is admin only
if (!isAdmin()) { return; }

var args = (params || "").trim().split(/\s+/);
var action = (args[0] || "").toLowerCase();

if (action === "start") {
  var l = new List({ name: "export_users" });
  if (!l.exist) { l.create(); }
  Bot.runAll({
    command: "/export",
    for_chats: "all",
    on_create: "/export"
  });
  return;
}

if (action === "read") {
  var page = parseInt(args[1], 10);
  if (!(page >= 1)) { page = 1; }
  var list = new List({ name: "export_users" });
  if (!list.exist) { Bot.sendMessage("Run /export start first."); return; }
  list.page = page;
  list.per_page = PER_PAGE;
  var rows = list.get();
  if (!rows.length) { Bot.sendMessage("No records on page " + page + "."); return; }
  var chunk = "";
  rows.forEach(function (row) {
    var line = JSON.stringify(row.value);
    if (chunk.length + line.length + 1 > 3500) {
      Bot.sendMessage(chunk, { parse_mode: null });
      chunk = "";
    }
    chunk += line + "\n";
  });
  if (chunk) { Bot.sendMessage(chunk, { parse_mode: null }); }
  Bot.sendMessage(
    "Page " + page + " (" + rows.length + " records). " +
    (rows.length === PER_PAGE ? "Next: /export read " + (page + 1) : "Last page."),
    { parse_mode: null }
  );
  return;
}

if (action === "bot") {
  var out = {};
  BOT_PROPS.forEach(function (n) {
    var v = Bot.getProp(n, null);
    if (v !== null && v !== undefined) { out[n] = v; }
  });
  sendChunked(JSON.stringify(out, null, 1));
  return;
}

Bot.sendMessage("Use: /export start, /export read 1, or /export bot", { parse_mode: null });
