import React from "react";
import { CardPlayResult } from "../../../domain/battle";
export interface ScoreBordComponentProps {
    currentScore: number;
    objetiveScore: number;
    cardsScore: CardPlayResult[];
}
export declare function ScoreBordComponent(props: ScoreBordComponentProps): React.ReactElement;
