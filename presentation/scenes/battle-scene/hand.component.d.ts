import React from "react";
import { Card } from "../../../domain";
export interface HandComponentProps {
    cards: Card[];
    selectedCards: Card[];
    onCardClick: (card: Card) => void;
}
export declare function HandComponent(props: HandComponentProps): React.ReactElement;
