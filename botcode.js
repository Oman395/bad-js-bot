const Discord = require('discord.js');
const fs = require('fs');
const Memer = require("random-jokes-api");
const token = require('./token.json');
const posts = require('./getcontent.js');
const client = new Discord.Client();
const snoowrap = require('snoowrap');
var result;
const { SSL_OP_EPHEMERAL_RSA, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
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
    .addField('Help', 'you just used it.')
    .addField('Joke', 'makes a joke.')
    .addField('Test', 'use ping.')
    .addField('Ping', 'API latency and bot latency, bot latency not 100% accurate.')
    .addField('Prefix', 'Sets server prefix, or tells prefix if no prefix.')
    .addField('Subreddit', 'sends a random post from that subreddit.')
    .addField('Server(un)ban', 'locally bans user from bot.')
    .addField('Contact AutisticMOFO#1337', 'For more details.')
client.once('ready', () => {
    console.log('Ready!');
});
var messagecount = SSL_OP_SSLEAY_080_CLIENT_DH_BUG;
const users = JSON.parse(fs.readFileSync('users.json'));
const serverPrefix = require("./server-prefix.json");
const bannedusers = JSON.parse(fs.readFileSync('banned-users.json'));
client.login(token.token);
client.on('message', message => {
    const users = JSON.parse(fs.readFileSync('users.json'));
    const serverPrefix = require("./server-prefix.json");
    const bannedusers = JSON.parse(fs.readFileSync('banned-users.json'));
    if (message.author.id == 846770297989365822) {
    } else {
        console.log(messagecount);
        messagecount ++;
        var author = message.author.id;
        var guild = message.guild.id;
        console.log(guild);
        if (users.hasOwnProperty(guild)) {
            if (users[guild].hasOwnProperty(author)) {
                console.log("old user");
            } else {
                users[guild][author] = true;
                console.log("new user");
                fs.writeFile('users.json', JSON.stringify(users), function (err, result) {
                    if (err) console.log('error', err);
                });
            }
        } else {
            users[guild] = {};
            users[guild][author] = true;
            console.log("new server and user");
            fs.writeFile('users.json', JSON.stringify(users), function (err, result) {
                if (err) console.log('error', err);
            });
        }
        if (serverPrefix.hasOwnProperty(guild) == true) {
            var prefix = serverPrefix[guild];
        } else {
            serverPrefix[guild] = "!";
            fs.writeFile('server-prefix.json', JSON.stringify(bannedusers), function (err, result) {
                if (err) console.log('error', err);
            });
            var prefix = serverPrefix[guild];
        }
        if (!message.content.startsWith(prefix)) return;
        if (bannedusers.hasOwnProperty("<@" + author + ">") == true || users[guild][author] == false) {
            message.channel.send("Sorry, you are banned from using this bot. Contact AutisticMOFO#1337 for more details.");
        } else {
            const unbanid = message.mentions.members.first();
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            switch (command) {
                case 'ping':
                    message.channel.send(`Latency is ${ message.createdTimestamp - Date.now()}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
                    break;
                case 'test':
                    message.channel.send('Why not just use ping?');
                    message.channel.send('While your here, https://github.com/Oman395')
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
            if (message.content.startsWith(prefix + "say ")) {
                var saything = message.content.slice(prefix.length + 4);
                message.channel.send(String(saything));
            }
            if (message.content.startsWith(prefix + "prefix ")) {
                var newPrefix = message.content.slice(prefix.length + 7);
                serverPrefix[guild] = newPrefix;
                fs.writeFile('server-prefix.json', JSON.stringify(serverPrefix), function (err, result) {
                    if (err) console.log('error', err);
                });
                message.channel.send('"' + newPrefix + '" is the new prefix!');
            }
            if (message.content.startsWith(prefix + "subreddit ")) {
                var subreddit = message.content.slice(prefix.length + 10);
                async function theresABetterWayButNo() {
                    var media = await r.getRandomSubmission(subreddit).permalink;
                    message.channel.send("https://www.reddit.com" + media);
                }
                theresABetterWayButNo();
            }
            if (message.content.startsWith(prefix + "botban ")) {
                if (message.author.id == 616296179302400001) {
                    const banId = message.mentions.members.first();
                    if (bannedusers.hasOwnProperty(banId) == false) {
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
                    if (bannedusers.hasOwnProperty(unbanId)) {
                        delete bannedusers[unbanId];
                        fs.writeFile('banned-users.json', JSON.stringify(bannedusers), function (err, result) {
                            if (err) console.log('error', err);
                        });
                        message.channel.send(message.mentions.members.first() + " unbanned!");
                    } else {
                        message.channel.send("I'm sorry dave, I can't do that.");
                    }
                }
            }
            if (message.content.startsWith(prefix + "serverban ")) {
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    const guildcurrent = users[guild];
                    const banfucker = guildcurrent[unbanid.id];
                    if (banfucker == true) {
                        users[guild][unbanid.id] = false;
                        fs.writeFile('users.json', JSON.stringify(users), function (err, result) {
                            if (err) console.log('error', err);
                        });
                        message.channel.send("Banned!");
                    } else {
                        message.channel.send("Sorry, that user is already banned.");
                    }
                } else {
                    message.channel.send("I'm sorry dave, I can't do that.");
                }
            }
            if (message.content.startsWith(prefix + "serverunban ")) {
                if (message.member.hasPermission("ADMINISTRATOR")) {
                    const guildcurrent = users[guild];
                    const banfucker = guildcurrent[unbanid.id];
                    if (banfucker == false) {
                        users[guild][unbanid.id] = true;
                        fs.writeFile('users.json', JSON.stringify(users), function (err, result) {
                            if (err) console.log('error', err);
                        });
                        message.channel.send("Unbanned!");
                    } else {
                        message.channel.send("Sorry, that user is not banned.");
                    }
                } else {
                    message.channel.send("I'm sorry dave, I can't do that.");
                }
            }
        }
    }
});