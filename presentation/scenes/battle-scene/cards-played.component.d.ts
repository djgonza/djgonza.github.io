import React from "react";
import { Card, CardsScore } from "../../../domain";
export interface CardsPlayedProps {
    cards: Card[];
    cardsScore: CardsScore[];
    onScoreAnimationEnd: () => void;
}
export interface CardsPlayedState {
    currentAnimation: number;
}
export declare class CardsPlayedComponent extends React.Component<CardsPlayedProps, CardsPlayedState> {
    private _animationsManager;
    constructor(props: CardsPlayedProps);
    componentDidMount(): void;
    render(): React.ReactNode;
}
