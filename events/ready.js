// ready.js
module.exports = (client, ready) =>
{
	console.log(`Fumi -- Troupe progress tracker -- Username: ${client.user.username}`);
  console.log(`Currently serving ${client.guilds.cache.size} servers and ${client.users.cache.size} members`);
	client.user.setActivity(`Revue Starlight Re:LIVE`, {type:"PLAYING"});
}
