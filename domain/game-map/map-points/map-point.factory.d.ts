import { BattleMapPoint, MapPoint, ShopMapPoint } from ".";
import { Guid } from "../../../infrastructure";
export declare class MapPointFactory {
    static createBattleMapPoint(id: Guid, x: number, y: number, playablesHands: number, playablesDiscards: number, objectiveScore: number, reward: number): BattleMapPoint;
    static createShopMapPoint(id: Guid, x: number, y: number): ShopMapPoint;
    static createShopMapPointFromPoint(point: MapPoint): ShopMapPoint;
}
