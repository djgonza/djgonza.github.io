import { Root } from "react-dom/client";
import { IScene } from "../scene.interface";
import { IState, Logger } from "../../../infrastructure";
import { SceneEventBus } from "../../../event-buses";
import { AnimationsManager } from "../../../animations";
import { BattleContext } from "../../../application";
import { BattleEventBus } from "../../../event-buses";
export declare class BattleScene implements IScene {
    private _logger;
    private _sceneEventBus;
    private _battleEventBus;
    private _animationsManager;
    private _state;
    private _battleContext;
    private _root;
    private _deck;
    private _battleScoreManager;
    private _subscriptions;
    private _playedCards;
    private _battleStatus;
    private _possibleRewards;
    constructor(_logger: Logger, _sceneEventBus: SceneEventBus, _battleEventBus: BattleEventBus, _animationsManager: AnimationsManager, _state: IState, _battleContext: BattleContext);
    load(root: Root): void;
    private onHandCardClick;
    private onDiscardClick;
    private onPlayClick;
    private onScoreAnimationEnd;
    private changeAnimationsVelocity;
    private onRewardsPurchased;
    private onPurchaseCardPlay;
    render(): void;
    dispose(): void;
}