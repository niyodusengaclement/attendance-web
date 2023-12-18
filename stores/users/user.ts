import { defineStore } from 'pinia'
import type { Customer } from '~/types/customer';
import type { Login, User } from '~/types/user';


export const useUserStore = defineStore("user", () => {
  const config = useRuntimeConfig();
  const mainUrl = config.apiUrl;
  const user = ref();
  const token = useCookie("MY_COOKIE", {
    maxAge: 60 * 60,
  });

  const setToken = (data?: string) => (token.value = data ?? "");
  const setUser = (data?: any) => (user.value = data);

  const signIn = async (data: Login) => {
    try {
      const res = await $fetch<User>("https://dummyjson.com/auth/login", {
        method: "POST",
        body: data
      });
      setToken(res.token);
      await fetchCustomer();
      useToast().success("Login Successful");
      window.location.href = '/dashboard'

    } catch (error) {
      setToken();
      setUser();
      console.log(error);
    }
  }

  const signInWithGoogle = async (data: string) => {
    try {

      setToken(data);

    } catch (error) {
      setToken();
      setUser();
      console.log(error);
    }
  }

  const fetchCustomer = async () => {
    if (token.value) {
      try {
        const res = await $fetch<Customer>("https://dummyjson.com/users/1");
        setUser(res);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const logout = () => {
    setToken();
    setUser();
  }


  return { user, token, signIn, signInWithGoogle, fetchCustomer, logout, setUser, setToken };
});
