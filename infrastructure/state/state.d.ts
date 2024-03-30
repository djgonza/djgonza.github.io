import { Entity, Event, Guid, IConstructor, Logger, Subscription } from "..";
import { StateSetedEvent } from "./state-seted-event";
import { IState } from "./state.interface";
export declare class State implements IState {
    private _logger;
    private _entities;
    private _singlesEntities;
    private _eventBus;
    constructor(_logger: Logger);
    subscribe<Tpayload>(eventType: typeof Event, handler: (event: StateSetedEvent<Tpayload>) => void): Subscription;
    subscribeTo<Tpayload>(eventType: typeof Event, payloadType: Function, handler: (event: StateSetedEvent<Tpayload>) => void): Subscription;
    subscribeToKeys<Tpayload extends object>(eventType: typeof Event, payloadType: Function, properties: Map<string, unknown>, handler: (event: StateSetedEvent<Tpayload>) => void): Subscription;
    set<T extends Entity>(entity: T, baseEntity?: IConstructor): void;
    setSingle<T extends Entity>(entity: T, baseEntity?: IConstructor): void;
    get<T extends Entity>(entityType: IConstructor): T | undefined;
    getOrThrow<T extends Entity>(entityType: IConstructor): T;
    getById<T extends Entity>(entityType: IConstructor, id: Guid): T | undefined;
    getByIdOrThrow<T extends Entity>(entityType: IConstructor, id: Guid): T;
    getAll<T extends Entity>(entityType: IConstructor): T[];
    remove(entityType: IConstructor, id: Guid): void;
    find<T extends Entity>(entityType: IConstructor, predicate: (entity: T) => boolean): T | undefined;
    findOrThrow<T extends Entity>(entityType: IConstructor, predicate: (entity: T) => boolean): T;
    filter<T extends Entity>(entityType: IConstructor, predicate: (entity: T) => boolean): T[];
    filterOrThrow<T extends Entity>(entityType: IConstructor, predicate: (entity: T) => boolean): T[];
}
