import axios from 'axios'
// 配址
const BASE_URL='http://localhost:3000'

// 创建一个axios实例
const instance=axios.create({
    baseURL: BASE_URL,
    timeout:10000,
    withCredentials:true
})

//请求拦截器
instance.interceptors.request.use(
    //请求成功
    (config)=>{
        //+token
        // const token=localStorage.getItem('token')
        // if(token){
        //     config.headers.Authorization=`Bearer ${token}`
        // }
        return config
    },
    //请求错误
    (error)=>{
        return Promise.reject(error)
    }
)

//响应拦截器
instance.interceptors.response.use(
    //响应成功
    (response)=>{
        return response.data
    },
    //响应错误
    (error)=>{
        return Promise.reject(error)
    }
)

//封装get和post方法
export function get(url,params={},config={}){
    return instance.get(url,{params,...config})
}
export function post(url,data={},config={}){
    return instance.post(url,data,config)
}


const api={
    get,
    post
}

export default api