// track,js
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
        description: 'Track concurrent attempts of troupe members',
        examples: []
      });
  }

  async run (message)
  {
    try
    {
      // Delete command message
      message.delete({timeout: 100});

      // Set time
      var time = this.client.DateTime.local().toLocaleString({
        year: '2-digit', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Japan'
      });

      // Initialize args
      const args = message.content.slice(this.client.commandPrefix.length).trim().split(/ +/g);
      var type = args[1];
      args.splice(0, 2);

      // Initialize aliases
      this.client.aliases.forEach(alias =>
      {
        if (alias.aliases.includes(type) || alias.name == type)
          type = alias.name;
      });

      // Redirect to subcommands
      switch (type) {
        case "attempts": trackAttempts(this.client, message, args, time); break;
        case "progress": trackProgress(this.client, message); break;
        case "rank": trackRank(this.client, message); break;
        case "time": trackTime(this.client, message); break;
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

trackAttempts = async(client, message, args, time) =>
{
  // Return if no arguments
  if (args[0] === undefined)
    return message.reply("No arguments detected.");

  // Return if too many arguments
  if (args.length > 3)
    return message.reply("Too many arguments.");

  // Return if invalid arguments
  // if (typeof args[0])
  //   return

  console.log(typeof args[0]);
  console.log(typeof args[1]);
  console.log(typeof args[2]);

  // Argument reassignment
  var pointer = args[0],
      tries = args[1],
      overflow = args[2];

  // Initialize variables
  var mention = message.mentions.members.first();
  const embed = new MessageEmbed(),
        channel = message.channel;

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
       .setFooter(`Recorded at ${time} (Server Time).`);
  message.channel.send(embed).catch(console.error);
}

trackProgress = (client, message) =>
{
  message.channel.send("Working");
}

trackRank = (client, message) =>
{
  message.channel.send("Working");
}

trackTime = (client, message) =>
{
  message.channel.send("Working");
}
