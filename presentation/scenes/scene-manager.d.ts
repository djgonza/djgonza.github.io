import { SceneEventBus } from "../../event-buses/scene-event-bus";
import { IDisposable, Logger } from "../../infrastructure";
export declare class SceneManager implements IDisposable {
    private _logger;
    private _sceneEventBus;
    private _scene;
    private _root;
    private _subscriptions;
    constructor(_logger: Logger, _sceneEventBus: SceneEventBus);
    private onSceneChange;
    private loadScene;
    dispose(): void;
}
