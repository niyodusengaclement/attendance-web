<script setup lang="ts">
import { MoonIcon, EyeIcon, EyeOffIcon } from 'vue-tabler-icons';
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";

definePageMeta({
    layout: "default",
});
let user:any;
 
// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;
 
  if(credential){
    user = await $fetch("/api/google.auth",{
      method: 'POST',
      body: {
        token: credential
      }
    })
  }
  
  console.log("User", user);
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};
const show = ref(false)
function toggle(value: boolean) {
    show.value = value
}

import { Field, useValidation } from "vue3-form-validation";
import { rules } from "~/utils/rules";
import { useAuth } from '~~/composables/useAuth';
const { login, loading } = useAuth();
// const toast = useToast();
const checkbox = ref(true);

interface FormData {
  email: Field<string>;
  password: Field<File[]>;
  remember: Field<boolean>;
}
const {
  form,
  submitting,
  validating,
  errors,
  hasError,
  validateFields,
  resetFields,
} = useValidation<FormData>({
  email: {
    $value: "",
    $rules: [rules.email("Please enter a valid email address")],
  },
  password: {
    $value: [],
    $rules: [rules.min(6)("Password has to be longer than 6 characters")],
  },
  remember: {
    $value: false
  },
});
async function handleSubmit() {
  try {
    const formData = await validateFields();
    login(form.email.$value, form.password.$value,form.remember.$value);

  } catch (e) {
    
  }
}
</script>
<template>
    <div>
        <div class="bg-white md:overflow-hidden">
            <div class="px-4 py-20 md:py-4">
                <div class="md:max-w-6xl md:mx-auto">
                    <div class="md:flex md:flex-wrap">
                        <div class="md:w-1/2  md:text-left md:pt-28">
                            <h1 class="font-bold text-primary text-3xl md:text-5xl leading-tight mb-4">
                                Login
                            </h1>
                            <p class="text-left md:text-xl text-gray-600 md:mb-12 mt-2">Welcome back, login to your account
                            </p>
                            <form @submit.prevent="handleSubmit" class="  md:text-sm md:pr-48">
                                <div class="flex flex-col my-4 group">
                                    <label for="email" class="text-gray-700 text-sm  group-focus:text-orange-400">Username
                                    </label>
                                    <input type="email" name="email" id="email" v-model="form.email.$value" @blur="form.email.$validate()"
                                        class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                        placeholder="Enter your username">
                                        <FormErrors :errors="form.email.$errors" class="p-error" />

                                </div>
                                <div class="flex flex-col my-4">
                                    <label for="password" class="text-gray-700 text-sm">Password</label>
                                    <div x-data="{ show: true }" class="relative flex items-center mt-2">
                                        <input :type="show ? 'text' : 'password'" name="password" id="password"  v-model="form.password.$value" @blur="form.password.$validate()"
                                            class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                            placeholder="Enter your password">
                                        <div
                                            class="absolute right-2 bg-transparent cursor-pointer flex items-center justify-center text-gray-700">
                                            <EyeIcon @click="toggle(true)" size="18" class="text-gray-400"
                                                :class="show ? 'hidden' : ''" />
                                            <EyeOffIcon @click="toggle(false)" size="18" class="text-gray-400"
                                                :class="!show ? 'hidden' : ''" />
                                        </div>

                                    </div>
                                    <FormErrors :errors="form.password.$errors" class="p-error" />

                                </div>
                                 
                                <div class="flex items-center">
                                    <input type="checkbox" name="remember_me" id="remember_me"
                                        class="mr-2 focus:ring-0 rounded">
                                    <label for="remember_me" class="text-gray-700">Remember me </label>
                                </div>

                                <div class="my-4 flex items-center justify-end space-x-4">
                                    
                                        <v-btn @click.prevent="handleSubmit" :disabled="loading" color="primary" size="large" block   flat>{{loading ? 'Loading...' : 'Sign iin'}}</v-btn>

                                </div>

                                <div class="flex items-center justify-between mb-8">
                                    <div class="w-full h-[1px] bg-gray-300"></div>
                                    <span class="text-sm uppercase mx-6 text-gray-400">Or</span>
                                    <div class="w-full h-[1px] bg-gray-300"></div>
                                </div>
                                <GoogleSignInButton @success="handleLoginSuccess" @error="handleLoginError"></GoogleSignInButton> 
                            </form>


                        </div>
                        <LoginRightDesign />
                    </div>
                </div>
            </div>
            <svg class="fill-current text-white hidden md:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
                <path fill-opacity="1" d="M0,224L1440,32L1440,320L0,320Z"></path>
            </svg>
        </div>
</div></template>
  
