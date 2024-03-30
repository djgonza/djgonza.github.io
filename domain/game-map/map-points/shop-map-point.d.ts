import { MapPoint, MapPointType } from ".";
import { Guid } from "../../../infrastructure";
export declare class ShopMapPoint extends MapPoint {
    get type(): MapPointType;
    static create(id: Guid, x: number, y: number): ShopMapPoint;
}
