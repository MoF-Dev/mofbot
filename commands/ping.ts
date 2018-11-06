import {Message} from "discord.js";
import AbstractCommand from "./AbstractCommand";
import MoFClient from "./MoFClient";

export default class PingCommand extends AbstractCommand {
    public constructor(client: MoFClient) {
        super(client,
            "ping",
            "Pings bot to check if it's online",
            false,
            [],
            "",
            5);
    }

    public execute(message: Message, args: string[]) {
        message.channel.send("Pong.");
    }
}
