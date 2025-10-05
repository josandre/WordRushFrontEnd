import { useCallback, useState } from 'react'
import { RequestCreator } from '@/app/Request/RequestCreator'


const path = '/auth/sign-up'

export type RegisterPayload = {
    email: string
    password: string
    nickname: string
    avatar?: string
    userName: string
}

export type SignUpResponse = {
    Success: boolean
    Message: string
    UserId?: string
    Email?: string
    Nickname?: string
    Avatar?: string
    RoleId?: string
}

export type RegisterSuccess = {
    success: true
    data: SignUpResponse
}

export type RegisterFailure = {
    success: false
    errorMessage: string
    status?: number
    details?: unknown
}

export type RegisterResult = RegisterSuccess | RegisterFailure

export default function useRegisterUser() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [data, setData] = useState<SignUpResponse | undefined>(undefined)

    const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true)
    setError(undefined)
    setData(undefined)

    const api = new RequestCreator()
    const result = await api.post<SignUpResponse>(path, payload)

    if (!result.success) {
      setError(result.errorMessage)
      setLoading(false)
      return { success: false, errorMessage: result.errorMessage }
    }

    setData(result.data)
    setLoading(false)
    return { success: true, data: result.data! }
  }, [])
  
    return { register, loading, error, data }
}


