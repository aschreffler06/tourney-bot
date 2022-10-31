const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const connectDB = require('../config/db.js');
// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Load config
dotenv.config({ path: './config/.env' });

connectDB();

const token = process.env.DISCORD_TOKEN;
console.log(token);
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command Handling
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
}

// Event Handling
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file: string) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args: any) => event.execute(...args));
    } else {
        client.on(event.name, (...args: any) => event.execute(...args));
    }
}

// Login to Discord with your client's token
client.login(token);