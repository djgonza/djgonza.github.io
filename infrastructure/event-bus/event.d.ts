import { Guid } from "..";
import { IConstructor } from "../types";
export declare class Event<T> extends IConstructor {
    private _id;
    get id(): Guid;
    private _payload;
    get payload(): T;
    private _occurredOn;
    get occurredOn(): Date;
    protected constructor(payload: T);
}
