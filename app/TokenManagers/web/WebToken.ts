export default class Storage<T> {
    key: string

    constructor(key: string){
        this.key = key
    }

    setValue(value: T){
        return localStorage.setItem(this.key, JSON.stringify(value))
    }

    getValue(): T | null {
        const value = localStorage.getItem(this.key)
        return value ? JSON.parse(value) : null
    }

    removeValue() {
        return localStorage.removeItem(this.key)
    }
}