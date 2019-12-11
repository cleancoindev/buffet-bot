import { ATYPES, CTYPES } from "../constants/whitelist"
import { DEFAULT_DATA } from "../constants/constants"

export function findCondition(id: string) {
    let returnData = DEFAULT_DATA
    CTYPES.forEach(type => {
        if (type.id === parseInt(id)) {
            returnData = type
        }

    })
    return returnData
}

export function findAction(id: string) {
    let returnData = DEFAULT_DATA
    ATYPES.map(type => {
        if (type.id === parseInt(id)) {
            returnData = type
        }
    })
    return returnData
}