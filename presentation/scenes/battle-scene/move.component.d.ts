import React from "react";
export interface MoveComponentProps {
    cards: string[];
    onMoveCardClick: (move: string) => void;
}
export declare function MoveComponent(props: MoveComponentProps): React.ReactElement;
