import { Root } from "react-dom/client";
export declare abstract class IScene {
    abstract load(root: Root): void;
    abstract render(): void;
    abstract dispose(): void;
}
