// index.js
// Initialize dependencies
const Discord = require("discord.js");
const { CommandoClient } = require('discord.js-commando');

const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const dotenv = require('dotenv');

const handler = require("./handler.js");

// Initialize .env
dotenv.config();

// Initialize the Commando client
const client = new CommandoClient(
{
	commandPrefix: `f.`,
	owner: process.env.OWNER_ID,
  disableEveryone: true,
});

// Bind dependencies to client for sub-unit usage
client.Discord = Discord;

client.fs = fs;

client.handler = handler;

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
        ping: false,
        help: false,
        unknownCommand: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

// Finally login
client.login(process.env.BOT_TOKEN);
