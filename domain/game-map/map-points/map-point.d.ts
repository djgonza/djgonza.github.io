import { Entity, Guid } from "../../../infrastructure";
import { MapPointType } from "./map-point.type";
export declare class MapPoint extends Entity {
    private _x;
    get x(): number;
    private _y;
    get y(): number;
    private _children;
    get children(): Guid[];
    private _type;
    get type(): MapPointType;
    private _isUnknow;
    get isUnknow(): boolean;
    private _position;
    get position(): {
        top: number;
        left: number;
    };
    protected constructor(id: Guid, x: number, y: number);
    static create(id: Guid, x: number, y: number, ...args: any[]): MapPoint;
    addChild(childId: Guid): void;
    removeChild(childId: Guid): void;
    hasChild(childId: Guid): boolean;
    setType(type: MapPointType): void;
    setUnknow(value: boolean): void;
}
