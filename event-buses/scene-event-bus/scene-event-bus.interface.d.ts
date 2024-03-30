import { Constructor, Event, Handler, IEventBus, Subscription } from "../../infrastructure";
export declare abstract class ISceneEventBus implements IEventBus {
    abstract publish(event: Event): void;
    abstract subscribe<T extends Event>(eventType: Constructor<T>, handler: Handler<T>): Subscription;
}
