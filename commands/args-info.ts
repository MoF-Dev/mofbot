import {Message} from "discord.js";
import AbstractCommand from "./AbstractCommand";
import MoFClient from "./MoFClient";

export default class ArgsInfo extends AbstractCommand {
    public constructor(client: MoFClient) {
        super(client,
            "args-info",
            "Information about the arguments provided.",
            true);
    }

    public execute(message: Message, args: string[]) {
        if (args[0] === "foo") {
            return message.channel.send("bar");
        }
        return message.channel.send(`Arguments ${args}\nArguments length: ${args.length}`);
    }
}
