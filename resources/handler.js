// Custom error handling management (c) Ravalle
exports.throw = async (client, message, err) =>
{
  // Error notification
  message.channel.send(`The bot has experienced a critical error. Notifying developers and restarting...`);

  // Send error log in bot HQ
  const channel = client.channels.cache.get('804603984269934632');

  if (message.channel.type == "dm")
  {
    await channel.send(`User ${message.author} experienced an error in **Direct Messages with the bot** at ${message.createdAt}`);
  }
  else if (message.guild.available)
  {
    await channel.send(`User ${message.author} experienced an error in **${message.guild.name}**: #${message.channel.name} at ${message.createdAt}`);
    await channel.send(`Link: https://discordapp.com/channels/${message.author.id}/${message.channel.id}/${message.id}`);
  }
  else
  {
    await channel.send(`User ${message.author} experienced an error in **an unknown DM or Guild** at ${message.createdAt}`);
  }

  await channel.send(`Command issued: \`\`\`${message.content}\`\`\``);
  await channel.send(`Error encountered: \`\`\`${err}\`\`\``);
  await console.error(err);

  // Reboot
  process.exit(1);
}

// Picks a random color
exports.colorize = () =>
{
  return Math.floor(Math.random()*16777215).toString(16);
}

// Acquire a user id from a mention
exports.getUserFromMention = (client, mention) => {
	// The id is the first and only match found by the RegEx.
	const matches = mention.match(/^<@!?(\d+)>$/);

	// If supplied variable was not a mention, matches will be null instead of an array.
	if (!matches) return;

	// However the first element in the matches array will be the entire mention, not just the ID,
	// so use index 1.
	const id = matches[1];

	return client.users.cache.get(id);
}

// Fumi time formatting
exports.LOCAL_TIME_FORMAT = {
  year: '2-digit', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false
}
