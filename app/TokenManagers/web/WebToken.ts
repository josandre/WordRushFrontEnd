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

    async removeValue(): Promise<void> {
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.removeItem(this.key);
            } catch (e) {
                console.error("WebStorage removeValue error:", e);
            }
        }
        return Promise.resolve();
    }
}