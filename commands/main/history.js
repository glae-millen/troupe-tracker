const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command
{
  constructor (client)
  {
    super(client,
      {
        name: 'history',
        group: 'main',
        memberName: 'history',
        aliases: ['h','hist'],
        description: 'Retrieves available tracking history.',
        examples: []
      });
  }

  async run (message)
  {
    try
    {
      // Initialize args
      const args = message.content.slice(this.client.commandPrefix.length).trim().split(/ +/g);
      args.shift();

    }
    catch (err)
    {
        // Inform bot owner for error, send error log, and log it
        this.client.handler.throw(this.client, message, err);
    }
  }
}
