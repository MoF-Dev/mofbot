import {Message} from "discord.js";
import AbstractCommand from "./AbstractCommand";
import MoFClient from "./MoFClient";

export default class ROTCCommand extends AbstractCommand {
    public constructor(client: MoFClient) {
        super(client,
            "rotc",
            "Explains how to fire a mortar.",
            false);
    }

    public execute(message: Message, args: string[]) {
        message.channel.send("The explosion is pushed in the shell, and the shell is pushed in the mortar." +
            " The mortar is then pushed. The shell fires because the shell; the shell fires. The shell then explodes" +
            ", killing people because of exploding. Then they say gg because etai, but it was ebola.");
    }
}
