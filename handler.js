// Custom error handling management
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
exports.colorize = (client) =>
{
  return Math.floor(Math.random()*16777215).toString(16);
}
