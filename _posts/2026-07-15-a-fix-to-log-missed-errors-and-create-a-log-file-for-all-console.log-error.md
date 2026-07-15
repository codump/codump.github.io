---
title: "A fix to log missed errors and create a log file for all console.log/error"
description: |
  On Bot-Hosting.net people often miss errors in their console. Therefor this fix and with the bonus of it creating a log file for all console.log/error in their code.
author: kip
github_star:
github_gist: kipBO/5ca4ea4cac9ec23e08217d3652989be7
date: 26-07-15 14:40:00 +0200
categories: [Coding, Snippet]
tags: [Discord.js, JavaScript, Node.js, Bot]
pin: false
full_text: true
---
On Bot-Hosting.net people often miss errors in their console. Therefor this fix and with the bonus of it creating a log file for all console.log/error in their code.

```js
const fs = require("node:fs");
const path = require("node:path");

// Logging
const maxFileSize = 1 * 1024 * 1024; // 1 MB limit
const logFilePath = path.join(__dirname, "bot.log");
const backupFilePath = path.join(__dirname, "bot.log.old");
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York", // Change to your preferred time zone
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false, // Use false for 24-hour format, true for AM/PM
});
let logStream = fs.createWriteStream(logFilePath, { flags: "a" });
function checkLogSize() {
  try {
    if (fs.existsSync(logFilePath)) {
      const stats = fs.statSync(logFilePath);
      if (stats.size >= maxFileSize) {
        logStream.end();
        if (fs.existsSync(backupFilePath)) fs.unlinkSync(backupFilePath);
        fs.renameSync(logFilePath, backupFilePath);
        logStream = fs.createWriteStream(logFilePath, { flags: "a" });
      }
    }
  } catch (err) {
    process.stderr.write(`[LOG ROTATION ERROR] ${err.message}\n`);
  }
}
function formatLogArgs(message, args) {
  const allItems = [message, ...args];
  return allItems
    .map((item) => {
      if (item instanceof Error) {
        return item.stack;
      }
      if (typeof item === "object") {
        return JSON.stringify(item, null, 2);
      }
      return item;
    })
    .join(" ");
}
// Helper to find where console.log/error was called
function getCallerFile() {
  const logTrace = new Error();
  if (!logTrace.stack) return "unknown";
  const stackLines = logTrace.stack.split("\n");
  const callerLine = stackLines[3] || "";
  const match = callerLine.match(/\((.*)\)/) || callerLine.match(/at\s+(.*)/);
  return match ? path.basename(match[1]) : "unknown";
}
// Override console.log
console.log = function (message, ...args) {
  checkLogSize();
  const timestamp = timeFormatter.format(new Date());
  const traceInfo = getCallerFile();
  const content = formatLogArgs(message, args);
  const formattedMessage = `[${timestamp}] [INFO] [${traceInfo}]\n${content}\n`;
  logStream.write(formattedMessage);
  process.stdout.write(formattedMessage);
};
// Override console.error
console.error = function (message, ...args) {
  checkLogSize();
  const timestamp = timeFormatter.format(new Date());
  const traceInfo = getCallerFile();
  const content = formatLogArgs(message, args);
  const formattedMessage = `[${timestamp}] [ERROR] [${traceInfo}]\n${content}\n\n`;
  logStream.write(formattedMessage);
  process.stderr.write(formattedMessage);
};
// Catches regular synchronous or code-level runtime errors
process.on("uncaughtException", (error, origin) => {
  console.error(`[CRITICAL ERROR] Uncaught Exception at: ${origin}`);
  console.error(error.stack || error);
});
// Catches unhandled async/await promise rejections (very common if Discord APIs time out)
process.on("unhandledRejection", (reason, promise) => {
  console.error(`[CRITICAL ERROR] Unhandled Promise Rejection at:`, promise);
  console.error(`Reason:`, reason?.stack || reason);
});
```
