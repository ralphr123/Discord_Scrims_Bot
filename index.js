require('dotenv').config()
const Discord = require('discord.js');
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    user: 'keuihxcmfzkagj',
    password: process.env.DATABASE_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

const bot = new Discord.Client();

bot.login(process.env.TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}`);
});

bot.on('message', msg => {
    if (msg.content === 'display') {
        var channel = bot.channels.cache.get('807063354493108257');
        channel.members.forEach(member => {
            // console.log(member.user.username, member.user.id);
            member.voice.setChannel('807068609377206332');
        });
    }
});