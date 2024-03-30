import { Logger } from "./logger";
export declare class ViewLogger extends Logger {
    log_OnInit(message: string, ...data: unknown[]): void;
    log_OnDestroy(message: string, ...data: unknown[]): void;
    log_OnChange(message: string, ...data: unknown[]): void;
    log_Render(message: string, ...data: unknown[]): void;
}
