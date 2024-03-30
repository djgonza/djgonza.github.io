import { Entity, Guid } from "../../../infrastructure";
import { CardType } from "./card.type";
export declare class Card extends Entity {
    private _number;
    get number(): number;
    private _type;
    get type(): CardType;
    private constructor();
    static create(id: Guid, type: CardType, number: number): Card;
}
