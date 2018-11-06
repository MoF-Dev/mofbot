import {Message} from "discord.js";
import {prefix} from "../configuration.json";
import AbstractCommand from "./AbstractCommand";
import MoFClient from "./MoFClient";

export default class HelpCommand extends AbstractCommand {
    public constructor(client: MoFClient) {
        // TODO require args or not?
        super(client,
            "help",
            "List all of my commands or info about a specific command.",
            false,
            ["commands"],
            "[command name]",
            5);
    }

    public execute(message: Message, args: string[]) {
        const data = [];

        if (!args.length) {
            data.push("Here's a list of all my commands:");
            data.push(this.client.commands.map((c) => c.name).join(", "));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            return message.author.send(data, {split: true})
                .then(() => {
                    if (message.channel.type === "dm") { return; }
                    message.reply("I've sent you a DM with all my commands!");
                })
                .catch((error) => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply("it seems like I can't DM you! Do you have DMs disabled?");
                });
        }
        const name = args[0].toLowerCase();
        const command = this.client.commands.get(name) || this.client.commands.find((c) =>
            c !== null && c.aliases !== undefined
            && c.aliases.includes(name));

        if (!command) {
            return message.reply("that's not a valid command");
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) { data.push(`**Aliases:** ${command.aliases.join(", ")}`); }
        if (command.description) { data.push(`**Description:** ${command.description}`); }
        if (command.usage) { data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`); }

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, {split: true});
    }
}
