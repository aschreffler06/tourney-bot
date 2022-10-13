const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv')

dotenv.config({ path: '../config/.env' })

const token = process.env.DISCORD_TOKEN
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID

const rest = new REST({ version: '10' }).setToken(token);

// This is for flexibility between running this file in the main src directory (also for scripts) and if you just run it in the util folder
if (cwd().split('\\').at(-1) == 'src') {
	chdir('util')
	console.log(cwd())
}

// for guild-based commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);