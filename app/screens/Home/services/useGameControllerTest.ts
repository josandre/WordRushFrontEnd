import { RequestCreator } from "@/app/Request/RequestCreator"
import { useCallback, useState } from "react"

const path = '/api/games'


export type TestResponse = {
    id: number,
    name: string
}


export default function useGameControllerTest() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [data, setData] = useState<TestResponse | undefined>(undefined)

    const games = useCallback(async () => {
    setLoading(true)
    setError(undefined)
    setData(undefined)

    const api = new RequestCreator()
    const result = await api.get<TestResponse>(path)

    if (!result.success) {
      setError(result.errorMessage)
      setLoading(false)
      return { success: false, errorMessage: result.errorMessage }
    }

    setData(result.data)
    setLoading(false)
    return { success: true, data: result.data! }
  }, [])
  
    return { games, loading, error, data }
}
