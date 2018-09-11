const Discord = require('discord.js');
const fs = require('fs');
const {prefix, token} = require('./configuration.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
chainChannels = new Discord.Collection();
var chainAuthor = "";
var chain = false;

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

// Fires when any message is sent in a channel bot is also in
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
    else if(msg === "why are we here" || msg === "why are we here?"){
        return message.reply('\n:eyes: alright :ear: listen:ear:  up:arrow_up:  kiddo:baby:\nlet :clap: me:cowboy:  tell you:boy:   what we\'re here:point_down:  to do\nwe\'re :raised_hand:  not here to :b: e clowns:clown:  or :b:itches:cry:\nwe\'re :raised_hand:  not here to play :two: :one:  :grey_question: questions:question:  nor do we have the time:alarm_clock:\nso if you got any other dumb:snail:  ideas:bulb:  you best get outta:wheelchair:  here:wave: \nwe\'re here for :one: one reason and :one: one reason only:ok_hand: ,\nand that is to :first_place: win:ok_hand:')
    }
    else{
        checkChain(message);
    }
}

function checkChain(message){
    // Create channel
    var channel = null;
    if(!chainChannels.has(message.channel)){
        chainChannels.set(message.channel, new Discord.Collection);
    }
    channel = chainChannels.get(message.channel);

    // //nothing in channel, set initial message
    if(!channel.array().length){
        console.log(`Channel is empty. Adding initial author.`);
        console.log(`Adding ${message.author.username} with message ${message.content}`);
        channel.set(message.author.id, message.content);
        chainAuthor = message.author.id;
    }
    // // repeated author, create new channel, fill with message
    else if(channel.has(message.author.id)){
        console.log(`Repeat author found. Creating new channel and updating initial author`);
        channel = resetChannel(message)
    }
    // add next author if message matches
    else if(channel.get(chainAuthor) === message.content){
        console.log(`Adding ${message.author.username} with message ${message.content}`);
        channel.set(message.author.id, message.content);
    }
    // message mismatch, create new channel, fill with message
    else {
        console.log(`Message does not match. Creating new channel and updating initial author.`)
        channel = resetChannel(message)
    }

    if(channel.array().length >= 3){
        console.log(`${message.channel.name} chain formed. Length: ${channel.array().length}`);
        chain = true;
    }
    else {
        console.log(`${message.channel.name} chain not yet formed. Length: ${channel.array().length}`);
    }
}

function resetChannel(message){
    chainChannels.set(message.channel, new Discord.Collection);
    var channel = chainChannels.get(message.channel);
    channel.set(message.author.id, message.content);
    chainAuthor = message.author.id;
    return channel
}

// Handles all messages (auto responses & commands)
function handleCommand(message, commandName, args){

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
