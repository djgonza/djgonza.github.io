export declare enum AnimationsCssVars {
    AnimationsVelocity = "--animations-velocity"
}
export declare class AnimationsManager {
    private _animationsVelocity;
    constructor();
    static create(): AnimationsManager;
    setVelocity(velocity: number): void;
    addVelocity(): void;
    getVelocity(): number;
    getAnimationsDuration(element: HTMLElement): number | undefined;
}
