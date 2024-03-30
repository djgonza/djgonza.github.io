import { Card } from "../../deck/cards/card";
import { CardPlay } from "./card-play";
import { ICardPlay } from "./card-play.interface";
export declare class ThreeOfAKind extends CardPlay implements ICardPlay {
    static create(): ThreeOfAKind;
    isPlayable(cards: Card[]): boolean;
    play(cards: Card[]): import("./card-play.interface").CardPlayResult;
}
