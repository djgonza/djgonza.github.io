import { Deck } from "../deck";
import { IDeck } from "../deck.interface";
export declare class OriginalDeck extends Deck implements IDeck {
    get name(): string;
    private constructor();
    static create(): OriginalDeck;
}
