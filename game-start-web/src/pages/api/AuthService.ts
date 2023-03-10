import $api from "@/http";
import IUser from "@/interfaces/IUser";
import {AxiosResponse} from 'axios'

interface AuthResponse{
    accessToken:string,
    refreshToken:string,
    user: IUser
}

export default class AuthSetvice{
    static async login(email:string,password:string):Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/login',{email,password})
    }

    static async registration(email:string,password:string):Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/login',{email,password})
    }

    static async logout():Promise<void>{
        $api.post<AuthResponse>('/logout')
    }
}
