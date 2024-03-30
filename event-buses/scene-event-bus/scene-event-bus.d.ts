import { EventBus, IEventBus } from "../../infrastructure";
export declare class SceneEventBus extends EventBus implements IEventBus {
    static create(): SceneEventBus;
}
