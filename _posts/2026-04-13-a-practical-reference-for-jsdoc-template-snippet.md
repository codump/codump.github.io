---
title: "A practical reference for JSDoc: template snippet"
description: |
  For codump projects, I use this JSDoc standard to ensure our JavaScript codebase remains highly maintainable and easy to navigate. By consistently documenting types, optional parameters, and asynchronous operations with instant IntelliSense support and clear API expectations within the editor. This structured approach serves as a lightweight alternative to TypeScript, allowing to maintain high code quality and generate professional documentation automatically without adding extra complexity to the build process.
author: kip
github_star:
github_gist: kipBO/48e2df28b8031feb2118ff9b8227f5b5
date: 26-03-13 20:27:00 +0200
categories: [Coding, Snippet]
tags: [JSDoc, JavaScript, Node.js]
pin: false
full_text: true
---
For codump projects, I want to use the JSDoc standard to ensure our JavaScript codebase remains highly maintainable and easy to navigate. By consistently documenting types, optional parameters, and asynchronous operations with instant IntelliSense support and clear API expectations within the editor.

This structured approach serves as a lightweight alternative to TypeScript, allowing to maintain high code quality and generate professional documentation automatically without adding extra complexity to the build process. `ConLog()` is the prime example!

```js
/**
 * @file JSDoc examples
 * This file demonstrates various ways to document JavaScript functions using JSDoc
 */

// 1. Basic types and descriptions
/**
 * Simple greeting function
 * @param {string} name - The name of the person to greet
 * @returns {string} - The complete greeting string
 */
function sayHello(name) {
  return `Hello, ${name}!`
}

// 2. Multiple types (union) and optional parameters
/**
 * Logs a message with an optional numerical ID or string tag
 * @param {string} message - The main text to log
 * @param {string | number} [identifier] - (optional) can be a userId (number) or a tag (string)
 */
function logMessage(message, identifier) {
  console.log(`[${identifier || 'INFO'}] ${message}`)
}

// 3. Default values
/**
 * Calculates a price with tax
 * @param {number} amount - The base price
 * @param {number} [taxRate=0.21] - The tax rate (defaults to 21% or 0.21)
 * @returns {number} - The total price
 */
function calculateTotal(amount, taxRate = 0.21) {
  return amount * (1 + taxRate)
}

// 4. Arrays and specific objects
/**
 * Processes a list of users
 * @param {string[]} tags - An array of strings representing categories
 * @param {Object} user - The user data object
 * @param {string} user.username - The unique username
 * @param {number} user.age - The age of the user
 * @param {boolean} [user.isAdmin] - Optional flag for admin status
 */
function processUser(tags, user) {
  console.log(`${user.username} is ${user.age} years old and tagged as ${tags.join(', ')}`)
}

// 5. Custom types (typedef) - best for re-using structures
/**
 * @typedef {Object} WebhookConfig
 * @property {string} url - The destination URL
 * @property {number} timeout - Request timeout in milliseconds
 * @property {boolean} retryOnError - Whether to retry on failure
 */

/**
 * Connects to a service using a configuration object
 * @param {WebhookConfig} config - The configuration for the webhook
 */
function setupWebhook(config) {
  console.log(`Connecting to ${config.url}...`)
}

// 6. Promises and async 
/**
 * Simulates an API call
 * @async
 * @param {number} id - The ID to fetch
 * @returns {Promise<Object>} Returns a promise that resolves to a data object
 * @throws {Error} Throws an error if the ID is negative
 */
async function fetchData(id) {
  if (id < 0) throw new Error("Invalid ID")
  return { id, status: "success" }
}

// 7. Callbacks
/**
 * Executes a function after a delay
 * @param {number} ms - Milliseconds to wait
 * @param {function(string): void} callback - A function that receives a status string
 */
function waitAndDo(ms, callback) {
    setTimeout(() => {
      callback("Finished waiting")
    }, ms)
}
```
