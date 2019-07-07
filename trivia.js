const Logger = require('./logger');

/**
 * Trivia Winnings
 * Winnings
 * 1 player: 0 🌸 for 1st
 * 2 players: 3 🌸 for 1st, 1 🌸 for 2nd
 * 3 players: 4 🌸 for 1st, 2 🌸 for 2nd
 * 4 players: 5 🌸 for 1st, 3 🌸 for 2nd, 1 🌸 for 3rd
 * 5 players 6 🌸 for 1st, 4 🌸 for 2nd, 2 🌸 for 3rd
 * 6 players 7 🌸 for 1st, 5 🌸 for 2nd, 3 🌸 for 3rd, 1 🌸 for 4th
 * n players (n + 1) 🌸 for 1st, (n - 1) 🌸 for 2nd, (n - 3) 🌸 for 3rd, (n - 5) 🌸 for 4th
 * 
 * For n players, the 'i'th player, beginning at an index of 1 wins Math.max((n + 2 - (2 * i)), 0) 🌸.
 * In the case of a tie between players a, b, ... n, the payout for each is Math.ceil((n, i)Σ payout(i) / n)
 * @param {string[]} args 
 */
class Trivia {

	/**
	 * Runs a new trivia payout procedure
	 * @param {Message} message 
	 */
	static run(message) {
		if (!Trivia.validator(message)) return;
		const args = message.embeds[0].description.split('\n');
		let [names, scores] = Trivia.parse(args);
		if (names[0] === 'No' || names.length < 2) return;	//Too few or no participants
		if (scores[0] < 10) return;							//Participants failing to reach 10 game threshold
		let payouts = Trivia.payouts(scores);
		let obj = {};
		for (let i = 0; i < payouts.length; i++) {
			setTimeout(() => {
				message.channel.send('.award ' + payouts[i] + ' ' + names[i]);
			}, i * 1000);
			obj[names[i]] = payouts[i];
		}
		Logger.log(['Trivia', 'payout', 'auto', JSON.stringify(obj)]);
	}

	/**
	 * Checks if a message is a valid trivia result or not
	 * @param {Message} message
	 */
	static validator({embeds}) {
		if (embeds.length === 0) return false;
		if (!embeds[0]) return false;
		let {author, title, description} = embeds[0];
		if (!description) return false;
		if (!author) return false;
		if (!title) return false;
		if (!/Trivia Game Ended|Final Results/.test(title)) return false;
		return true;
	}

	/**
	 * Gets names and scores from trivia input data
	 * @param {string[]} args 
	 */
	static parse(args = []) {
		let names = [];
		let scores = [];
		args.forEach((line) => {
			let [name,, score] = line
				.replace(/\*/g, '')
				.split(/\s+/g);
			names.push(name);
			scores.push(Number(score));
		}, [[], []]);
		return [names, scores];
	}

	/**
	 * Converts an array of score data into a list of payouts
	 * @param {Number[]} scores 
	 */
	static payouts(scores) {
		let payouts = [];
		const dict = scores.reduce((dict, score, i) => {
			if (Array.isArray(dict[score])) dict[score].push(i);
			else dict[score] = [i];
			return dict;
		}, {});
		for (let indices of Object.values(dict)) {
			let total = indices.reduce((acc, index) => acc += Math.max(scores.length + 1 - (2 * index), 0), 0);
			let adjusted = Math.ceil(total / indices.length);
			indices.forEach((i) => payouts[i] = adjusted);
		}
		return payouts.filter(val => val > 0);
	}

	
}

module.exports = Trivia;