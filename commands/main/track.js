const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command
{
  constructor (client)
  {
    super(client,
      {
        name: 'track',
        group: 'main',
        memberName: 'track',
        aliases: ['t'],
        description: 'Tracks member runs, troupe progress, and troupe rank.',
        examples: [`${client.commandPrefix}track attempts self 1 2`,
                   `${client.commandPrefix}t a @marsx 1 2`,
                   `${client.commandPrefix}t p 12 nana 1433536`,
                   `${client.commandPrefix}t r 144`]
      });
  }

  async run (message)
  {
    try
    {
      // Set time
      const time = this.client.DateTime.local();

      // Initialize args
      const args = message.content.slice(this.client.commandPrefix.length).trim().split(/ +/g);
      let type = args[1];
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
        case "attempts": trackAttempts(this.client, message, embed, args, time); break;
        case "progress": trackProgress(this.client, message, embed, args, time); break;
        case "rank": trackRank(this.client, message, embed, args, time); break;
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

// Attempt tracker
trackAttempts = async (client, message, embed, args, time) =>
{
  // Initialize variables
  const serverTime = time.toFormat(client.handler.FUMI_DATETIME),
        channel = message.channel;
  let mention;
  if (message.mentions.members.first())
    mention = message.mentions.members.first();

  // Argument validation
  if (args[0] === undefined)
    return message.reply("No arguments detected.");
  if (args.length > 3)
    return message.reply("Too many arguments.");
  if (!mention && !["self", "s"].includes(args[0]))
    return message.reply("Invalid argument. Please mention a user or indicate [self, s] if tracking for yourself.");
  if (args[1] && ((parseInt(args[1]) > 3 || parseInt(args[1]) < 0) || isNaN(parseInt(args[1]))))
    return message.reply("Invalid argument. Tries must be within [0-3].");
  if (args[2] && ((parseInt(args[2]) > 5 || parseInt(args[2]) < 0) || isNaN(parseInt(args[2]))))
    return message.reply("Invalid argument. Overflow must be within [0-5].");

  // Delete command message
  message.delete({timeout: 100});

  // Argument reassignment
  let pointer = args[0],
      tries = args[1] ?? 0,
      overflow = args[2] ?? 0;

  // Substitute mentions if point to self
  if (["self", "s"].includes(pointer))
  mention = message.author;

  // Search and delete most recent tracking entry
  client.handler.update(client, channel, mention.id, true);

  // Build embed
  embed
    .setColor("55aa55")
    .setTitle("Attempt tracker")
    .setDescription(`${mention} has ${tries} tries and ${overflow} overflow remaining.`)
    .setFooter(`Recorded at ${serverTime} (Server Time).`);
  message.channel.send(embed).catch(console.error);
}

// Progress tracker
trackProgress = async (client, message, embed, args, time) =>
{
  // Argument validation
  if (args[0] === undefined)
    return message.reply("No arguments detected.");
  if (args.length > 3)
    return message.reply("Too many arguments.");
  if (args[0] && ((parseInt(args[0]) < 0) || isNaN(parseInt(args[0]))))
    return message.reply("Invalid argument. Wave must be a positive integer.");
  if (args[2] && ((parseInt(args[2]) < 0) || isNaN(parseInt(args[2]))) && args[2].toLowerCase() != 'full')
    return message.reply("Invalid argument. Health must be a positive integer.");

  // Initalize variables
  const serverTime = time.toFormat(client.handler.FUMI_DATETIME),
        channel = message.channel;

  // Delete command message
  message.delete({timeout: 100});

  // Argument reassignment
  let pin,
      wave = args[0],
      boss = args[1].toLowerCase(),
      health = args[2].toLowerCase() ?? 'full';
  boss = boss.charAt(0).toUpperCase() + boss.slice(1);
  health = health.charAt(0).toUpperCase() + health.slice(1);
  pin = `W${wave} ${boss} (${health})`;

  // Search and delete most recent tracking entry
  client.handler.update(client, channel, "Progress tracker");

  // --TEMP-- If command is invoked in g4y rights server...
  // Initialize tracking channel
  const trChannel = client.channels.cache.get('809033142974808074');

  // Update progress board
  if (message.channel.guild.id == '795096554628972554')
    trChannel.setName(pin).catch(console.error);

  // Build embed
  embed
    .setColor("55aa55")
    .setTitle("Progress tracker")
    .setDescription(`Troupe is currently on W${wave} ${boss} (${health}).`)
    .setFooter(`Recorded at ${serverTime} (Server Time).`);
  message.channel.send(embed).catch(console.error);
}

// Rank tracker
trackRank = async (client, message, embed, args, time) =>
{
  // Argument validation
  if (args[0] === undefined)
    return message.reply("No arguments detected.");
  if (args.length > 1)
    return message.reply("Too many arguments.");
  if (args[0] && ((parseInt(args[0]) < 0) || isNaN(parseInt(args[0]))))
    return message.reply("Invalid argument. Rank must be a positive integer.");

  // Initalize variables
  const serverTime = time.toFormat(client.handler.FUMI_DATETIME),
        shortTime = time.toFormat(client.handler.FUMI_TIME_SIMPLE),
        channel = message.channel;

  // Delete command message
  message.delete({timeout: 100});

  // Argument reassignment
  let pin,
      rank = args[0];
  pin = `Rank #${rank} (${shortTime})`;

  // Search and delete most recent tracking entry
  client.handler.update(client, channel, "Rank tracker");

  // --TEMP-- If command is invoked in g4y rights server...
  // Initialize tracking channel
  const trChannel = client.channels.cache.get('809039278537572362');

  // Update progress board
  if (message.channel.guild.id == '795096554628972554')
    trChannel.setName(pin).catch(console.error);

  // Build embed
  embed
    .setColor("55aa55")
    .setTitle("Rank tracker")
    .setDescription(`Troupe is currently rank #${rank}.`)
    .setFooter(`Recorded at ${serverTime} (Server Time).`);
  message.channel.send(embed).catch(console.error);
}
