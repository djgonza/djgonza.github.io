import { Identifier, Newable } from "diod";
import "reflect-metadata";
export declare class Injector {
    private static _instance;
    private _builder;
    private _container;
    private constructor();
    static get instance(): Injector;
    static addTransient<T extends U, U>(newable: Newable<T>, identifier?: Identifier<U>): Injector;
    static addScoped<T extends U, U>(newable: Newable<T>, identifier?: Identifier<U>): Injector;
    static addSingleton<T extends U, U>(newable: Newable<T>, identifier?: Identifier<U>): Injector;
    static build(): void;
    addTransient<T extends U, U>(newable: Newable<T>, identifier?: Identifier<U>): Injector;
    addScoped<T extends U, U>(newable: Newable<T>, identifier?: Identifier<U>): Injector;
    addSingleton<T extends U, U>(newable: Newable<T>, identifier?: Identifier<U>): Injector;
    build(): void;
    static get<T>(identifier: Identifier<T>): T;
    get<T>(identifier: Identifier<T>): T;
    private register;
    private isInitialized;
}
