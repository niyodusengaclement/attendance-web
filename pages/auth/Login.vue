<script setup lang="ts">
import { MoonIcon, EyeIcon, EyeOffIcon } from 'vue-tabler-icons';

definePageMeta({
    layout: "default",
});

const show = ref(false)
function toggle(value: boolean) {
    show.value = value
}
</script>
<template>
    <div>
        <div class="bg-white md:overflow-hidden">
            <div class="px-4 py-20 md:py-4">
                <div class="md:max-w-6xl md:mx-auto">
                    <div class="md:flex md:flex-wrap">
                        <div class="md:w-1/2  md:text-left md:pt-16">
                            <h1 class="font-bold text-green-500 text-3xl md:text-5xl leading-tight mb-4">
                                Login
                            </h1>
                            <p class="text-left md:text-xl text-gray-600 md:mb-12 mt-2">Welcome back, login to your account
                            </p>
                            <div class="  md:text-sm md:pr-48">
                                <div class="flex flex-col my-4 group">
                                    <label for="email" class="text-gray-700 text-sm  group-focus:text-orange-400">Username
                                    </label>
                                    <input type="email" name="email" id="email"
                                        class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                        placeholder="Enter your username">
                                </div>
                                <div class="flex flex-col my-4">
                                    <label for="password" class="text-gray-700 text-sm">Password</label>
                                    <div x-data="{ show: true }" class="relative flex items-center mt-2">
                                        <input :type="show ? 'text' : 'password'" name="password" id="password"
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
                                </div>
                                <div class="flex items-center">
                                    <input type="checkbox" name="remember_me" id="remember_me"
                                        class="mr-2 focus:ring-0 rounded">
                                    <label for="remember_me" class="text-gray-700">Remember me </label>
                                </div>

                                <div class="my-4 flex items-center justify-end space-x-4">
                                    <button
                                        class="w-full bg-green-500 text-white p-2 border border-green-500 rounded-md hover:bg-white hover:text-green-500 ansition-colors duration-300">Sign
                                        In</button>

                                </div>

                                <div class="flex items-center justify-between mb-8">
                                    <div class="w-full h-[1px] bg-gray-300"></div>
                                    <span class="text-sm uppercase mx-6 text-gray-400">Or</span>
                                    <div class="w-full h-[1px] bg-gray-300"></div>
                                </div>

                            </div>


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
  
