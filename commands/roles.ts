import {Message} from "discord.js";
import AbstractCommand from "./AbstractCommand";
import MoFClient from "./MoFClient";

export default class RolesCommand extends AbstractCommand {
    public constructor(client: MoFClient) {
        super(client,
            "roles",
            "Displays roles target user has.",
            true,
            [],
            "<user>");
    }

    public execute(message: Message, args: string[]) {
        if (!message.mentions.users) {
            return;
        }
        const user = message.mentions.members.first() as any;
        let roles = "";
        // TODO _roles does exist?
        for (const role of user._roles) {
            const myRole = message.guild.roles.get(role);
            roles += `${myRole}, `;
        }
        roles = roles.substring(0, roles.length - 2);
        message.channel.send(`User ${user.user} has role(s): ${roles}`);
    }
}
