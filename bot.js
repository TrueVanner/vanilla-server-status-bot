const {Client, Intents, MessageEmbed, Message, MessageSelectMenu} = require('discord.js');
const serverBackup = require("./serverbackup");
let config = require('./botconfig.json'); 
let token = config.token;
const bot = new Client({intents:[Intents.FLAGS.GUILDS]});

function removeLastMessage(channel) {
    channel.messages.fetch({limit: 1}).then(cache => cache.first().delete())
}

bot.on('ready', () => {
    const guild = bot.guilds.cache.get("910453044410478593");
    const channel = guild.channels.cache.get("916709155375566888");
    
    const args = process.argv.slice(2);

    //channel.send("This is a bot test. I am working on implementing new features, they will not affect the server. Sorry for the inconvenience.\n"/* + res*/)

    if (["0", "1"].includes(args[0])) {
        const statusbool = (args[0] == "0" ? true : false)

        if (statusbool) serverBackup.start();
        
        const embed = new MessageEmbed()
        .setTitle(`Vanilla server ${statusbool ? "OPENED" : "CLOSED"}!`)
        .setColor(statusbool ? "GREEN" : "RED")
        .setTimestamp();

        if (statusbool) embed.addField("Current players:", "*<Empty>*");
        
        const toSend = (statusbool ? {content: "<@&923688308779941910>", embeds: [embed]} : {embeds: [embed]});
        channel.send(toSend).then(msg => {
            if (statusbool) 
                msg.pin().then(() => removeLastMessage(channel))
            else 
                channel.messages.fetchPinned().then(cache => {
                        let embed = new MessageEmbed(cache.first().embeds[0]);

                        let diff = (new Date().getTime() - embed.timestamp);
                        serverBackup.changeCount(diff);
                        diff /= 1000;

                        embed.fields[0].name = "Server was online for:";
                        embed.fields[0].value = `:clock9: ${Math.floor(diff / 3600).toFixed(0)}h ${Math.floor(diff % 3600 / 60).toFixed(0)}m ${Math.floor(diff % 3600 % 60).toFixed(0)}s`
                        cache.first().edit({embeds: [embed]});
                        cache.first().unpin();
                    })
        });
        
    } else if (args[0] == "2") {
        var res = "", emoji, names;
        if (args[1]) {
            names = args[1].split(", ");
            names.forEach(name => {
                emoji = guild.emojis.cache.find(emoji => emoji.name == (name.includes("_AFK") ? "terminatorsteveheadsticker" : (name.includes("(AFK)") ? "zzz" : "steveheadsticker")));
                res += (`${emoji.toString()}  **${name}**\n`);
            })
        } else {
            res = "*<Empty>*"
        }
        let lastMessage;
        channel.messages.fetchPinned().then(cache => {
            lastMessage = cache.first();

            let embed = new MessageEmbed(lastMessage.embeds[0]);
            embed.fields[0].value = res;
            lastMessage.edit({embeds: [embed]});
        });
    } else if(args[0] == "3") {
        const embed = new MessageEmbed()
        .setColor("YELLOW")
        .setTitle(`INFO: ${args[1]}`)
        .setDescription(args[2])
        .setTimestamp();

        channel.send({embeds: [embed]});
    }

    setTimeout(() => process.exit(1), 3000);

    
//this is old now lol
    //getting this code to work wasn't very complicated, but getting everything else was. Most of the functional part was taken from the internet, so take it as a whole

    //step 1: server.bat CALL's notify.bat. CALL is synchronous, and process stops until it is finished. I could have called its contents from server.bat, but it looks better when it is in a different file.
    
    //step 2: in notify.bat, move to the bot's location and run it. %1 means that it takes the first argument, given to it. We give this argument in server.bat: 0 when we call it before the server starts,
    //and 1 when it ends.

    //step 3: here, we take all the arguments from the process (argv), and slice it from 2 because the allmighty internet told me so. This number determines whether the system should notify the users
    //of opening or closing. The timeout in the end is only this long because I'm afraid that, in the worst case, my message won't be sent because the network is overloaded, but the timeout has already
    //ended.
});

bot.login(token);