import { Card } from '../../domain';
export interface AnimatedCardComponentProps {
    card: Card;
    animations?: string[];
    score?: number;
}
export declare function AnimatedCardComponent(props: AnimatedCardComponentProps): import("react/jsx-runtime").JSX.Element;
