import { Event } from "..";
import { Entity, Guid } from "../domain";
import { Subscription } from "../subscriptions";
import { IConstructor } from "../types";
import { StateSetedEvent } from "./state-seted-event";
export declare abstract class IState {
    abstract subscribe<Tpayload>(eventType: typeof Event, handler: (event: StateSetedEvent<Tpayload>) => void): Subscription;
    abstract subscribeTo<Tpayload>(eventType: typeof Event, payloadType: Function, handler: (event: StateSetedEvent<Tpayload>) => void): Subscription;
    abstract subscribeToKeys<Tpayload extends object>(eventType: typeof Event, payloadType: Function, properties: Map<string, unknown>, handler: (event: StateSetedEvent<Tpayload>) => void): Subscription;
    abstract set<T extends Entity>(entity: T, baseEntity?: IConstructor): void;
    abstract setSingle<T extends Entity>(entity: T, baseEntity?: IConstructor): void;
    abstract get<T extends Entity>(entityType: IConstructor): T | undefined;
    abstract getOrThrow<T extends Entity>(entityType: IConstructor): T;
    abstract getById<T extends Entity>(entityType: IConstructor, id: Guid): T | undefined;
    abstract getByIdOrThrow<T extends Entity>(entityType: IConstructor, id: Guid): T;
    abstract getAll<T extends Entity>(entityType: IConstructor): T[];
    abstract remove(entityType: IConstructor, id: Guid): void;
    abstract find<T extends Entity>(entityType: IConstructor, predicate: (entity: T) => boolean): T | undefined;
    abstract findOrThrow<T extends Entity>(entityType: IConstructor, predicate: (entity: T) => boolean): T;
    abstract filter<T extends Entity>(entityType: IConstructor, predicate: (entity: T) => boolean): T[];
    abstract filterOrThrow<T extends Entity>(entityType: IConstructor, predicate: (entity: T) => boolean): T[];
}
