import { CardPlay } from "./card-play";
import { ICardPlay } from "./card-play.interface";
export declare class FourOfAKind extends CardPlay implements ICardPlay {
    static create(): FourOfAKind;
    isPlayable(cards: any): boolean;
    play(cards: any): import("./card-play.interface").CardPlayResult;
}
