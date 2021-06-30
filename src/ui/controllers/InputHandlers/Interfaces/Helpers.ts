import { InputMod } from "./InputMod";
import { InputHandlerProp } from "./InputHandlerProp";
import { Input } from "./Input";
import { InputType } from "./InputType";

export const keyUp = (key: string, mod?: InputMod):InputHandlerProp => ({
    input: Input.KeyboardUp,
    type: key,
    mod: mod ?? InputMod.DontCare
});

export const keyDown = (key: string, mod?: InputMod):InputHandlerProp => ({
    input: Input.KeyboardDown,
    type: key,
    mod: mod ?? InputMod.DontCare
});

export const keyHold = (key: string, mod?: InputMod):InputHandlerProp => ({
    input: Input.KeyboardHold,
    type: key,
    mod: mod ?? InputMod.DontCare
});

export const wheel = (wheelDir?: InputType, mod?: InputMod):InputHandlerProp => ({
    input: Input.Wheel,
    type: wheelDir ?? InputType.WheelAny,
    mod: mod ?? InputMod.DontCare
});

export const click = (button?: InputType, mod?: InputMod):InputHandlerProp => ({
    input: Input.MouseClick,
    type: button ?? InputType.MouseAny,
    mod: mod ?? InputMod.DontCare
});

export const drag = (button?: InputType, mod?: InputMod):InputHandlerProp => ({
    input: Input.MouseDown,
    type: button ?? InputType.MouseAny,
    mod: mod ?? InputMod.DontCare
});

export const drop = (button?: InputType, mod?: InputMod):InputHandlerProp => ({
    input: Input.MouseUp,
    type: button ?? InputType.MouseAny,
    mod: mod ?? InputMod.DontCare
});

export const move = (button?: InputType, mod?: InputMod):InputHandlerProp => ({
    input: Input.MouseMove,
    type: button ?? InputType.MouseAny,
    mod: mod ?? InputMod.DontCare
});

export const roam = (button?: InputType, mod?: InputMod):InputHandlerProp => ({
    input: Input.MouseRoam,
    type: button ?? InputType.MouseAny,
    mod: mod ?? InputMod.DontCare
});

export const tick = (button?: InputType, mod?: InputMod):InputHandlerProp => ({
    input: Input.Tick,
    type: button ?? InputType.MouseAny,
    mod: mod ?? InputMod.DontCare
});

