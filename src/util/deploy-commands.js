const fs = require('node:fs')
const path = require('node:path')
const dotenv = require('dotenv')
const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const { chdir, cwd } = require('node:process');

// This is for flexibility between running this file in the main src directory (also for scripts) and if you just run it in the util folder
if (cwd().split('\\').at(-1) == 'src') {
	chdir('util')
	console.log(cwd())
}

dotenv.config({ path: '../config/.env' })

const clientId =  process.env.CLIENT_ID
const token = process.env.DISCORD_TOKEN

const commands = []
const commandsPath = path.join('..', 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);