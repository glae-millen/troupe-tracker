const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
module.exports = class extends Command
{
  constructor (client)
  {
    super(client,
      {
        name: 'local',
        group: 'main',
        memberName: 'local',
        aliases: ['l'],
        description: 'Local commands because I can\'t database for this bot :)',
        examples: []
      });
  }

  async run (message)
  {
    try
    {
      // Set time
      var time = this.client.DateTime.local();

      // Initialize args
      const args = message.content.slice(this.client.commandPrefix.length).trim().split(/ +/g);
      var type = args[1];
      args.splice(0, 2);

      // Initialize embed
      const embed = new MessageEmbed();

      // Initialize aliases
      this.client.aliases.forEach(alias =>
      {
        if (alias.aliases.includes(type) || alias.name == type)
          type = alias.name;
      });

      // Redirect to subcommands
      switch (type) {
        case "tracker": localTracker(this.client, message, embed, args, time); break;
        case "reminder": localReminder(this.client, message, embed); break;
        default: return;
      }

    }
    catch (err)
    {
        // Inform bot owner for error, send error log, and log it
        this.client.handler.throw(this.client, message, err);
    }
  }
}

localTracker = (client, message, embed, args, time) =>
{
  // Return if no arguments
  if (args[0] === undefined)
    return message.reply("No arguments detected.");

  // Initialize tracking channels
  const bossTracker = client.channels.cache.get('809033142974808074'),
        rankTracker = client.channels.cache.get('809039278537572362');

  // Initalize variables
  var out, type,
      serverTime = time.toLocaleString(client.handler.LOCAL_TIME_FORMAT);

  // Argument reassignment
  var pointer = args[0];
  args.shift();
  var rest = args;

  // Further subcommands
  if (["boss", "b"].includes(pointer))
  {
      // Argument reassignment
      var wave = args[0],
          boss = args[1],
          health = args[2];
      type = 'Boss progress';
      out = `W${wave} ${boss} (${health})`;
      bossTracker.setName(out);
  }
  else if (["rank", "r"].includes(pointer))
  {
      // Argument reassignment
      var rank = args[0],
          shortTime = time.toLocaleString(client.DateTime.TIME_24_SIMPLE);
      type = 'Troupe rank';
      out = `Rank #${rank} (${shortTime})`;
      rankTracker.setName(out);
  }

  // Build embed
  embed.setColor("55aa55")
       .setTitle(type)
       .setDescription(out)
       .setFooter(`Recorded at ${serverTime} (Server Time).`);
  message.channel.send(embed).catch(console.error);
}
