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
        description: 'Various tracking tools',
        examples: [`${client.commandPrefix}track attempts self 1 2`,
                   `${client.commandPrefix}t a s 1 2`,
                   `${client.commandPrefix}t a @marsx 1 2`]
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
        case "attempts": trackAttempts(this.client, message, embed, args, time); break;
        case "progress": trackProgress(this.client, message, embed); break;
        case "rank": trackRank(this.client, message, embed); break;
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

trackAttempts = async(client, message, embed, args, time) =>
{
  // Return if no arguments
  if (args[0] === undefined)
    return message.reply("No arguments detected.");

  // Return if too many arguments
  if (args.length > 3)
    return message.reply("Too many arguments.");

  // Initialize variables
  var mention,
      serverTime = time.toLocaleString(client.handler.LOCAL_TIME_FORMAT);
  if (message.mentions.members.first())
    var mention = message.mentions.members.first();
  const channel = message.channel;

  // Return if invalid arguments
  if (!mention && !["self", "s"].includes(args[0]))
    return message.reply("Invalid argument. Please mention a user or indicate [self, s] if tracking for yourself.");
  if (args[1] && ((parseInt(args[1]) > 3 || parseInt(args[1]) < 0) || isNaN(parseInt(args[1]))))
    return message.reply("Invalid argument. Tries must be within [0-3].");
  if (args[2] && ((parseInt(args[2]) > 5 || parseInt(args[2]) < 0) || isNaN(parseInt(args[2]))))
    return message.reply("Invalid argument. Overflow must be within [0-5].");

  // Delete command message
  message.delete({timeout: 100});

  // Argument reassignment
  var pointer = args[0],
      tries = args[1] ?? 0,
      overflow = args[2] ?? 0;

  // Substitute mentions if point to self
  if (["self", "s"].includes(pointer))
  mention = message.author;

  // Search for previous tracking on specified member
  let res = await channel.messages.fetch({limit: 100});
  let pointerBuffer = await res.filter(message => {
    if (message.author.id === process.env.BOT_ID && message.embeds.length > 0)
    {
      if (message.embeds[0].description === null) return;
      let mostRecent = message.embeds[0].description.split(/ +/g).shift();
      let fetchedUser = client.handler.getUserFromMention(client, mostRecent);
      if (fetchedUser === undefined) return;
      return fetchedUser.id === mention.id;
    }
  });

  // Check if a previous entry exists, then delete that previous entry
  if (pointerBuffer.first())
  {
    let pointerMostRecent = pointerBuffer.first().id;
    let deleteBuffer = await channel.messages.fetch(pointerMostRecent);
    deleteBuffer.delete({timeout: 100});

    // --DEBUG-- countercheck message ID
    // console.log(pointerMostRecent);
  }

  // Build embed
  embed.setColor("55aa55")
       .setTitle("Attempt tracker")
       .setDescription(`${mention} has ${tries} tries and ${overflow} overflow remaining.`)
       .setFooter(`Recorded at ${serverTime} (Server Time).`);
  message.channel.send(embed).catch(console.error);
}

trackProgress = (client, message, embed) =>
{
  message.channel.send("Working");
}

trackRank = (client, message, embed) =>
{
  message.channel.send("Working");
}
