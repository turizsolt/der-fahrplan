import { CommandResult } from "./CommandResult";

export interface CommandResultWithValue {
    result: CommandResult;
    returnValue?: any;
}
