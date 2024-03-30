import { MapPoint } from "../../domain";
import { SceneEventBus } from "../../event-buses";
import { IState } from "../../infrastructure";
export declare class MapContext {
    private _state;
    private _sceneEventBus;
    constructor(_state: IState, _sceneEventBus: SceneEventBus);
    goToPoint(point: MapPoint): void;
}
