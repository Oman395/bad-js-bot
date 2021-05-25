const Discord = require('discord.js');
const fs = require('fs');
const Memer = require("random-jokes-api");
const token = require('./token.json');
const client = new Discord.Client();
let badbannedusers = fs.readFileSync('banned-users.json');
let bannedusers = JSON.parse(badbannedusers);
console.log(bannedusers);
client.once('ready', () => {
	console.log('Ready!');
});
var prefix = "!";
client.login(token.token);
client.on('message', message => {
    if(bannedusers.hasOwnProperty(message.author.id) == false || message.author.id == 616296179302400001){
        if(message.author.id != 846770297989365822) {
        if(!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
	    const command = args.shift().toLowerCase();
        switch(command){
            case 'ping':
                message.channel.send('Pong!');
                break;
            case 'test':
                message.channel.send('Why not just use ping?')
                break;
            case 'joke':
                let jokes = Memer.joke();
                message.channel.send(jokes);
                break;
            case 'help':
                message.channel.send("help - you just used it, joke - makes a joke, test - use ping, ping - returns pong, all the other commands are mine :D contact AutisticMOFO#1337 for more details.");
        }
        if(message.content.startsWith(prefix + "ban ")) {
            if(message.author.id == 616296179302400001) {
                const banId = message.mentions.members.first();
                if(bannedusers.hasOwnProperty(banId) == false) {
                const stringbanned = JSON.stringify(bannedusers);
                bannedusers[banId] = "true"
                    fs.writeFile('banned-users.json', stringbanned, function(err, result) {
                    if(err) console.log('error', err);
                });
                message.channel.send(banId + " banned!");
            } else {
                message.channel.send('Sorry, ' + banId + ' is already banned!');
            }
            }
        if(message.content.startsWith(prefix + "say ")) {
            var saything = message.content.slice(prefix.length + 4);
            message.channel.send(String(saything));
        }
      }
    }
    } else {
        message.channel.send('Sorry, you cant use that command!');
    }
});