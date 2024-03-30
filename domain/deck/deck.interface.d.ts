import { Entity } from "../../infrastructure";
import { Card } from "./cards/card";
export declare abstract class IDeck extends Entity {
    abstract name: string;
    abstract unplayedCards: Array<Card>;
    abstract playedCards: Array<Card>;
    abstract handCards: Array<Card>;
    abstract discardedCards: Array<Card>;
    abstract selectedCards: Array<Card>;
    abstract playablesHands: number;
    abstract playablesDiscards: number;
    abstract lastPlayedCards: Array<Card>;
    static create: IDeck;
    abstract init(): void;
    abstract shuffle(): void;
    abstract selectCard(card: Card): void;
    abstract discardSelectedCards(): void;
    abstract playSelectedCards(): void;
    abstract takeCardsToHand(): void;
    abstract changeHandCardsNumber(handCardsNumber: number): void;
    abstract changeMaxSelectedCardsNumber(maxSelectedCardsNumber: number): void;
}
