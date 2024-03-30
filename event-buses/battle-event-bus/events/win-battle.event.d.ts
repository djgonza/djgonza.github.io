import { Event } from "../../../infrastructure";
export declare class WinBattleEvent<T> extends Event<T> {
    static create<T>(payload: T): WinBattleEvent<T>;
}
