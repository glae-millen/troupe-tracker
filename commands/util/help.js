// help.js
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command
{
  constructor (client)
  {
    super(client,
    {
      name: 'help',
      group: 'util',
      memberName: 'help',
      aliases: ['wtf'],
      description: 'Lists and gives information about available commands.',
      examples: [`${client.commandPrefix}help`, `${client.commandPrefix}help track`],
    });
  }

  run (message)
  {
    // --DEBUG-- Induce a fake error
    //if (args == "h") return await this.client.handler.throw(this.client, message, args);

    // Initialize args and letiables
    const botAvatar = this.client.users.cache.get(process.env.BOT_ID).avatarURL(),
          args = message.content.slice(this.client.commandPrefix).trim().split(/ +/g)[1],
          hanabi = this.client.users.cache.get(process.env.OWNER_ID).tag,
          prefix = this.client.commandPrefix,
          embed = new MessageEmbed(),
          { commands } = this.client.registry,
          color = this.client.handler.colorize(this.client);

    try
    {
      let cmdHelp = false;
      commands.forEach(cmd =>
      {
        // Detect any commands specified
        if ((args == cmd.name || cmd.aliases.indexOf(args) != -1))
        {
          // Flag cmdHelp to indicate we want to display specific cmd info
          cmdHelp = true;

          // Add info to the embed
          embed
            .setTitle(`${prefix}${cmd.name}`)
            .setDescription(cmd.description ?? "N/A");

          let aliases = cmd.aliases.join(', '),
              examples = cmd.examples.join('\n');

          // Prevent embed errors from blank strings
          if (aliases == "")
            aliases = "N/A";
          if (examples == "")
            examples = "N/A";

          embed
            .addField(`Aliases:`, aliases)
            .addField(`Examples:`, examples);
          }
      });

      // No command was detected in the user input, display default help message
      if (!cmdHelp)
      {
        embed
          .setColor(`${color}`)
          .setTitle(`Fumi v${this.client.version}`)
          .setThumbnail(`${botAvatar}`)
          .setFooter(`Brought to you by ${hanabi}.`)
          .setDescription(`Fumi: Troupe progress tracking utility for Revue Starlight Re:LIVE players\n\n**Prefix: ${prefix}**`)
          .addField(`**Command List**`, `Below is a list of commands provided by this bot.`);

        commands.forEach(cmd =>
        {
          if(cmd.groupID != "admin" && cmd.groupID != "commands" && cmd.name != "eval")
            embed.addField(`${cmd.name}`, `${cmd.description}`);
        });
      }

      // Send the embed
      message.channel.send(embed).catch(console.error);
    }
    catch (err)
    {
      // Inform bot owner for error, send error log, and log it
      this.client.handler.throw(this.client, message, err);
    }
  }
}
