import { Event } from "../../infrastructure";
export declare class ChangeSceneEvent extends Event {
    static create(payload: JSON): ChangeSceneEvent;
}
