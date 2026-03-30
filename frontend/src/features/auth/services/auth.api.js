import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials:true
})

export async function register({username, email, password}){
 try{
const response = await api.post("/api/auth/register",{
    username, email, password
})
   return response.data
 }catch(err){
    console.log("error come when connect to backend using register ")
    throw err
 }

} 


export async function login({email, password}){
    try{
        const response = await api.post("/api/auth/login",{
            email, password
        })

        return response.data
    }catch(err){
        console.log("error come when connect to backend in login")
        throw err
    }
}

export async function logout(){

  try{
    const response = await api.get("/api/auth/logout")

    return response.data
  }catch(err){
        console.log("error come when connect to backend in logout ")
        throw err
    }
}

export async function getMe(){

    try{
    
       const respone = await api.get("/api/auth/get-me")

       return respone.data

    }catch(err){
        console.log("error come when connect to backend in get-me ")
        throw err
    }
}