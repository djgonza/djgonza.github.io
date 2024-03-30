import { Entity } from "../../infrastructure";
import { Card } from "../deck/cards/card";
import { BattleMapPoint } from "../game-map/map-points/battle-map-point";
import { CardPlay, CardPlayResult } from "./card-plays";
export declare class BattleScoreManager extends Entity {
    private _cardPlays;
    get cardPlays(): CardPlay[];
    private _score;
    get score(): number;
    private _objetiveScore;
    get objetiveScore(): number;
    private _remainingActions;
    get remainingActions(): number;
    private _remainingDiscards;
    get remainingDiscards(): number;
    private constructor();
    static create(): BattleScoreManager;
    setCardPlay(cardPlay: CardPlay): void;
    init(battlePoint: BattleMapPoint): void;
    run(cards: Card[]): CardPlayResult[];
    downRemainingDiscards(): void;
    private findCardPlays;
    private executeCardPlays;
}
