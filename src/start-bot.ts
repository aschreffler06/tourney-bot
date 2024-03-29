import fs from 'node:fs';
import path from 'node:path';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import connectDB from '../config/db.js';
import ExtendedClient from './types/ExtendedClient.js';

import Config from '../config/config.json';

connectDB();

const token = Config.client.token;
// Create a new client instance
const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });

// Command Handling
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(path.join(commandsPath, folder))
        .filter((file: string) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, folder, file);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(filePath);
        client.commands.set(command.data.name, command);
    }
}

// Event Handling
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args: any) => event.execute(...args));
    } else {
        client.on(event.name, (...args: any) => event.execute(...args));
    }
}

// Login to Discord with your client's token
client.login(token);
