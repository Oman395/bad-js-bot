const Discord = require('discord.js');
const fs = require('fs');
const Memer = require("random-jokes-api");
const token = require('./token.json');
const posts = require('./getcontent.js');
const client = new Discord.Client();
const snoowrap = require('snoowrap');
const serverPrefix = require("./server-prefix.json");
var result;
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const { time } = require('console');
const { Submission, Subreddit } = require('snoowrap');
const { fromJSON } = require('tough-cookie');
var prefix;
const r = new snoowrap({
    userAgent: token.userAgent,
    clientId: token.clientId,
    clientSecret: token.clientSecret,
    username: token.username,
    password: token.password
});
const help_embed = new Discord.MessageEmbed()
    .setTitle('Autismo Help')
    .addField('help', 'you just used it.')
    .addField('Joke', 'makes a joke.')
    .addField('Test', 'use ping.')
    .addField('Ping', 'Returns Pong.')
    .addField('Prefix', 'Sets server prefix, or tells prefix if no prefix.')
    .addField('Subreddit', 'sends a random post from that subreddit.')
    .addField('Contact AutisticMOFO#1337', 'For more details.')
let bannedusers = JSON.parse(fs.readFileSync('banned-users.json'));
let users = JSON.parse(fs.readFileSync('users.json'));
console.log(bannedusers);
client.once('ready', () => {
    console.log('Ready!');
});
client.login(token.token);
client.on('message', message => {
    if (message.author.id == 846770297989365822) {
    } else {
        var author = message.author.id;
        var guild = message.guild.id;
        if (users.hasOwnProperty(guild)) {
            console.log("old user");
            if(users[guild].hasOwnProperty(author)) {
                console.log("old user");
            } else {
                users[guild][author] = "true";
            console.log("new user");
            console.log(users);
            fs.writeFile('users.json', JSON.stringify(users), function (err, result) {
                if (err) console.log('error', err);
            });
            }
        } else {
            users[guild] = {};
            users[guild][author] = "true";
            console.log("new server and user");
            console.log(users);
            fs.writeFile('users.json', JSON.stringify(users), function (err, result) {
                if (err) console.log('error', err);
            });
        }
        console.log(guild);
        if (serverPrefix.hasOwnProperty(guild) == true) {
            var prefix = serverPrefix[guild];
        } else {
            bannedusers[guild] = "!";
            fs.writeFile('server-prefix.json', JSON.stringify(bannedusers), function (err, result) {
                if (err) console.log('error', err);
            });
            var prefix = serverPrefix[guild];
        }
        if (!message.content.startsWith(prefix)) return;
        if (bannedusers.hasOwnProperty("<@" + author + ">")) {
            message.channel.send("Sorry, you are banned from using this bot. Contact AutisticMOFO#1337 for more details.");
        } else {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            switch (command) {
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
                    message.channel.send(help_embed);
                    break;
                case '404':
                    message.channel.send("Once upon a midnight dreary, While i porn surfed, weak and weary, Over many a strange and spurious site of hot xxx galore. While i clicked my fav'rite bookmark, suddenly there came a warning, And my heart was filled with mourning, mourning for my fear amour, 'Tis not possible!', i muttered, 'give me back my free hardcore!' Quoth the server... '404'");
                    break
            }
            if (message.content.startsWith(prefix + "ban ")) {

                if (author.hasPermission(['BAN_MEMBERS'])) {

                } else {
                    message.channel.send("I'm sorry dave, I can't do that.")
                }
            }
            if (message.content.startsWith(prefix + "unban ")) {
                if (author.hasPermission(['BAN_MEMBERS'])) {
                } else {
                    message.channel.send("I'm sorry dave, I can't do that.")
                }
            }
            if (message.content.startsWith(prefix + "say ")) {
                var saything = message.content.slice(prefix.length + 4);
                message.channel.send(String(saything));
            }
            if (message.content.startsWith(prefix + "prefix ")) {
                var newPrefix = message.content.slice(prefix.length + 7);
                serverPrefix[guild] = newPrefix;
                console.log(newPrefix);
                fs.writeFile('server-prefix.json', JSON.stringify(serverPrefix), function (err, result) {
                    if (err) console.log('error', err);
                });
                message.channel.send('"' + newPrefix + '" is the new prefix!');
            }
            if (message.content.startsWith(prefix + "subreddit ")) {
                var subreddit = message.content.slice(prefix.length + 10);
                async function theresABetterWayButNo() {
                    var media = await r.getRandomSubmission(subreddit).permalink;
                    console.log(media);
                    message.channel.send("https://www.reddit.com" + media);
                }
                theresABetterWayButNo();
            }
            if (message.content.startsWith(prefix + "botban ")) {
                if (message.author.id == 616296179302400001) {
                    const banId = message.mentions.members.first();
                    if (bannedusers.hasOwnProperty(banId) == false) {
                        console.log(banId);
                        bannedusers[banId] = "true"
                        fs.writeFile('banned-users.json', JSON.stringify(bannedusers), function (err, result) {
                            if (err) console.log('error', err);
                        });
                        message.channel.send(banId + " banned!");
                    } else {
                        message.channel.send('Sorry, ' + banId + ' is already banned!');
                    }
                }
            }
            if (message.content.startsWith(prefix + "botunban ")) {
                if (message.author.id == 616296179302400001) {
                    var unbanId = message.mentions.members.first();
                    unbanId = "<@" + unbanId + ">";
                    console.log(unbanId);
                    if (bannedusers.hasOwnProperty(unbanId)) {
                        console.log(unbanId);
                        delete bannedusers[unbanId];
                        console.log(bannedusers);
                        fs.writeFile('banned-users.json', JSON.stringify(bannedusers), function (err, result) {
                            if (err) console.log('error', err);
                        });
                        message.channel.send(message.mentions.members.first() + " unbanned!");
                    } else {
                        console.log("wtf no");
                    }
                }
            }
        }
    }
});