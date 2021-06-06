import { InputMod } from "./InputMod";
import { InputHandlerProp } from "./InputHandlerProp";
import { Input } from "./Input";

export const keyUp = (key: string, mod?: InputMod):InputHandlerProp => ({
    input: Input.KeyboardUp,
    type: key,
    mod: mod ?? InputMod.DontCare
});