export const extractErrorMessage = (body: any): string | undefined  => {
    if (!body) return undefined
    if (typeof body === 'string') return body
    if (typeof body === 'object') {
        
        if (typeof body.message === 'string') return body.message
        if (Array.isArray(body.errors)) {
            const first = body.errors[0]
            if (typeof first === 'string') return first
            if (first && typeof first.message === 'string') return first.message
        }
        
        for (const key of Object.keys(body)) {
            const val = (body as any)[key]
            if (typeof val === 'string') return val
        }
    }
    return undefined
}

