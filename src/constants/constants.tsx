import { InputType } from "./interfaces";


const emptyUserInputArray: Array<string|number> = [];
const emptyUserInputTypeArray: Array<InputType> = [];
const emptyStringArray: Array<string> = []

export const DEFAULT_DATA = {
    id: 0,
    app: "",
    title: "",
    address: "",
    params: emptyStringArray, // [ ]
    inputLabels: emptyStringArray, // [ ]
    userInputTypes: emptyUserInputTypeArray, // [ ]
    userInputs: emptyUserInputArray // [ ]
}




export const DEFAULT_TOKEN_1 = {address: "0x0", symbol: "DAI", name: "DAI", decimals: 18}
export const DEFAULT_TOKEN_2 = {address: "0x1", symbol: "WETH", name: "Wrapped ETH", decimals: 18}
export const TOKEN_LIST = [{address: "0x0", symbol: "DAI", name: "DAI", decimals: 18}, {address: "0x1", symbol: "WETH", name: "Wrapped ETH", decimals: 18}, {address: "0x2", symbol: "KNC", name: "Kyber Network", decimals: 18} ]