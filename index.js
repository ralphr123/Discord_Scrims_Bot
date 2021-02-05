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

/* 
    msg.reply: tags the initial user who has sent the message
    msg.channel.send: sends a message to the channel without tagging anyone
*/

// const arr = [1, 2, 5, 1, 6, 2, 3, 4, 4, 5].sort();
// console.log(arr);
// const radiant = [];
// const dire = [];
// for (let i = 0; i < arr.length; i++) {
//     if (i % 2 === 0) radiant.push(arr[i]);
//     else dire.push(arr[i]);
// }
// console.log(radiant);
// console.log(dire);

bot.on('message', msg => {
    if (msg.content === '!dui begin' || msg.content === '!dui begin balanced' || msg.content === '!dui begin random') {
        let commands = msg.content.split(" ");
        client.query('SELECT * FROM UserData', (err, res) => {
            if (err) throw err;
            var channel = bot.channels.cache.get('807063354493108257');
            const participants = [];
            
            channel.members.forEach(member => {
                const user = res.rows.find(user => user.id === member.user.id);
                // member.voice.setChannel('807068609377206332');
                if (!user) {
                    console.log(`${member.user.username} not found!`);
                    const date = new Date();
                    const formattedDate = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDay()}`;
                    client.query(`INSERT INTO UserData VALUES ('${member.user.id}', '${member.user.username}', 0.5, 0, 0, 0, '${formattedDate}')`, err => {
                        if (err) throw err;
                    });
                    user = res.rows.find(user => user.id === member.user.id);
                }
            });

            if (!commands[2] || commands[2] === 'balanced') {

            }

        });
    }
});