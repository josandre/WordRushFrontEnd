import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Storage<T> {
    key: string

    constructor(key: string){
        this.key = key
    }

    async setValue(value: T){
        return AsyncStorage.setItem(this.key, JSON.stringify(value))
    }

    async getValue(): Promise<T | null>{
        const value = await AsyncStorage.getItem(this.key)
        return value ? JSON.parse(value) : null
    } 

    async removeValue(): Promise<void> {
        return AsyncStorage.removeItem(this.key);
    }
}