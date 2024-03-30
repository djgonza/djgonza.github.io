export type Constructor<T> = new (...args: any[]) => T;
export declare abstract class IConstructor {
    name: string;
    static create: IConstructor;
}
