export default MovementPad;
declare class MovementPad {
    constructor(container: any);
    container: any;
    padElement: HTMLDivElement;
    region: HTMLDivElement;
    handle: HTMLDivElement;
    eventRepeatTimeout: any;
    regionData: {};
    handleData: {};
    mouseDown: boolean;
    mouseStopped: boolean;
    alignAndConfigPad(canvas: any): void;
    update(pageX: any, pageY: any): void;
    sendEvent(dx: any, dy: any, middle: any): void;
    resetHandlePosition(): void;
}
//# sourceMappingURL=MovementPad.d.ts.map