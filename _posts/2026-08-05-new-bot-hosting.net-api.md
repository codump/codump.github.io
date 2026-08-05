---
title: "The new bot-hosting.net API is live"
description: |
  Something people might have missed is the new API for bot-hosting.net is live. Therefor I made this slash command just like for the previous API. Enjoy the new goodies you all!
author: kip
github_star:
github_gist: kipBO/58545334b7e5906454e92a0d96455731
date: 26-08-05 17:30:00 +0200
categories: [Coding, Snippet]
tags: [Discord.js, JavaScript, Node.js, Bot, Bot-Hosting.net]
pin: false
full_text: true
---
Something people might have missed is the new API for bot-hosting.net is live. Therefor I made this slash command just like for the previous API. Enjoy the new goodies you all!

```js
const {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
} = require("discord.js");
// Or handle the botDeployId and botServerApiKey in your own way. They API key for this example needs deployments:read and deployments:power scopes.
const { botDeployId, botServerApiKey } = require("../../../config.json"); 
// Full options see: https://bot-hosting.net/developer

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botserver")
    .setDescription("Options for you bot server API.")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Select action to perform.")
        .setRequired(true)
        .addChoices(
          { name: "Info", value: "info" },
          { name: "Start", value: "start" },
          { name: "Restart", value: "restart" },
          { name: "Stop", value: "stop" },
          { name: "Kill", value: "kill" },
        ),
    )
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .setContexts([InteractionContextType.Guild])
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const action = interaction.options.getString("action");

    // info
    if (action == "info") {
      const resp = await fetch(
        `https://bot-hosting.net/api/v1/deployments/${botDeployId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${botServerApiKey}` },
        },
      );
      const data = await resp.json();
      const sent = await interaction.reply({
        content: `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``,
        withResponse: true,
        flags: MessageFlags.Ephemeral,
      });
    }
    //info
    // start / restart / stop
    if (
      action == "start" ||
      action == "restart" ||
      action == "stop" ||
      action == "kill"
    ) {
      const resp = await fetch(
        `https://bot-hosting.net/api/v1/deployments/${botDeployId}/power`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${botServerApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: action }),
        },
      );
      const data = await resp.json();
      const sent = await interaction.reply({
        content: `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``,
        withResponse: true,
        flags: MessageFlags.Ephemeral,
      });
    }
    // start / restart / stop
  },
};
```
