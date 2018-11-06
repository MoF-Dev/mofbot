import {Message} from "discord.js";
import MoFClient from "./MoFClient";

export default abstract class AbstractCommand {
    public readonly name: string;
    public readonly description: string;
    public readonly args: boolean;
    public readonly aliases?: string[];
    public readonly usage?: string;
    public readonly cooldown?: number;
    public readonly client: MoFClient;

    protected constructor(client: MoFClient,
                          name: string,
                          description: string,
                          args: boolean,
                          aliases?: string[],
                          usage?: string,
                          cooldown?: number) {
        this.client = client;
        this.name = name;
        this.description = description;
        this.args = args;
        this.aliases = aliases;
        this.usage = usage;
        this.cooldown = cooldown;
    }

    public abstract execute(message: Message, args: string[]): any;
}
