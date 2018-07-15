const Discord = require('discord.js');
const client = new Discord.Client();
const letters = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];

const token = ""; /* Seu token do Discord */
const txt = ""; /* Texto da sua reação */

const react = 1000; /* Delay desejado entre reações (ms) */
const sleep = 2000; /* Delay desejado entre mensagens (ms) */

var queue = [];
var reactQueue = [];
var working = false;
var current = undefined;
var charPos = text => text.toLowerCase().split('')
	.map(x => "abcdefghijklmnopqrstuvwxyz".split('')
		.indexOf(x) + 1);
var isAlphabetChars = text => new RegExp("^[a-zA-Z]*$")
	.test(text);

function uniqueChars(s) {
	var r = {}
		, i, x;
	for (i = 0; i < s.length; i++) {
		x = s[i];
		if (r[x]) return false;
		r[x] = true;
	}
	return true;
}

if (txt.length == 0) {
	console.error('[-] Sua reação está em branco!');
	process.exit(1);
} else if (token.length == 0) {
	console.error('[-] Seu token está em branco!');
	process.exit(1);
} else if (!isAlphabetChars(txt)) {
	console.error('[-] Sua reação contem caracteres invalido(s).');
	process.exit(1);
}

if (!uniqueChars(txt)) console.info('[!] Sua reação desejada contém caracteres repetidos, portanto não será executada corretamente.');

client.on('message', msg => {
	if (msg.author != client.user) {
		if (msg.channel.type == "dm" || msg.channel.type == "group") {
			queue.push(msg);
		}
	}
});

setInterval(function() {
	if (working || queue.length == 0) return;
	if (current === undefined) {
		for (i = 0; i < txt.length; i++) {
			reactQueue.push(letters[charPos(txt[i]) - 1]);
		}
		reactQueue = Array.from(new Set(reactQueue));
		current = queue[0];
		queue.shift();
		working = true;
	}
}, 2000);

setInterval(function() {
	if (current !== undefined) {
		current.react(reactQueue[0])
			.catch(O_o => {});
		reactQueue.shift();
		if (reactQueue.length == 0) {
			current = undefined;
			setTimeout(function() {
				working = false;
			}, sleep);
		}
	}
}, react);

client.login(token).catch(e => {
	console.log("[-] Erro ao conectar ao Discord, o token inserido é válido?!");
	console.error(e);
	process.exit(1);
});