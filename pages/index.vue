<script setup lang="ts">

import {
  type CredentialResponse,
} from "vue3-google-signin";

definePageMeta({
  layout: "default",
});
let user: any;
const http = useHttpRequest()
const state = ref(1)
const otp = ref('')
const dataLoading = ref(false)
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const model = ref("Phone")
// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;

  if (credential) {
    user = await $fetch("/api/google.auth", {
      method: 'POST',
      body: {
        token: credential
      }
    }).then((data) => {
      console.log(" DATDA _" + data.name);
      window.location.href = '/dashboard'
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

function getOtp() {
  dataLoading.value = true
  http.fetch("getOtp", {
    method: "post",
    body: {
      value: email.value,
      type: model.value
    }
  })
    .then(res => {
      useToast().success(res.message)
      state.value = 3
    })
    .catch(err => {
      useToast().error(err.data.message)
    })
    .finally(() => {
      dataLoading.value = false
    })
}
function verifyOtp() {
  dataLoading.value = true
  http.fetch("verifyOtp", {
    method: "post",
    body: {
      otp: otp.value,
      value: email.value,
      type: model.value
    }
  })
    .then(res => {
      // useToast().success(res.message)
      state.value = 4
    })
    .catch(err => {
      useToast().error(err.data.message)
    })
    .finally(() => {
      dataLoading.value = false
    })
}
function saveNewPassword() {
  dataLoading.value = true
  http.fetch("saveNewPassword", {
    method: "post",
    body: {
      password: password.value,
      confirm: confirmPassword.value,
      value: email.value,
      type: model.value,
      otp: otp.value
    }
  })
    .then(res => {
      useToast().success(res.message)
      state.value = 1
    })
    .catch(err => {
      useToast().error(err.data.message)
    })
    .finally(() => {
      dataLoading.value = false
    })
}

import { Field, useValidation } from "vue3-form-validation";
import { rules } from "~/utils/rules";
import { useAuth } from '~~/composables/useAuth';
const { login, loading } = useAuth();
const api = useApi();

// const toast = useToast();
const checkbox = ref(true);

interface FormData {
  email: Field<string>;
  password: Field<string>;
  isDistrict: Field<boolean>;
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
    $value: "",
    $rules: [rules.min(6)("Password has to be longer than 6 characters")],
  },
  isDistrict: {
    $value: false
  },
});
async function handleSubmit() {
  try {
    const formData = await validateFields();
    login(form.email.$value, form.password.$value, form.isDistrict.$value);
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
            <div v-if="state == 1" class="md:w-1/2  md:text-left md:pt-28">
              <h1 class="font-bold text-success text-3xl md:text-5xl leading-tight mb-4">
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
                    <input :type="show ? 'text' : 'password'" name="password" id="password"
                      v-model="form.password.$value" @blur="form.password.$validate()"
                      class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                      placeholder="Enter your password">
                    <div
                      class="absolute right-2 bg-transparent cursor-pointer flex items-center justify-center text-gray-700">
                      <EyeIcon @click="toggle(true)" size="18" class="text-gray-400" :class="show ? 'hidden' : ''" />
                      <EyeOffIcon @click="toggle(false)" size="18" class="text-gray-400"
                        :class="!show ? 'hidden' : ''" />
                    </div>

                  </div>
                  <FormErrors :errors="form.password.$errors" class="p-error" />

                </div>

                <v-row class="p-4" justify="end">
                  <v-switch v-model="form.isDistrict.$value" color="success" label="Injira nkumukozi w'akarere" inset hide-details></v-switch>
                </v-row>

                <div class="my-4 flex items-center justify-end space-x-4">

                  <v-btn @click.prevent="handleSubmit" :disabled="loading" :loading="loading" color="success"
                    size="large" block flat>
                    Login</v-btn>
                </div>
                <v-row justify="end">
                  <v-btn color="primary" size="large" flat variant="text">Forgot Password?</v-btn>
                </v-row>
              </form>
            </div>
            <div v-if="state == 2" class="md:w-1/2  md:text-left md:pt-28">
              <h1 class="font-bold text-primary text-3xl md:text-5xl leading-tight mb-4">
                Reset Password
              </h1>
              <p class="text-left md:text-xl text-gray-600 md:mb-12 mt-2">Enter Your {{ model }} to reset your password
              </p>
              <form @submit.prevent="getOtp" class="  md:text-sm md:pr-48">
                <v-switch v-model="model" hide-details inset color="#1F394A" true-value="Phone" false-value="Email"
                  :label="`Using ${model}`"></v-switch>
                <div class="flex flex-col my-4 group">
                  <label for="email" class="text-gray-700 text-sm  group-focus:text-orange-400">{{ model }}</label>
                  <input type="email" name="email" id="email" v-model="email"
                    class="mt-1 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                    :placeholder="`Enter your user ${model}`">
                </div>
                <div class="my-4 flex items-center justify-end space-x-4">
                  <v-btn @click.prevent="getOtp" :disabled="dataLoading" :loading="dataLoading" rounded="xl"
                    color="primary" size="large" block flat>
                    Reset Password</v-btn>

                </div>
                <v-row justify="center">
                  <v-btn @click.prevent="state = 1" color="primary" size="large" variant="text">
                    Back to Login</v-btn>
                </v-row>
              </form>
            </div>
            <div v-if="state == 3" class="md:w-1/2  md:text-left md:pt-28">
              <h1 class="font-bold text-primary text-3xl md:text-5xl leading-tight mb-4">
                Reset OTP
              </h1>
              <p class="text-left md:text-xl text-gray-600 md:mb-12 mt-2">Enter OTP sent to you
              </p>
              <form @submit.prevent="handleSubmit" class="  md:text-sm md:pr-48">
                <div class="flex flex-col my-4 group">
                  <label for="email" class="text-gray-700 text-sm  group-focus:text-orange-400">OTP</label>
                  <v-otp-input v-model="otp" :loading="dataLoading" variant="solo" length="6"></v-otp-input>
                </div>

                <div class="my-4 flex items-center justify-end space-x-4">
                  <v-btn @click.prevent="verifyOtp" :disabled="dataLoading" :loading="dataLoading" rounded="xl"
                    color="primary" size="large" block flat>
                    Verify OTP</v-btn>
                </div>
              </form>
            </div>
            <div v-if="state == 4" class="md:w-1/2  md:text-left md:pt-28">
              <h1 class="font-bold text-primary text-3xl md:text-5xl leading-tight mb-4">
                Reset OTP
              </h1>
              <p class="text-left md:text-xl text-gray-600 md:mb-12 mt-2">Enter OTP sent to you
              </p>
              <form @submit.prevent="handleSubmit" class="  md:text-sm md:pr-48">
                <div class="flex flex-col my-4">
                  <label for="password" class="text-gray-700 text-sm">Password</label>
                  <div x-data="{ show: true }" class="relative flex items-center mt-2">
                    <input :type="show ? 'text' : 'password'" name="password" id="password" v-model="password"
                      class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                      placeholder="Enter your password">
                    <div
                      class="absolute right-2 bg-transparent cursor-pointer flex items-center justify-center text-gray-700">
                      <EyeIcon @click="toggle(true)" size="18" class="text-gray-400" :class="show ? 'hidden' : ''" />
                      <EyeOffIcon @click="toggle(false)" size="18" class="text-gray-400"
                        :class="!show ? 'hidden' : ''" />
                    </div>

                  </div>

                </div>
                <div class="flex flex-col my-4">
                  <label for="password" class="text-gray-700 text-sm">Confirm Password</label>
                  <div x-data="{ show: true }" class="relative flex items-center mt-2">
                    <input :type="show ? 'text' : 'password'" name="password" id="password" v-model="confirmPassword"
                      class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-warning-500 rounded text-sm text-gray-900"
                      placeholder="Enter your password">
                    <div
                      class="absolute right-2 bg-transparent cursor-pointer flex items-center justify-center text-gray-700">
                      <EyeIcon @click="toggle(true)" size="18" class="text-gray-400" :class="show ? 'hidden' : ''" />
                      <EyeOffIcon @click="toggle(false)" size="18" class="text-gray-400"
                        :class="!show ? 'hidden' : ''" />
                    </div>

                  </div>
                </div>

                <div class="my-4 flex items-center justify-end space-x-4">
                  <v-btn @click.prevent="saveNewPassword" :disabled="dataLoading" :loading="dataLoading" color="success"
                    size="large" block flat>
                    Save New Password</v-btn>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <svg class="fill-current text-white hidden md:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
        <path fill-opacity="1" d="M0,224L1440,32L1440,320L0,320Z"></path>
      </svg>
    </div>
  </div>
</template>
