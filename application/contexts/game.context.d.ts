import { CardPlay } from "../../domain/battle";
import { DeckType } from "../../domain/deck";
import { IState } from "../../infrastructure";
export declare class GameContext {
    private _state;
    constructor(_state: IState);
    newRun(deckType: DeckType): void;
    addCardPlay(cardPlay: CardPlay): void;
}
