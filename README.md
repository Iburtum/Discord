# brt — Discord AI Assistant Bot

A bilingual (Arabic / English) Discord bot that answers questions about EliteMobs and the Minecraft server **mine.iburtum.dev**.

## Features

- 🤖 **AI Assistant** — Answers EliteMobs questions using GPT-4.1-mini via GitHub Models
- `/setup` — Configure a text channel where the bot auto-replies to every message
- `/ask` — Ask a question anywhere
- `/server` — Show the Minecraft server IP
- `/help` — List all commands
- 🌐 **Bilingual** — Arabic by default, English when the user writes in English

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Iburtum/Discord.git
   cd Discord
   npm install
   ```

2. **Create a `.env` file** (see `.env.example`)
   ```
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_application_client_id
   GH_MODELS_TOKEN=your_github_pat_with_models_read_permission
   ```

   > **Note:** Use a GitHub fine-grained PAT with the **Models (read)** permission.
   > Do **not** name this variable `GITHUB_TOKEN` — that name is reserved by GitHub Actions / Codespaces and would be silently overridden with a token that lacks Models access.

3. **Register slash commands**
   ```bash
   npm run deploy
   ```

4. **Start the bot**
   ```bash
   npm start
   ```

## Required Bot Permissions

- Send Messages
- Read Message History
- Use Slash Commands

## Required Gateway Intents

- Guilds
- Guild Messages
- Message Content (privileged — enable in the Discord Developer Portal)
