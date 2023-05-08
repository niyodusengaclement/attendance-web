export const useHttpRequest = () => {
    const config = useRuntimeConfig()
    const API_URL = "http://localhost:8080/web/api/v1/"
    let token: string | null;
    if (process.client) {
      token = localStorage.getItem("token")
    }
    return {
        //RequestInit replaced by any on params
      async fetch(url: RequestInfo, params?: any): Promise<any> {
        
        if (!params) {
          params = {}
        }
        params.headers = { Authorization: token }
       const promise =  new Promise((resolve, reject)=>{
           resolve($fetch(API_URL + url, params,))
       })


      promise.catch(res=>{
          if (res.data.status == 401){
               navigateTo({ path: '/auth/login' })
          }else{
            return res.data
          }
      })
        return promise
      },
    };
  };