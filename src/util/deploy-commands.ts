const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
const { REST, Routes } = require('discord.js');
const { cwd } = require('node:process');

dotenv.config({ path: './src/config/.env' });

const clientId = process.env.CLIENT_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [];
const commandsPath = path.join(cwd(), 'src', 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: string) => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
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
