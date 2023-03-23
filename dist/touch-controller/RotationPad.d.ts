export default RotationPad;
declare class RotationPad {
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
    sendEvent(dx: any, dy: any): void;
    resetHandlePosition(): void;
}
//# sourceMappingURL=RotationPad.d.ts.map