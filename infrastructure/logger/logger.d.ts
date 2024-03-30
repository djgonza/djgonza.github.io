export declare enum LoggerColors {
    Black = "\u001B[30m%s\u001B[0m",
    Red = "\u001B[31m%s\u001B[0m",
    Green = "\u001B[32m%s\u001B[0m",
    Yellow = "\u001B[33m%s\u001B[0m",
    Blue = "\u001B[34m%s\u001B[0m",
    Magenta = "\u001B[35m%s\u001B[0m",
    Cyan = "\u001B[36m%s\u001B[0m",
    LightGray = "\u001B[37m%s\u001B[0m",
    DarkGray = "\u001B[90m%s\u001B[0m",
    LightRed = "\u001B[91m%s\u001B[0m",
    LightGreen = "\u001B[92m%s\u001B[0m",
    LightYellow = "\u001B[93m%s\u001B[0m",
    LightBlue = "\u001B[94m%s\u001B[0m",
    LightMagenta = "\u001B[95m%s\u001B[0m",
    LightCyan = "\u001B[96m%s\u001B[0m",
    White = "\u001B[97m%s\u001B[0m",
    BG_Black = "\u001B[40m%s\u001B[0m",
    BG_Red = "\u001B[41m%s\u001B[0m",
    BG_Green = "\u001B[42m%s\u001B[0m",
    BG_Yellow = "\u001B[43m%s\u001B[0m",
    BG_Blue = "\u001B[44m%s\u001B[0m",
    BG_Magenta = "\u001B[45m%s\u001B[0m",
    BG_Cyan = "\u001B[46m%s\u001B[0m",
    BG_LightGray = "\u001B[47m%s\u001B[0m",
    BG_DarkGray = "\u001B[100m%s\u001B[0m",
    BG_LightRed = "\u001B[101m%s\u001B[0m",
    BG_LightGreen = "\u001B[102m%s\u001B[0m",
    BG_LightYellow = "\u001B[103m%s\u001B[0m",
    BG_LightBlue = "\u001B[104m%s\u001B[0m",
    BG_LightMagenta = "\u001B[105m%s\u001B[0m",
    BG_LightCyan = "\u001B[106m%s\u001B[0m",
    BG_White = "\u001B[107m%s\u001B[0m"
}
export declare class Logger {
    private _show;
    logRed(message: string, ...data: unknown[]): void;
    logGreen(message: string, ...data: unknown[]): void;
    logYellow(message: string, ...data: unknown[]): void;
    logBlue(message: string, ...data: unknown[]): void;
    logMagenta(message: string, ...data: unknown[]): void;
    logCyan(message: string, ...data: unknown[]): void;
    logWhite(message: string, ...data: unknown[]): void;
    logGray(message: string, ...data: unknown[]): void;
    logEvent(message: string, ...data: unknown[]): void;
    logValidation(message: string, ...data: unknown[]): void;
    logInfo(message: string, ...data: unknown[]): void;
    logError(message: string, ...data: unknown[]): void;
    showLogs(show: boolean): void;
    private log;
}
