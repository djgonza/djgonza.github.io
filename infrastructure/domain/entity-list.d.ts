import { Guid } from "./guid";
import { Entity } from "./entity";
import { IEntityList } from "./entity-list.interface";
export declare class EntityList<IEntity extends Entity> implements IEntityList<IEntity> {
    private _entities;
    private constructor();
    static create<IEntity extends Entity>(): EntityList<IEntity>;
    static createFrom<IEntity extends Entity>(entities: IEntity[]): EntityList<IEntity>;
    contains(entityId: Guid): boolean;
    getAll(): IEntity[];
    getFirst(): IEntity | null;
    getById(entityId: Guid): IEntity | null;
    getByIdOrThrow(entityId: Guid): IEntity;
    find(predicate: (entity: IEntity) => boolean): IEntity | null;
    findOrThrow(predicate: (entity: IEntity) => boolean): IEntity;
    filter(predicate: (entity: IEntity) => boolean): IEntity[];
    set(entity: IEntity): boolean;
    setAll(entities: IEntity[]): void;
    remove(entityId: Guid): boolean;
    clear(): void;
    get size(): number;
}
