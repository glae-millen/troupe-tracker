// Custom error handling management (c) Ravalle
exports.throw = async (client, message, err) =>
{
  await console.error(err);

  // Error notification
  message.channel.send(`The bot has experienced a critical error.`);

  // Send error log in bot HQ
  const errChannel = client.channels.cache.get('804603984269934632');

  if (message.channel.type == "dm")
    await errChannel.send(`User ${message.author} experienced an error in **Direct Messages with the bot** at ${message.createdAt}`);

  else if (message.guild.available)
  {
    await errChannel.send(`User ${message.author} experienced an error in **${message.guild.name}**: #${message.channel.name} at ${message.createdAt}`);
    await errChannel.send(`Link: https://discordapp.com/channels/${message.author.id}/${message.channel.id}/${message.id}`);
  }

  else
    await errChannel.send(`User ${message.author} experienced an error in **an unknown DM or Guild** at ${message.createdAt}`);

  await errChannel.send(`Command issued: \`\`\`${message.content}\`\`\``);
  await errChannel.send(`Error encountered: \`\`\`${err}\`\`\``);
}

// Search and delete most recent tracking entry
exports.update = async (client, channel, key, requiresUser = false) =>
{
  // Search for previous tracking on specified member
  let res = await channel.messages.fetch({limit: 100}),
      pointerBuffer = await res.filter(message =>
  {
    if (message.author.id === process.env.BOT_ID && message.embeds.length > 0)
    {
      if (message.embeds[0].title === null) return;
      let mostRecent = message.embeds[0].title;
      if (requiresUser == true)
      {
        mostRecent = message.embeds[0].description.split(/ +/g).shift();
        let fetchedUser = client.handler.getUserFromMention(client, mostRecent);
        if (fetchedUser === undefined) return;
        mostRecent = fetchedUser.id;
      }
      return mostRecent === key;
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
}

// Picks a random color
exports.colorize = () =>
{
  return Math.floor(Math.random()*16777215).toString(16);
}

// Acquire a user id from a mention
exports.getUserFromMention = (client, mention) => {
	// First match from regex
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array
	if (!matches) return;

	// Separate the ID
	const id = matches[1];

	return client.users.cache.get(id);
}

// Fumi time formatting
exports.FUMI_DATETIME = "LL'/'dd'/'yy', 'HH':'mm':'ss"
exports.FUMI_TIME_SIMPLE = "HH':'mm"
