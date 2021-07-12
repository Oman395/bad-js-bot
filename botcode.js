const token = require('./token.json');
const db = require('quick.db');
const Discord = require('discord.js');
const Memer = require("random-jokes-api");
const client = new Discord.Client();
const snoowrap = require('snoowrap');
var result;
const { SSL_OP_EPHEMERAL_RSA, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { time } = require('console');
const { Submission, Subreddit } = require('snoowrap');
const { fromJSON } = require('tough-cookie');
if (!db.has("userDB")) {
    db.set('userDB', {});
}
if (!db.has("serverDB")) {
    db.set('serverDB', {});
}
const r = new snoowrap({
    userAgent: token.userAgent,
    clientId: token.clientId,
    clientSecret: token.clientSecret,
    username: token.username,
    password: token.password
});
client.once('ready', () => {
    console.log('Ready!');
});
const help_embed = new Discord.MessageEmbed()
    .setTitle('Autismo Help')
    .addField('Help', 'you just used it.')
    .addField('Joke', 'makes a joke.')
    .addField('Test', 'use ping.')
    .addField('Ping', 'API latency and bot latency, bot latency not 100% accurate.')
    .addField('Prefix', 'Sets server prefix, or tells prefix if no prefix.')
    .addField('Subreddit', 'sends a random post from that subreddit.')
    .addField('(Un)ban', 'bans user mentioned from server.')
    .addField('Kick', 'kicks user mentioned from server.')
    .addField('Contact AutisticMOFO#1337', 'for more details.')
client.login(token.token);
client.on('message', message => {
    var user = message.author.id;
    var guild = message.guild.id;
    var userInfo = db.get("userDB");
    var serverInfo = db.get("serverDB");
    switch (db.has("userDB")) {
        case (false):
            db.set("userDB", {})
    }
    switch (db.has("serverDB")) {
        case (false):
            db.set("serverDB", {})
    }
    var guild = message.guild.id;
    var user = message.author.id;
    if (userInfo.hasOwnProperty(user) != true) {
        userInfo[user] = { "banned": false };
        db.set("userDB", userInfo);
    }
    if (serverInfo.hasOwnProperty(guild)) {
        if (serverInfo[guild].hasOwnProperty(user) != true) {
            serverInfo[guild].users[user] = { "banned": false, "muted": false }
            db.set("serverDB", serverInfo);
        }
    } else {
        serverInfo[guild] = { "prefix": "a!" };
        serverInfo[guild][user] = { "banned": false, "muted": false }
        db.set("serverDB", serverInfo);
    }
    console.log("done with user checking");
    var prefix = serverInfo[guild].prefix;
    if (!message.content.startsWith(prefix)) return;
    console.log("Message_important");
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    switch (args[0]) {
        case 'ping':
            message.channel.send(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
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
        case 'kick':
            if (message.mentions.members.first()) {
                if (message.member.hasPermission("MANAGE_MESSAGES")) {
                    message.mentions.members.first().kick();
                    message.channel.send("Kicked!");
                } else {
                    message.channel.send("Sorry, you dont have the permissions.");
                }
            } else {
                message.channel.send("Sorry, no user specified.");
            }
            break;
        case 'ban':
            if (message.mentions.members.first()) {
                if (message.member.hasPermission("BAN_MEMBERS")) {
                    try {
                        message.mentions.members.first().ban();
                        message.channel.send("Banned!");
                        serverInfo[guild][users][user].banned = true;
                    } catch (e) {
                        console.error(e);
                        message.channel.send("Sorry, there was an eror. Or that user cant be banned. Or you tried to ban yourself. I cant tell because my programmer is la- very good at what he does and also can kill me at any moment");
                    }
                } else {
                    message.channel.send("Sorry, you dont have the permissions.");
                }
            } else {
                message.channel.send("Sorry, no user specified.");
            }
            break;
        case 'unban':
            async function doShit() {
                if (message.member.hasPermission("BAN_MEMBERS")) {
                    let userID = args[1];
                    userID = userID.substring(3);
                    userID = userID.substring(0, userID.length - 1);
                    if (!userID) return message.reply("Please specify the user ID you wish to unban!")
                    try {
                        message.guild.fetchBans().then(bans => {
                            if (bans.size === 0) {
                                return message.reply("There is no users banned!")
                            } else {
                                console.log(userID);
                                message.guild.members.unban(userID);
                                message.channel.send("Unbanned!");
                            }
                        });
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    message.channel.send("Sorry, you dont have the permissions.");
                }
            }
            doShit();
            break;
        case 'prefix':
            if (args[1]) {
                var newPrefix = args[1];
                serverInfo[guild].prefix = newPrefix;
                message.channel.send('"' + newPrefix + '" is the new prefix!');
            }
            break;
        case 'subreddit':
            var subreddit = message.content.slice(prefix.length + 10);
            async function theresABetterWayButNo() {
                var media = await r.getRandomSubmission(subreddit).permalink;
                message.channel.send("https://www.reddit.com" + media);
            }
            theresABetterWayButNo();
            break;
        case 'botban':
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
            break;
    }
    db.set("serverDB", serverInfo);
    db.set("userDB", userInfo);
});
