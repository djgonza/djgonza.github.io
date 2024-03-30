import { IDeck } from "../deck.interface";
import { DeckType } from "./deck-type";
export declare class DeckFactory {
    static createDeck(type: DeckType): IDeck;
}
