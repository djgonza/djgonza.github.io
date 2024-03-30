import React from "react";
import { MapPoint } from "../../../domain";
export interface MapPointComponentProps {
    mapPoint: MapPoint;
    level: number;
    lastLevel: number;
    currentLevel?: number;
    currentPoint?: MapPoint;
    points: MapPoint[];
    onClick: () => void;
}
export declare function MapPointComponent(props: MapPointComponentProps): React.ReactElement;
