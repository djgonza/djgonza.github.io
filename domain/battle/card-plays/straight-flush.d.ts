import { Card } from "../../deck/cards/card";
import { CardPlay } from "./card-play";
import { ICardPlay } from "./card-play.interface";
export declare class StraightFlush extends CardPlay implements ICardPlay {
    static create(): StraightFlush;
    isPlayable(cards: Card[]): boolean;
    play(cards: Card[]): import("./card-play.interface").CardPlayResult;
}
