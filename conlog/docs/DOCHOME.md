# What is it!?

**ConLog()** provides a customized console logging utility for Node.js and browsers console.
Instead of relying only on `console.log`, `console.error`, etc., it adds a **configurable, global logging system** with colored outputs, structured types, and some convenience features like webhook notifications.

## The main idea
- Centralize logging configuration (enable/disable globally).
- Support multiple log types (ok, error, warning, object).
- Provide a clean developer experience `ConLog("message", "ok")`.
- Extendable for structured output (like objects).

It's essentially a **drop-in utility for better console output formatting and logging control.**

## Pros of using ConLog()
### 1. Simplified Developer Experience
- Instead of remembering multiple console.* methods, you use `ConLog(text, type)`.
- Types can be numbers or string aliases, so devs can write `ConLog("done", 2)` or `ConLog("done", "ok")`.
- For library authors it's a clean way to provide optional logging.
- For apps it's a simplifies log readability without the overhead of big loggers.


### 2. Global Control
- Logging can be toggled globally `ConLogInit(true/false)`.
- Very handy for libraries where you don't want to flood production logs.

### 3. Extensible System
- Because log types are mapped in one place, it's easy to add new log categories (like debug, info, etc.).

### 4. JSDoc Support
- Functions are documented with JSDoc, giving IntelliSense hints in editors like VSCode (even without TypeScript).

### 5. Lightweight
- Pure JavaScript, no external dependencies.
- Works in any Node.js and JavaScript environment with zero setup.

### 6. Remote Real-Time Monitoring
- Logs are no longer trapped in your local terminal.
- Critical errors and system updates are pushed to your mobile or desktop in real-time via Discord.
- Enables 24/7 monitoring of your applications from anywhere in the world.
- Provides instant visibility into production issues without needing direct terminal access.
- Creates a shared, searchable log history for teams within a dedicated Discord channel.
<br><br><br>
# Getting started

### Node.js terminal
Install by running `npm i @codump/conlog` after that you can start using ConLog. For the complete documentation and how to apply settings check the Globals menu on the left or the [detailed example](#detailed-example) below.
```js
const { ConLog } = require(`@codump/conlog`)

ConLog(`Something went wrong.`, 1);
```

### Browsers console
`ConLog()` works in both back- and frontend. We can use the ESM>CDN to import it to the front with zero install needed! Browser needs to support ES6.
```js
// script.js
import { ConLog } from `https://esm.sh/@codump/conlog`

ConLog(`It's the same as in the backend, all details are below.`, 2);
```
Make sure the script where you are importing it has the module type.

```html
<script type='module' src='script.js'></script>
```
<br>

# Detailed example
```js
/**
 * ConLog - Console log management and utility tool
 * 
 * In the repo example.js is set with require(`./lib/`) but copy paste the code below
 * when you use it after a `npm install @codump/conlog`
 */
const { ConLogInit, ConLogSet, ConLogWebhook, ConLog, ConLogStartMsg } = require(`@codump/conlog`)

// ================================
// INITIALIZATION
// ================================

/**
 * Initialize ConLog with global enable/disable setting
 * 
 * @param {boolean} status - Master switch for all console logging
 *   - true: Enable all ConLog output (default)
 *   - false: Completely disable all ConLog output
 *   - Every ConLog after ConLogInit(false) stops working
 */
ConLogInit(true)

// ================================
// CONFIGURATION
// ================================

/**
 * Configure which log types are displayed
 * All parameters default to true, so you only need to specify false values
 * 
 * @param {boolean} error - Display error messages (type 1)
 * @param {boolean} ok - Display success/OK messages (type 2)  
 * @param {boolean} warning - Display warning messages (type 3)
 * @param {boolean} object - Display object dumps (type 4)
 * @param {boolean} color - Enable colored console output
 * 
 */
ConLogSet({error: true, ok: true, warning: true, object: true, color: true})

/**
 * Display startup message showing current ConLog settings
 * Useful for debugging or confirming ConLog is properly initialized
 * 
 * @param {boolean} status - Whether to display startup message (default: false)
 */
ConLogStartMsg(true)

/**
 * Webhooks are now supported to send your critical logs to your preffered platform.
 * 
 * @param {boolean} status - Enable or disable webhook logging
 *   - true: Enable all ConLog output to the specified webhook URL
 *   - false: Completely disable all ConLog output to webhooks (default)
 * @param {string} provider - The webhook provider (e.g., "discord")
 * @param {string} url - The webhook URL to send messages to
 * 
 * Supported hook providers: only discord for now, but let us know if you want another one to be added.
 * It configures automatically to your `ConLogSet()` settings.
 * To overwrite and send a hook even when ConLogInit is turned off.
 * Have `ConLogWebhook()` set and `force-hook` in your message.
 */
ConLogWebhook(true, `discord`, `https://discord.com/api/webhooks/your-hook`)
ConLog(`force-hook This message will be send to your discord webhook.`)

// ================================
// LOGGING EXAMPLES
// ================================

/**
 * Main logging function - ConLog(text, type)
 * 
 * TYPE OPTIONS:
 * - Error:   1, `er`, `err`, `error`
 * - Success: 2, `ok` 
 * - Warning: 3, `wa`, `war`, `warn`, `warning`
 * - Object:  4, `so`, `ob`, `obj`, `object`, `showobject`
 *   - Gives a stringify to the output. Don't set any type if you want to log the raw object. 
 * 
 * USAGE:
 * - ConLog(text, type) - Typed logging with formatting
 * - ConLog(text) - Simple logging without type (always displayed unless ConLogInit is false)
 */

// Sample data for object logging
const nestedData = [{ nestedObj: `inside nested structure` }]
const complexObject = [{ 
    test: `valid test data`, 
    nested: nestedData,
    timestamp: new Date().toISOString()
}];

// Error logging - displayed in red
ConLog(`Example... Database connection failed.`, 1)
ConLog(`Example... Invalid user credentials provided.`, `error`)

// Success logging - displayed in green
ConLog(`Example... User successfully authenticated.`, 2)
ConLog(`Example... File upload completed.`,`ok`)

// Warning logging - displayed in yellow with warning icon
ConLog(`Example... API rate limit approaching.`, 3)
ConLog(`Example... Deprecated function usage detected.`, `warning`)

// Object logging - formatted JSON display
ConLog(complexObject, 4)
ConLog({ userId: 123, status: `active`, permissions: [`read`, `write`] }, `object`)

// Simple logging - no special formatting, always displayed (unless ConLogInit is false)
ConLog(`Example... Processing user request...`)
```