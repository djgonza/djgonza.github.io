import { Event } from "../../../infrastructure";
export declare class ChangedSceneEvent<T> extends Event<T> {
    static create<T>(payload: T): ChangedSceneEvent<T>;
}
