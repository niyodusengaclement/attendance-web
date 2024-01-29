<script setup lang="ts">
import useGeolocation from '~/composables/useGeolocation';
definePageMeta({
    layout: "default",
});

const show = ref(false)
function toggle(value: boolean) {
    show.value = value
}

import { Field, useValidation } from "vue3-form-validation";
import { rules } from "~/utils/rules";

const confirmPassword = ref("")
const http = useHttpRequest()
const latitude  = ref("")
const longitude = ref("")
interface FormData {
    email: Field<string>;
    password: Field<File[]>;
    phone: Field<string>;
    name: Field<string>;
    tin: Field<string>;
}
const {
    form,
    validateFields,
} = useValidation<FormData>({
    email: {
        $value: "",
        $rules: [rules.email("Please enter a valid email address")],
    },
    password: {
        $value: [],
        $rules: [rules.min(6)("Password has to be longer than 6 characters")],
    },
    phone: {
        $value: "",
        $rules: [rules.min(10)("Phone number has to be longer than 10 characters")],
    },
    name: {
        $value: "",
        $rules: [rules.min(3)("Shop name has to be longer than 2 characters")],
    },
    tin: {
        $value: "",
        $rules: [rules.min(5)("Password has to be longer than 5 characters")],
    },
});

async function handleSubmit() {
    try {
        const formData = await validateFields();

        if(longitude.value === '' || latitude.value === '') {
            useToast().error("Your location is not captured, check if you enabled location and refresh the page")
            return
        }
        
        http.fetch("createShop", {
            method: "post",
            body: {
                "formData": formData,
                "latitude" : latitude.value,
                "longitude" : longitude.value
            }
        })
            .then(res => {
                useToast().success(res.message)
            })
            .catch(err => {
                useToast().error(err.data.message)
            })
    } catch (e) {

    }
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function handleSuccess(position: any) {
    latitude.value = position.coords.latitude;
    longitude.value = position.coords.longitude;
}

function handleError(error: any) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
        default:
            console.error("An unknown error occurred while getting location.");
            break;
    }
}

onMounted(() => {
    getLocation()
})
</script>
<template>
    <div>
        <div class="bg-white md:overflow-hidden">
            <div class="px-4 py-20 md:py-4">
                <div class="md:max-w-6xl md:mx-auto">
                    <div class="md:flex md:flex-wrap">
                        <div class="md:w-1/2  md:text-left md:pt-28">
                            <h1 class="font-bold text-primary text-3xl md:text-5xl leading-tight mb-4">
                                Register Your Shop
                            </h1>
                            <p class="text-left md:text-xl text-gray-600 md:mb-12 mt-2">Make sure to be exactly at your shop
                                as the system takes this location</p>
                            <form @submit.prevent="handleSubmit" class="  md:text-sm md:pr-48">
                                <div class="flex flex-col my-7 group">
                                    <label for="name" class="text-gray-700 text-sm  group-focus:text-orange-400">Shop name
                                    </label>
                                    <input type="name" name="name" id="name" v-model="form.name.$value"
                                        @blur="form.name.$validate()"
                                        class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                        placeholder="Enter your Shop name">
                                    <FormErrors :errors="form.name.$errors" class="p-error" />
                                </div>
                                <div class="flex flex-col my-7 group">
                                    <label for="phone" class="text-gray-700 text-sm  group-focus:text-orange-400">Shop
                                        default phone numbmer
                                    </label>
                                    <input type="phone" name="phone" id="phone" v-model="form.phone.$value"
                                        @blur="form.phone.$validate()"
                                        class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                        placeholder="Enter your Shop default phone numbmer">
                                    <FormErrors :errors="form.phone.$errors" class="p-error" />
                                </div>
                                <div class="flex flex-col my-7 group">
                                    <label for="email" class="text-gray-700 text-sm  group-focus:text-orange-400">Shop
                                        default Email Address
                                    </label>
                                    <input type="email" name="email" id="email" v-model="form.email.$value"
                                        @blur="form.email.$validate()"
                                        class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                        placeholder="Enter your Shop default Email Address">
                                    <FormErrors :errors="form.email.$errors" class="p-error" />
                                </div>
                                <div class="flex flex-col my-7 group">
                                    <label for="tin" class="text-gray-700 text-sm  group-focus:text-orange-400">Tin Number
                                    </label>
                                    <input type="tin" name="tin" id="tin" v-model="form.tin.$value"
                                        @blur="form.tin.$validate()"
                                        class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                        placeholder="Enter your Tin Number">
                                    <FormErrors :errors="form.tin.$errors" class="p-error" />
                                </div>

                                <div class="flex flex-col my-7">
                                    <label for="password" class="text-gray-700 text-sm">Password</label>
                                    <div x-data="{ show: true }" class="relative flex items-center mt-2">
                                        <input :type="show ? 'text' : 'password'" name="password" id="password"
                                            v-model="form.password.$value" @blur="form.password.$validate()"
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

                                <!-- <div class="flex flex-col my-7">
                                    <label for="password" class="text-gray-700 text-sm">Confirm Password</label>
                                    <div x-data="{ show: true }" class="relative flex items-center mt-2">
                                        <input :type="show ? 'text' : 'password'" name="password" id="password"
                                            v-model="confirmPassword"
                                            class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                                            placeholder="Enter your password again to confirm">
                                        <div
                                            class="absolute right-2 bg-transparent cursor-pointer flex items-center justify-center text-gray-700">
                                            <EyeIcon @click="toggle(true)" size="18" class="text-gray-400"
                                                :class="show ? 'hidden' : ''" />
                                            <EyeOffIcon @click="toggle(false)" size="18" class="text-gray-400"
                                                :class="!show ? 'hidden' : ''" />
                                        </div>
                                    </div>
                                </div> -->

                                <div class="my-4 flex items-center justify-end space-x-4">
                                    <v-btn @click.prevent="handleSubmit" :disabled="loading" :loading="loading" rounded="xl"
                                        color="primary" size="large" block flat>
                                        Register</v-btn>

                                </div>
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
    </div>
</template>
  
