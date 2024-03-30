import { Root } from "react-dom/client";
export declare class BattleScenePresenter {
    private _root;
    private _handCards;
    private _selectedCards;
    private _moveCards;
    private constructor();
    static create(root: Root): BattleScenePresenter;
    private onHandCardClick;
    private onMoveCardClick;
    private onRunClick;
    private render;
}
