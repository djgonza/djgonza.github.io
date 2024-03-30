import { Card } from "../../deck/cards/card";
import { CardPlayType } from "./card-play-type.enum";
export type CardPlayResult = {
    cards: Card[];
    points: number;
    multiplier: number;
    play: CardPlayType;
};
export declare abstract class ICardPlay {
    name: CardPlayType;
    static create: ICardPlay;
    abstract isPlayable(cards: Card[]): boolean;
    abstract play(cards: Card[]): CardPlayResult;
}
