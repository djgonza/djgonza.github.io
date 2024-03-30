import { Event } from '../../infrastructure';
export declare class StateSetedEvent<T> extends Event<T> {
    static create<T>(payload: T): StateSetedEvent<T>;
}
