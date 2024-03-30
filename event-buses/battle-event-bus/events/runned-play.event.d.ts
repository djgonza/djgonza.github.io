import { Event } from "../../../infrastructure";
export declare class RunnedPlayEvent<T> extends Event<T> {
    static create<T>(payload: T): RunnedPlayEvent<T>;
}
