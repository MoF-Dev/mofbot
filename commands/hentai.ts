import {Message} from "discord.js";
import AbstractCommand from "./AbstractCommand";
import MoFClient from "./MoFClient";

export default class HentaiCommand extends AbstractCommand {
    public constructor(client: MoFClient) {
        super(client,
            "hentai",
            "Reveals the extent to which a man will go for his passion.",
            false);
    }

    public execute(message: Message, args: string[]) {
        message.channel.send("I :heart: love :heart: you. My dream is to :nerd: study Japanese :flag_jp: :joy: :joy:" +
            ", so I can become a :moneybag: successful :money_mouth: hentai :flushed: :heart_eyes:  artist. I hope " +
            "you will support :weary: me in my :hugging:  endeavors :ok_hand: :ok_hand: . My ulterior motive for " +
            "playing :video_game: osu! :video_game: is so that I can train my :point_right: right hand :hand_splayed:" +
            " to have :boom: outstanding :boom: stamina. With my :muscle: awesome stamina :muscle:  I can draw hentai" +
            " :two_hearts: :relaxed: for :alarm_clock: many hours straight :alarm_clock: without having my hands hurt" +
            " :fist: :eggplant: :sweat_drops:. This is to meet deadlines :wink:. Yes, I have a :cupid: ever growing" +
            " passion :heartpulse: for hentai. My love for :kissing_heart: hentai :flushed: was derived from my" +
            " obsession for :stuck_out_tongue_closed_eyes: romance :kissing_closed_eyes:. When I was about :six: or " +
            ":seven:, :point_right: :information_desk_person: my sister borrowed a :book: manga :heart_eyes: from the" +
            " public library :classical_building:. It was a :cupid: romance between a manga artist and her :vs: " +
            "friend/manager :hushed:. Ever since I have :nerd: read that manga :books:, I knew what I wanted to do " +
            "with my life :grimacing:. I remember that page so :ok_hand: vividly:ok_hand: :ok_hand:. There were " +
            ":couplekiss: kissing :flushed: and the artist :art: was amazing :thumbsup: :thumbsup: it was like I " +
            "felt the warmth :sunny: radiating from the strong sense of love :heartpulse:. I decided :tired_face: I " +
            "also want to be able to make people to feel :smirk: the way I felt :blush: when I read that manga " +
            ":point_left: :book: . I want people to feel :sun_with_face:  warmth and loved :heart_eyes:.\n- " +
            "Manasith908 (December 02, 2012)");
    }
}
