import { Enum } from "..";
import { Subscription } from "../subscriptions";
import { Handler } from "../types/handler";
import { Event } from "./event";
import { IEventBus } from "./event-bus.interface";
export declare abstract class EventBus implements IEventBus {
    private _subscriptions;
    constructor();
    publish<T>(event: Event<T>): void;
    subscribe<Tpayload>(eventType: typeof Event, handler: Handler<Event<Tpayload>>): Subscription;
    subscribeTo<Tpayload>(eventType: typeof Event, payloadType: Function | Enum | string | Array<unknown>, handler: (event: Event<Tpayload>) => void): Subscription;
    subscribeToKeys<Tpayload extends object>(eventType: typeof Event, payloadType: Function, properties: Map<string, unknown>, handler: (event: Event<Tpayload>) => void): Subscription;
    private unsubscribe;
}
