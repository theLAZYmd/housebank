require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();
const Logger = require('./logger');
const Trivia = require('./trivia');
const ids = {
	'338772451565502474': true,
	'422847086145568769': true,
	'363519664875372556': true,
	'365177031224459264': true,
	'303609777756438529': true,
	'373480715276517376': true,
	'330193848137678848': true,
	'333586342275710978': true,
	'185412969130229760': false
};

let bouncerbot, nadekobot, reboot;

client.on('ready', () => {
	reboot = Date.now();
	bouncerbot = client.users.get('365933164725534722') || {
		id: ''
	};
	Logger.info(bouncerbot.id ? `Noticed bot user ${bouncerbot.tag} in ${Date.now() - reboot}ms` : 'Bouncer#8585 is not online!');
	nadekobot = client.users.get('116275390695079945') || {
		id: ''
	};
	Logger.info(nadekobot.id ? `Noticed bot user ${nadekobot.tag} in ${Date.now() - reboot}ms` : 'Nadeko#6685 is not online!');
	Logger.info('Beep bloop. It\'s secret showtime.');
});

process.on('unhandledRejection', Logger.error);
client.on('error', Logger.error);

client.on('message', (message) => {
	try {
		if (message.author.id === client.user.id) return;
		if (message.channel.type === 'dm' || message.channel.type === 'group')  return;
		if (ids[message.author.id]) {
			if (message.content.startsWith('.award') || message.content.startsWith('.take')) {
				message.channel.send(message.content);
				message.delete();
			}
		}
		if (message.author.bot) Trivia.run(message);
	} catch (e) {
		if (e) Logger.error(e);
	}
});

client.login(process.env.TOKEN); //token