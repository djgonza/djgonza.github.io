import { EventBus, IEventBus } from "..";
export declare class StateEventBus extends EventBus implements IEventBus {
    static create(): StateEventBus;
}
