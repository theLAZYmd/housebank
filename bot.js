require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();
const Logger = require('./logger');
const Trivia = require('./trivia');
const ids = [
	'338772451565502474',
	'422847086145568769'
];

let bouncerbot, nadekobot, reboot;

client.on('ready', () => {
	reboot = Date.now();
	bouncerbot = client.users.get('365933164725534722') || {
		id: ''
	};
	Logger.log(bouncerbot.id ? `Noticed bot user ${bouncerbot.tag} in ${Date.now() - reboot}ms` : 'Bouncer#8585 is not online!');
	nadekobot = client.users.get('116275390695079945') || {
		id: ''
	};
	Logger.log(nadekobot.id ? `Noticed bot user ${nadekobot.tag} in ${Date.now() - reboot}ms` : 'Nadeko#6685 is not online!');
	Logger.log('Beep bloop. It\'s secret showtime.');
});

process.on('unhandledRejection', (error) => {
	Logger.log('error', 'Uncaught Promise Error:', error);
});

client.on('error', Logger.error);

client.on('message', (message) => {
	if (message.author.id === client.user.id) return;
	if (message.channel.type === 'dm' || message.channel.type === 'group')  return;
	if (ids.includes(message.author.id)) {
		if (message.content.startsWith('.award') || message.content.startsWith('.take')) {
			message.channel.send(message.content);
			message.delete();
		}
	}
	if (message.author.bot) Trivia.run(message);
});

client.login(process.env.TOKEN); //token