import { CardPlay } from "./card-play";
import { ICardPlay } from "./card-play.interface";
export declare class DoublePair extends CardPlay implements ICardPlay {
    static create(): DoublePair;
    isPlayable(cards: any): any;
    play(cards: any): import("./card-play.interface").CardPlayResult;
}
