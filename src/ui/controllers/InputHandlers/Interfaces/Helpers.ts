import { InputMod } from "./InputMod";
import { InputHandlerProp } from "./InputHandlerProp";
import { Input } from "./Input";
import { InputType } from "./InputType";

export const keyUp = (key: string, mod?: InputMod):InputHandlerProp => ({
    input: Input.KeyboardUp,
    type: key,
    mod: mod ?? InputMod.DontCare
});

export const click = (button?: InputType, mod?: InputMod):InputHandlerProp => ({
    input: Input.MouseClick,
    type: button ?? InputType.MouseAny,
    mod: mod ?? InputMod.DontCare
});
