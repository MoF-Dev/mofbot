import {Client, Collection} from "discord.js";
import AbstractCommand from "./AbstractCommand";

export default class MoFClient extends Client {
    public readonly commands = new Collection<string, AbstractCommand>();
}
