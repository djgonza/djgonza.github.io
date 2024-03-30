import { Guid } from "./guid";
import { Entity } from "./entity";
export interface IEntityList<IEntity extends Entity> {
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
    size: number;
}
