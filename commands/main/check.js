const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { Interval } = require('luxon');

module.exports = class extends Command
{
  constructor (client)
  {
    super(client,
      {
        name: 'check',
        group: 'main',
        memberName: 'check',
        aliases: ['c','ch'],
        description: 'Retrieve time and most recent tracking data',
        examples: [`${client.commandPrefix}check time`,
                   `${client.commandPrefix}c t`]
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
        case "attempts": checkAttempts(this.client, message, embed); break;
        case "progress": checkProgress(this.client, message, embed); break;
        case "rank": checkRank(this.client, message, embed); break;
        case "time": checkTime(this.client, message, embed, time); break;
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

checkAttempts = (client, message, embed) =>
{
  message.channel.send("Working");
}

checkProgress = (client, message, embed) =>
{
  message.channel.send("Working");
}

checkRank = (client, message, embed) =>
{
  message.channel.send("Working");
}

checkTime = (client, message, embed, time) =>
{
  // Calculate time until reset (c) Akira
  var reset = time.set({
    hour: 5, minute: 0, second: 0
  });

  if (reset < time)
    reset = reset.plus({days: 1});

  // --DEBUG-- Log current time and reset time
  // console.log(time.toLocaleString(client.handler.LOCAL_TIME_FORMAT));
  // console.log(reset.toLocaleString(client.handler.LOCAL_TIME_FORMAT));

  let i = Interval.fromDateTimes(time, reset);
  var currentHour = Math.floor(i.length('hours')),
      currentMin = Math.floor(i.length('minutes') - (60 * currentHour)),
      currentSec = Math.floor(i.length('seconds') - (60 * currentMin) - (3600 * currentHour));

  // Time formatting
  var serverTime = time.toLocaleString(client.handler.LOCAL_TIME_FORMAT);
  var timeLeft = `${currentHour}h ${currentMin}m ${currentSec}s`;

  // Build embed
  embed.setColor('55aa55')
    .addField(`Server time`, `${serverTime}`)
    .addField(`Time until reset`, `${timeLeft}`)
    .setFooter('Server resets at 5:00 am daily (Server Time).');
  message.channel.send(embed).catch(console.error);
}
