import {Collection, DMChannel, GroupDMChannel, Message, Snowflake, TextChannel} from "discord.js";
import * as fs from "fs";
import AbstractCommand from "./commands/AbstractCommand";
import MoFClient from "./commands/MoFClient";
import {prefix, token} from "./configuration.json";

if (process.env.NODE_ENV === "development") {
    // tslint:disable-next-line:no-var-requires
    require("source-map-support").install();
}

type ChainChannels = Collection<Snowflake, string>;
type MoFChannels = TextChannel | GroupDMChannel; // DMChannel does not have name, so excluding it

const client = new MoFClient();
const cooldowns = new Collection<string, Collection<Snowflake, number>>();
const chainChannels = new Collection<MoFChannels, Collection<Snowflake, string>>();
let chainAuthor = "";
let chain = false;
let interruptor: Snowflake;

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    import(`./commands/${file}`).then((CommandClass: {
        default: {
            new(client: MoFClient): AbstractCommand,
        },
    }) => {
        const command = new CommandClass.default(client);
        client.commands.set(command.name, command);
    });
    // TODO since this is async, we actually have to wait for this to complete before starting client
}

// Notifies that bot is live
client.on("ready", () => {
    console.log("Ready!");
});

// Handles all errors....for now
client.on("error", console.error);

// Fires when any message is sent in a channel bot is also in
client.on("message", (message) => {
    // Returns if message does not have prefix or if author is a bot
    if (!message.content.startsWith(prefix)) {
        if (message.author.bot) {
            return;
        }
        return autoResponse(message);
    }

    // Splits message by prefix and arguments
    const args = message.content.slice(prefix.length).split(/ +/);
    // TODO so u can't use things like [mofbot args1 "args 2" "args 3"] ?
    const commandName = (args.shift() as string).toLowerCase();
    // Limits bot to testing channel (remove later)
    if (message.channel.type !== "dm" && isBotChannel((message.channel as TextChannel | GroupDMChannel).name)) {
        handleCommand(message, commandName, args);
    } else {
        console.log("Wrong Channel");
    }
});

function autoResponse(message: Message) {
    const msg = message.content.toLowerCase();
    if (msg === "how's life" || msg === "hows life") {
        return message.reply("Fighting~");
    } else if (msg === "why are we here" || msg === "why are we here?") {
        return message.reply("\n:eyes: alright :ear: listen:ear:  up:arrow_up:  kiddo:baby:\nlet :clap: " +
            "me:cowboy:  tell you:boy:   what we're here:point_down:  to do\nwe're :raised_hand:  not here to :b: e" +
            " clowns:clown:  or :b:itches:cry:\nwe're :raised_hand:  not here to play :two: :one:  :grey_question: " +
            "questions:question:  nor do we have the time:alarm_clock:\nso if you got any other dumb:snail:  " +
            "ideas:bulb:  you best get outta:wheelchair:  here:wave: \nwe're here for :one: one reason and :one: one" +
            " reason only:ok_hand: ,\nand that is to :first_place: win:ok_hand:");
    } else {
        checkChain(message);
    }
}

function punish(traitor: Snowflake) {
    // todo
    // traitor.reply("you are a bad person");
}

function chainBrokenMessage(channel: ChainChannels, message: Message) {
    console.log("Chain broken!");
    message.channel.send(`Chain broken by ${message.author.username}! Length: ${channel.array().length}`);
}

function chainCompletedMessage(channel: ChainChannels, message: Message) {
    console.log("Chain completed");
    message.channel.send(`Chain completed by ${message.author.username}! ` +
        `Length: ${channel.array().length}! Author: ${chainAuthor}`);
}

function handleBrokenChain(channel: ChainChannels, message: Message) {
    interruptor = message.author.id;
    if (channel.array().length >= 5) {
        chainCompletedMessage(channel, message);
    } else {
        chainBrokenMessage(channel, message);
        punish(interruptor);
    }
    chain = false;
    chainChannels.set(message.channel as MoFChannels, new Collection());
}

function checkChain(message: Message) {
    // Set channel
    if (!chainChannels.has(message.channel as MoFChannels)) {
        chainChannels.set(message.channel as MoFChannels, new Collection());
    }
    let channel = chainChannels.get(message.channel as MoFChannels) as Collection<Snowflake, string>;

    if (channel === undefined || channel === null) {
        // TODO
        // assert error maybe?
        return;
    }
    if (chain) {
        // repeat author handle
        if (channel.has(message.author.id)) {
            handleBrokenChain(channel, message);
        } else if (channel.get(chainAuthor) !== message.content) {
            handleBrokenChain(channel, message);
        } else if (channel.get(chainAuthor) === message.content) {
            channel.set(message.author.id, message.content);
        }

    } else {
        // nothing in channel, set initial message
        if (!channel.array().length) {
            console.log(`Channel is empty. Adding initial author.`);
            console.log(`Adding ${message.author.username} with message ${message.content}`);
            channel.set(message.author.id, message.content);
            chainAuthor = message.author.id;
        } else if (channel.has(message.author.id)) {
            console.log(`Repeat author found. Creating new channel and updating initial author`);
            channel = resetChannel(message);
        } else if (channel.get(chainAuthor) === message.content) {
            console.log(`Adding ${message.author.username} with message ${message.content}`);
            channel.set(message.author.id, message.content);
        } else {
            console.log(`Message does not match. Creating new channel and updating initial author.`);
            channel = resetChannel(message);
        }
    }

    const cName = (message.channel as MoFChannels).name || "DMChannel";
    if (channel.array().length >= 3) {
        console.log(`${cName} chain formed. Length: ${channel.array().length}`);
        chain = true;
    } else {
        console.log(`${cName} chain not yet formed. Length: ${channel.array().length}`);
    }
}

function resetChannel(message: Message): Collection<Snowflake, string> {
    chainChannels.set(message.channel as MoFChannels, new Collection());
    const channel = chainChannels.get(message.channel as MoFChannels) as Collection<Snowflake, string>;
    // TODO assert(channel!==undefined)
    channel.set(message.author.id, message.content);
    chainAuthor = message.author.id;
    return channel;
}

// Handles all messages (auto responses & commands)
function handleCommand(message: Message, commandName: string, args: string[]) {
    const command = client.commands.get(commandName)
        || client.commands.find((cmd) => cmd.aliases !== null && cmd.aliases !== undefined
            && cmd.aliases.includes(commandName));
    if (!command) {
        return;
    }
    // if command requires args, return if no args
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection<Snowflake, number>());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name)!;
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
        const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before ` +
                `reusing the \`${command.name}\ command.\``);
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("There was an error trying to execute that command");
    }
}

function isBotChannel(str: Snowflake) {
    return str === "bot-friendly";
}

client.login(token).then((loginStatus) => {
    // TODO
    console.log(loginStatus);
}).catch((err) => {
    console.error(err);
})
