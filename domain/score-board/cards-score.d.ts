import { Card } from "../deck/cards/card";
export declare class CardsScore {
    private _playName;
    get playName(): string;
    private _cards;
    get cards(): Card[];
    private _points;
    get points(): number;
    private _multiplier;
    get multiplier(): number;
    private constructor();
    static create(playName: string, cards: Card[], points: number, multiplier: number): CardsScore;
}
