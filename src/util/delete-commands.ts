/* eslint-disable @typescript-eslint/no-var-requires */
// Will fix this later
const { REST, Routes } = require('discord.js');

const Config = require('../../config/config.json');

const token = Config.client.token;
const clientId = Config.client.id;

const rest = new REST({ version: '10' }).setToken(token);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);

export {};
