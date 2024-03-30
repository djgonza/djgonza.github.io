import { Card } from '../../domain';
export interface CardComponentProps {
    card: Card;
    selected?: boolean;
    onClick?: (card: Card) => void;
}
export declare function CardComponent(props: CardComponentProps): import("react/jsx-runtime").JSX.Element;
