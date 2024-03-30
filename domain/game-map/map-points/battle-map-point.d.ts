import { MapPointType } from ".";
import { Guid } from "../../../infrastructure";
import { MapPoint } from "./map-point";
export declare class BattleMapPoint extends MapPoint {
    get type(): MapPointType;
    private _objectiveScore;
    get objectiveScore(): number;
    private _playablesHands;
    get playablesHands(): number;
    private _playablesDiscards;
    get playablesDiscards(): number;
    private _reward;
    get reward(): number;
    private constructor();
    static create(id: Guid, x: number, y: number, playablesHands: number, playablesDiscards: number, objectiveScore: number): BattleMapPoint;
}
