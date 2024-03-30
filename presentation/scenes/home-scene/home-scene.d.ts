import { Root } from "react-dom/client";
import { IScene } from "../scene.interface";
import { SceneEventBus } from "../../../event-buses/scene-event-bus";
import { GameContext } from "../../../application";
export declare class HomeScene implements IScene {
    private _sceneEventBus;
    private _gameContext;
    private _root;
    constructor(_sceneEventBus: SceneEventBus, _gameContext: GameContext);
    load(root: Root): void;
    private startGame;
    render(): void;
    dispose(): void;
}
