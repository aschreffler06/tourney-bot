import { Client, Collection } from 'discord.js';

class ExtendedClient extends Client {
    public commands = new Collection();
}

export default ExtendedClient;
