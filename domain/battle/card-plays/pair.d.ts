import { Card } from "../../deck/cards/card";
import { CardPlay } from "./card-play";
import { ICardPlay } from "./card-play.interface";
export declare class Pair extends CardPlay implements ICardPlay {
    static create(): Pair;
    isPlayable(cards: Card[]): boolean;
    play(cards: Card[]): import("./card-play.interface").CardPlayResult;
}
