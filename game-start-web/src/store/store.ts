import IUser from "@/interfaces/IUser";
import AuthSetvice from "@/pages/api/AuthService";
import { makeAutoObservable } from "mobx";

export default class Store{
    user = {} as IUser
    isAuth = false

    constructor(){
        makeAutoObservable(this)
    }

    setAuth(bool:boolean){
        this.isAuth = bool
    }

    setUser(user:IUser){
        this.user = user
    }

    async login(email: string, password:string){
        try {
            const response = await AuthSetvice.login(email,password)
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (error) {
            console.log(error)
        }
    }
    
    async logout(){
        try {
            const response = await AuthSetvice.logout()
            console.log(response)
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch (error) {
            console.log(error)
        }
    }
    async registration(email: string, password:string){
        try {
            const response = await AuthSetvice.registration(email,password)
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (error) {
            console.log(error)
        }
    }

}