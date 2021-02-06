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

const evenlySplit = (arr) => {
    arr.sort((a, b) => b.winrate - a.winrate);
    const split = {
        radiant: [],
        dire: [],
        disparity: '0%'
    }

    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) split.radiant.push(arr[i]);
        else split.dire.push(arr[i]);
    }

    let radiantAvg = split.radiant.reduce((a, b) => a + b.winrate, 0) / split.radiant.length;
    let direAvg = split.dire.reduce((a, b) => a + b.winrate, 0) / split.dire.length;

    let j = 1;
    while (((Math.min(radiantAvg, direAvg) / Math.max(radiantAvg, direAvg)) < 0.93) && j < Math.floor(arr.length/2)) {
        [split.radiant[split.radiant.length - j], split.dire[split.dire.length - j]] = [split.dire[split.dire.length - j], split.radiant[split.radiant.length - j]];
        radiantAvg = split.radiant.reduce((a, b) => a + b.winrate, 0) / split.radiant.length;
        direAvg = split.dire.reduce((a, b) => a + b.winrate, 0) / split.dire.length;
        j++;
    }

    split.disparity = `${(1 - (Math.min(radiantAvg, direAvg) / Math.max(radiantAvg, direAvg)))*100}%`
    if (split.disparity == `NaN%`) split.disparity = "0%";

    return split;
}


let inSession = false;
let split;

bot.on('message', msg => {
    const participants = [];
    const generalChannel = bot.channels.cache.get('807063354493108257');
    const radiantChannel = bot.channels.cache.get('807068609377206332');
    const direChannel = bot.channels.cache.get('807076385604632596');

    if (msg.content === '!dui' || msg.content === '!dui balanced' || msg.content === '!dui random') {
        let commands = msg.content.split(" ");
        inSession = true;
        client.query('SELECT * FROM UserData', (err, res) => {
            if (err) {
                console.log('Couldn\'t update losers.', err);
                inSession = false;
                msg.channel.send("There was an error, session terminated, beep...boop...");
                return;
            }
            
            generalChannel.members.forEach(member => {
                let user = res.rows.find(gamer => gamer.id === member.user.id);
                if (!user) {
                    console.log(`${member.user.username} not found!`);
                    const date = new Date();
                    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}`;
                    client.query(`INSERT INTO UserData VALUES ('${member.user.id}', '${member.user.username}', 0.5, 0, 1, 1, '${formattedDate}');`, err => {
                        if (err) throw err;
                    });
                    user = { id: member.user.id, username: member.user.username, winrate: 0.5 };
                }
                participants.push({ id: user.id, username: user.username, winrate: user.winrate, guildMember: member });
            });

            if (!commands[1] || commands[1] === 'balanced') {
                split = evenlySplit(participants);
                split.radiant.forEach(gamer => gamer.guildMember.voice.setChannel('807068609377206332'));
                split.dire.forEach(gamer => gamer.guildMember.voice.setChannel('807076385604632596'));
                console.log(split);
                msg.channel.send(`Successfully started session. Winrate disparity: ${split.disparity}`)
            }

        });
    }

    if ((msg.content === '!winner dire' || msg.content === '!winner radiant') && inSession) {
        let winningTeam = msg.content.split(" ")[1];
        let losingTeam = winningTeam === 'radiant' ? 'dire' : 'radiant';

        let sqlWinners = 'UPDATE UserData SET won = won + 1, winrate = won::real / (won::real + lost::real) WHERE id IN (';
        let sqlLosers = 'UPDATE UserData SET lost = lost + 1, winrate = won::real / (won::real + lost::real) WHERE id IN (';

        const movePlayersToGeneral = () => {
            radiantChannel.members.forEach(guildMember => guildMember.voice.setChannel('807063354493108257'));
            direChannel.members.forEach(guildMember => guildMember.voice.setChannel('807063354493108257'));
        }

        split[winningTeam].forEach(gamer => {
            sqlWinners += `'${gamer.id}', `;
        });
        split[losingTeam].forEach(gamer => {
            sqlLosers += `'${gamer.id}', `;
        });

        sqlWinners = sqlWinners.slice(0, -2) + ');';
        sqlLosers = sqlLosers.slice(0, -2) + ');'

        client.query(sqlLosers, err => { 
            if (err) {
                console.log('Couldn\'t update losers.', err);
                split = {};
                inSession = false;
                msg.channel.send("There was an error, session terminated, stats lost, beep...boop...");
                movePlayersToGeneral();
            } else {
                client.query(sqlWinners, err => {
                    if (err) {
                        console.log('Couldn\'t update winners.', err);
                        split = {};
                        inSession = false;
                        msg.channel.send("There was an error, session terminated, stats lost, beep...boop...");
                        movePlayersToGeneral();
                    }
                    else {
                        split = {};
                        inSession = false;
                        msg.channel.send("Session terminated successfully, stats recorded. Thanks for using the DUI Tracker Bot, beep boop.");
                        movePlayersToGeneral();
                    }
                });
            }
        });
        
    }
});

/* 
    msg.reply: tags the initial user who has sent the message
    msg.channel.send: sends a message to the channel without tagging anyone

    UPDATE UserData
    SET winrate = won::real / (won::real + lost::real)
    WHERE username = 'Tornope';

    member.voice.setChannel('807068609377206332');
*/