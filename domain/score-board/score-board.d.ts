import { Entity } from "../../infrastructure";
import { Card } from "../deck/cards/card";
import { CardsScore } from "./cards-score";
export declare class ScoreBoard extends Entity {
    private _objetiveScore;
    get objetiveScore(): number;
    private _score;
    get score(): number;
    private constructor();
    static create(score: number): ScoreBoard;
    countCardsScore(cards: Card[]): Array<CardsScore>;
}
