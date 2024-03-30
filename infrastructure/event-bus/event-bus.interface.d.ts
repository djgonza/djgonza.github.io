import { Subscription } from "../subscriptions";
import { Handler } from "../types";
import { Event } from "./event";
export interface IEventBus {
    publish<T>(event: Event<T>): void;
    subscribe<Tpayload>(eventType: typeof Event, handler: Handler<Event<Tpayload>>): Subscription;
    subscribeTo<Tpayload>(eventType: typeof Event, payloadType: Function, handler: (event: Event<Tpayload>) => void): Subscription;
    subscribeToKeys<Tpayload extends object>(eventType: typeof Event, payloadType: Function, properties: Map<string, unknown>, handler: (event: Event<Tpayload>) => void): Subscription;
}
