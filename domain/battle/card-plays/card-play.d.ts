import { Entity } from "../../../infrastructure";
import { Card } from "../../deck/cards/card";
import { CardPlayType } from "./card-play-type.enum";
import { CardPlayResult, ICardPlay } from "./card-play.interface";
export declare abstract class CardPlay extends Entity implements ICardPlay {
    protected _points: number;
    protected _multiplier: number;
    protected _level: number;
    get level(): number;
    protected _name: CardPlayType;
    get name(): CardPlayType;
    abstract isPlayable(cards: Card[]): boolean;
    protected constructor(name: CardPlayType, points: number, multiplier: number, level: number);
    addLevel(): void;
    play(cards: Card[]): CardPlayResult;
}
