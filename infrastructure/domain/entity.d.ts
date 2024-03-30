import { Guid } from "./guid";
export declare abstract class Entity {
    private _id;
    get id(): Guid;
    protected constructor(id: Guid);
    equals(entity: Entity): boolean;
    clone<T extends Entity>(): T;
}
