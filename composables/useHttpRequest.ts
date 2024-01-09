export const useHttpRequest = () => {
  const config = useRuntimeConfig();
  const API_URL = config.public.apiUrl;
  let token: string | null;
  if (process.client) {
    token = localStorage.getItem("token");
  }
  return {
    //RequestInit replaced by any on params
    async fetch(url: RequestInfo, params?: any): Promise<any> {
      // console.log("Base Public url: " + config.public.apiUrl)
      if (!params) {
        params = {};
      }
      params.headers = { Authorization: "Bearer " + token };
      const promise = new Promise((resolve, reject) => {
        resolve($fetch(API_URL + url, params));
      });
      promise.catch((res) => {
        if (res.status == 401) {
          navigateTo({ path: "/auth/login" });
        } else {
          return res.data;
        }
      });
      return promise;
    },
    async fetch_v2(url: RequestInfo, params?: any): Promise<any> {
      // console.log("Base Public url: " + config.public.apiUrl)
      if (!params) {
        params = {};
      }
      params.headers = { Authorization: "Bearer " + token };
      const promise = new Promise((resolve, reject) => {
        resolve($fetch(API_URL + url, params));
      });
      //  if(dd.status == 401){
      //      console.log("redfsd fsd fsdf sdf")
      //  }
      promise.catch((res) => {
        if (res.data.status == 401) {
          navigateTo({ path: "/auth/login" });
        } else {
          console.log(res);
          return res;
        }
      });
      return promise;
    },
  };
};
