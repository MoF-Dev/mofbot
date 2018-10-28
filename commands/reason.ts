import {Message} from "discord.js";
import AbstractCommand from "./AbstractCommand";
import MoFClient from "./MoFClient";

export default class ReasonCommand extends AbstractCommand {
    public constructor(client: MoFClient) {
        super(client,
            "reason",
            "What are we here for?",
            false);
    }

    public execute(message: Message, args: string[]) {
        message.channel.send(":eyes: alright :ear: listen:ear:  up:arrow_up:  kiddo:baby:\nlet :clap: me:cowboy:  " +
            "tell you:boy:   what we're here:point_down:  to do\nwe're :raised_hand:  not here to :b: e " +
            "clowns:clown:  or :b:itches:cry:\nwe're :raised_hand:  not here to play :two: :one:  :grey_question:" +
            " questions:question:  nor do we have the time:alarm_clock:\nso if you got any other dumb:snail:  " +
            "ideas:bulb:  you best get outta:wheelchair:  here:wave: \nwe're here for :one: one reason and :one: " +
            "one reason only:ok_hand: ,\nand that is to :first_place: win:ok_hand:");
    }
}
