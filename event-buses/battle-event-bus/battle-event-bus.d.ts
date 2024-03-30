import { EventBus, IEventBus } from "../../infrastructure";
export declare class BattleEventBus extends EventBus implements IEventBus {
    static create(): BattleEventBus;
}
