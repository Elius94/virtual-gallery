export default g;
declare class g {
    constructor({ parent: t, autoPlace: i, container: e, width: s, title: n, injectStyles: l, touchStyles: r }?: {
        parent: any;
        autoPlace?: boolean | undefined;
        container: any;
        width: any;
        title?: string | undefined;
        injectStyles?: boolean | undefined;
        touchStyles?: boolean | undefined;
    });
    parent: any;
    root: any;
    children: any[];
    controllers: any[];
    folders: any[];
    _closed: boolean;
    _hidden: boolean;
    domElement: HTMLDivElement;
    $title: HTMLDivElement;
    $children: HTMLDivElement;
    add(t: any, e: any, s: any, n: any, l: any): i | h | d | c | u | undefined;
    addColor(t: any, i: any, e?: number): a;
    addFolder(t: any): g;
    load(t: any, i?: boolean): g;
    save(t?: boolean): {
        controllers: {};
        folders: {};
    };
    open(t?: boolean): g;
    close(): g;
    show(t?: boolean): g;
    hide(): g;
    openAnimated(t?: boolean): g;
    title(t: any): g;
    _title: any;
    reset(t?: boolean): g;
    onChange(t: any): g;
    _onChange: any;
    _callOnChange(t: any): void;
    onFinishChange(t: any): g;
    _onFinishChange: any;
    _callOnFinishChange(t: any): void;
    destroy(): void;
    controllersRecursive(): any[];
    foldersRecursive(): any[];
}
declare class i extends t {
    constructor(t: any, i: any, e: any);
    $input: HTMLInputElement;
    $disable: HTMLInputElement;
    updateDisplay(): i;
}
declare class a extends t {
    constructor(t: any, i: any, s: any, n: any);
    $input: HTMLInputElement;
    $text: HTMLInputElement;
    $display: HTMLDivElement;
    _format: {
        isPrimitive: boolean;
        match: (t: any) => boolean;
        fromHexString: typeof e;
        toHexString: typeof e;
    } | {
        isPrimitive: boolean;
        match: (arg: any) => arg is any[];
        fromHexString(t: any, i: any, e?: number): void;
        toHexString: ([t, i, e]: [any, any, any], s?: number) => string;
    } | {
        isPrimitive: boolean;
        match: (t: any) => boolean;
        fromHexString(t: any, i: any, e?: number): void;
        toHexString: ({ r: t, g: i, b: e }: {
            r: any;
            g: any;
            b: any;
        }, s?: number) => string;
    } | undefined;
    _rgbScale: any;
    _initialValueHexString: string | false;
    _textFocused: boolean;
    $disable: HTMLInputElement;
    reset(): a;
    _setValueFromHexString(t: any): void;
    save(): string | false;
    load(t: any): a;
    updateDisplay(): a;
}
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.17.0
 * @author George Michael Brower
 * @license MIT
 */
declare class t {
    constructor(i: any, e: any, s: any, n: any, l?: string);
    parent: any;
    object: any;
    property: any;
    _disabled: boolean;
    _hidden: boolean;
    initialValue: any;
    domElement: HTMLDivElement;
    $name: HTMLDivElement;
    $widget: HTMLElement;
    $disable: HTMLElement;
    _listenCallback(): void;
    name(t: any): t;
    _name: any;
    onChange(t: any): t;
    _onChange: any;
    _callOnChange(): void;
    _changed: boolean | undefined;
    onFinishChange(t: any): t;
    _onFinishChange: any;
    _callOnFinishChange(): void;
    reset(): t;
    enable(t?: boolean): t;
    disable(t?: boolean): t;
    show(t?: boolean): t;
    hide(): t;
    options(t: any): any;
    min(t: any): t;
    max(t: any): t;
    step(t: any): t;
    decimals(t: any): t;
    listen(t?: boolean): t;
    _listening: boolean | undefined;
    _listenCallbackID: number | undefined;
    _listenPrevValue: any;
    getValue(): any;
    setValue(t: any): t;
    updateDisplay(): t;
    load(t: any): t;
    save(): any;
    destroy(): void;
}
declare class h extends t {
    constructor(t: any, i: any, e: any);
    $button: HTMLButtonElement;
    $disable: HTMLButtonElement;
}
declare class d extends t {
    constructor(t: any, i: any, e: any, s: any, n: any, l: any);
    decimals(t: any): d;
    _decimals: any;
    min(t: any): d;
    _min: any;
    max(t: any): d;
    _max: any;
    step(t: any, i?: boolean): d;
    _step: any;
    _stepExplicit: boolean | undefined;
    updateDisplay(): d;
    _initInput(): void;
    $input: HTMLInputElement | undefined;
    _inputFocused: boolean | undefined;
    _initSlider(): void;
    _hasSlider: boolean | undefined;
    $slider: HTMLDivElement | undefined;
    $fill: HTMLDivElement | undefined;
    _setDraggingStyle(t: any, i?: string): void;
    _getImplicitStep(): number;
    _onUpdateMinMax(): void;
    _normalizeMouseWheel(t: any): any;
    _arrowKeyMultiplier(t: any): number;
    _snap(t: any): number;
    _clamp(t: any): any;
    _snapClampSetValue(t: any): void;
    get _hasScrollBar(): boolean;
    get _hasMin(): boolean;
    get _hasMax(): boolean;
}
declare class c extends t {
    constructor(t: any, i: any, e: any, s: any);
    $select: HTMLSelectElement;
    $display: HTMLDivElement;
    _values: any[];
    _names: any[];
    $disable: HTMLSelectElement;
    updateDisplay(): c;
}
declare class u extends t {
    constructor(t: any, i: any, e: any);
    $input: HTMLInputElement;
    $disable: HTMLInputElement;
    updateDisplay(): u;
}
declare function e(t: any): string | false;
export { i as BooleanController, a as ColorController, t as Controller, h as FunctionController, g as GUI, d as NumberController, c as OptionController, u as StringController };
//# sourceMappingURL=lil-gui.module.min.d.ts.map