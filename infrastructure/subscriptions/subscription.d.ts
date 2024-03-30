import { Event } from "../event-bus";
import { Handler } from "../types";
export declare class Subscription {
    private _handler;
    get handler(): Handler<Event>;
    private _unsubscribeHandler;
    private _hasUnsubscribed;
    private constructor();
    static create<T extends Event>(handler: Handler<T>, unsubscribeHandler: () => void): Subscription;
    unsubscribe(): void;
    invoke(event: Event): void;
}
