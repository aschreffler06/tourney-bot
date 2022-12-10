const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

const Config = require('../../config/config.json');

const clientId = Config.client.id;
const token = Config.client.token;

const commands = [];
const commandsPath = path.join(__dirname, '..', 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(path.join(commandsPath, folder))
        .filter((file: string) => file.endsWith('.js'));

    for (const file of commandFiles) {
        console.log(`Currently on: ${file}`)
        const filePath = path.join(commandsPath, folder, file);
        const command = require(filePath);
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then((data: string) =>
        console.log(
            `Successfully registered ${data.length} application commands.`
        )
    )
    .catch(console.error);

export {};
