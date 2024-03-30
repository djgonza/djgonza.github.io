import { Root } from "react-dom/client";
import { IScene } from "../scene.interface";
import { IState } from "../../../infrastructure";
import { SceneEventBus } from "../../../event-buses/scene-event-bus/index";
import { MapContext } from "../../../application";
export declare class MapScene implements IScene {
    private _sceneEventBus;
    private _state;
    private _mapContext;
    private _map;
    private _root;
    private _subscriptions;
    constructor(_sceneEventBus: SceneEventBus, _state: IState, _mapContext: MapContext);
    private changeCurrentPoint;
    load(root: Root): void;
    render(): void;
    dispose(): void;
}
