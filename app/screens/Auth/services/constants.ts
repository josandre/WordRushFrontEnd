import { LogInResponse } from "./useLogIn"
import { SignUpResponse } from "./useRegisterUser"

type Response = SignUpResponse | LogInResponse


export type Success = {
    success: true
    data: Response
}

export type Failure = {
    success: false
    errorMessage: string
    status?: number
    details?: unknown
}