import { Card } from "../../domain";
import { CardPlayType } from "../../domain/battle";
import { BattleEventBus, SceneEventBus } from "../../event-buses";
import { IState } from "../../infrastructure";
export declare class BattleContext {
    private _state;
    private _battleEventBus;
    private _sceneEventBus;
    constructor(_state: IState, _battleEventBus: BattleEventBus, _sceneEventBus: SceneEventBus);
    selectCard(card: Card): void;
    discardSelectedCards(): void;
    run(): void;
    generateRewards(): {
        money: number;
        cardPlays: CardPlayType[];
    };
    purchaseCardPlay(cardPlayType: CardPlayType): void;
    rewardsPurchased(): void;
}
