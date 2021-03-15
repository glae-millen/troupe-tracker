// Version tracking
const version = "0.0.4";

// Initialize environment variables
require('dotenv').config();

// Initialize dependencies
const Discord = require('discord.js');
const { CommandoClient } = require('discord.js-commando');
const { DateTime, Settings } = require('luxon');

const path = require('path');
const fs = require('fs');
const Enmap = require('enmap');

const handler = require('./resources/handler.js');
const aliases = require('./resources/aliases.json');

// Initialize the Commando client
const client = new CommandoClient(
{
	commandPrefix: process.env.PREFIX ?? 'f.',
	owner: process.env.OWNER_ID,
  disableMentions: 'everyone',
});

// Initialize timezone
Settings.defaultZoneName = "utc+9";

// Bind dependencies to client for sub-unit usage
client.Discord = Discord;
client.fs = fs;
client.DateTime = DateTime;

client.handler = handler;
client.aliases = aliases;
client.version = version;

// Initialize events
fs.readdir("./events/", (err, files) =>
{
	if (err) return console.error(err);
	files.forEach(file =>
  {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

// Initialize commands
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'Owner-only commands'],
        ['main', 'Main bot commands'],
        ['util', 'Utility commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
				help: false,
        ping: false,
				prefix: false,
        unknownCommand: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

// Finally login
client.login(process.env.BOT_TOKEN);
