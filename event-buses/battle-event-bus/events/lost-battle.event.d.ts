import { Event } from "../../../infrastructure";
export declare class LostBattleEvent<T> extends Event<T> {
    static create<T>(payload: T): LostBattleEvent<T>;
}
