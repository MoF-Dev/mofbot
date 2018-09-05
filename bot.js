const Discord = require('discord.js');
const fs = require('fs');
const {prefix, token} = require('./configuration.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
// Notifies that bot is live
client.on('ready', () => {
    console.log('Ready!');
});

// Handles all errors....for now
client.on('error', console.error);

// Fires when any message is sent in a channel bot is in
client.on('message', message => {
    // Returns if message does not have prefix or if author is a bot
    if(!message.content.startsWith(prefix) || message.author.bot){
        return autoResponse(message)
    };
    // Splits message by prefix and arguments
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    // Limits bot to testing channel (remove later)
    if(isBotChannel(message.channel.name)){
        handleCommand(message, commandName, args)
    }
    else{
        console.log("Wrong Channel")
    }
});

function autoResponse(message){
    let msg = message.content.toLowerCase()
    if(msg === 'how\'s life' || msg === 'hows life'){
        return message.reply('Fighting~');
    }
}

// Handles all messages (auto responses & commands)
function handleCommand(message, commandName, args){

    console.log("Auto responding")

    const command = client.commands.get(commandName) 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if(!command) return;
    // if command requires args, return if no args
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}`;
        if(command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if(!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) /1000
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\ command.\``);
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args)
    }
    catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command')
    }
}


function isBotChannel(str){
    if(str === "bot-friendly"){
        return true
    }
    return false
}

client.login(token);
