export declare class Guid {
    private _value;
    private constructor();
    static newGuid(): Guid;
    static parse(guid: string): Guid;
    toString(): string;
    equals(guid: Guid): boolean;
}
