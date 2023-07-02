#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import "dotenv/config.js";

import { Contact, Message, ScanStatus, WechatyBuilder, log } from "wechaty";

import qrcodeTerminal from "qrcode-terminal";
import { translate } from "./chat";

// log.level("silly");
// log.level("silent");

function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      "https://wechaty.js.org/qrcode/",
      encodeURIComponent(qrcode),
    ].join("");
    log.info(
      "StarterBot",
      "onScan: %s(%s) - %s",
      ScanStatus[status],
      status,
      qrcodeImageUrl
    );

    qrcodeTerminal.generate(qrcode, { small: true }); // show qrcode on console
  } else {
    log.info("StarterBot", "onScan: %s(%s)", ScanStatus[status], status);
  }
}

function onLogin(user: Contact) {
  log.info("StarterBot", "%s login", user);
}

function onLogout(user: Contact) {
  log.info("StarterBot", "%s logout", user);
}

async function onMessage(msg: Message) {
  log.info("StarterBot", msg.toString());

  if (msg.text() === "ding") {
    await msg.say("dong");
  }
  if (msg.text().startsWith(":t ")) {
    const text = msg.text().slice(3);
    try {
      const parts = await translate(text);
      await msg.say(parts.join("\n"));
    } catch (error: any) {
      const errorMessage = error.message || error;
      await msg.say(errorMessage);
    }
  }
}

const bot = WechatyBuilder.build({
  name: "ding-dong-bot",
  puppet: "wechaty-puppet-padlocal",
  puppetOptions: {
    // http://pad-local.com/#/tokens
    token: "puppet_padlocal_bf7f60c92b0c48119d0b4a1cf2a40023",
    // token: 'bf7f60c92b0c48119d0b4a1cf2a40023',
  },
  /* puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    uos: true,  // 开启uos协议
  }, */
});

bot.on("scan", onScan);
bot.on("login", onLogin);
bot.on("logout", onLogout);
bot.on("message", onMessage);

bot
  .start()
  .then(() => log.info("StarterBot", "Starter Bot Started."))
  .catch((e) => log.error("StarterBot", e));
