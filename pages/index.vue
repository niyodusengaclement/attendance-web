<template>
     
      <div>
        <div class="bg-green-500 px-4 py-4">
          <div class="md:max-w-6xl md:mx-auto md:flex md:items-center md:justify-between">
            <div class="flex justify-between items-center">
              <a href="#" class="inline-block py-2 text-white text-xl font-bold">Optimus Prisma</a>
              <div class="inline-block cursor-pointer md:hidden">
                <div class="bg-gray-400 w-8 mb-2" style="height: 2px;"></div>
                <div class="bg-gray-400 w-8 mb-2" style="height: 2px;"></div>
                <div class="bg-gray-400 w-8" style="height: 2px;"></div>
              </div>
            </div>
  
            <div>
              <div class="hidden md:block">
  
              </div>
            </div>
            <div class="hidden md:block">

              <nuxt-link to="/auth/login"
                class="inline-block py-2 px-8 text-green-700 bg-white hover:bg-gray-100 rounded-full">Sign in</nuxt-link>
            </div>
          </div>
        </div>
  
        <div class="bg-white md:overflow-hidden">
          <div class="px-4 py-20 md:py-4">
            <div class="md:max-w-6xl md:mx-auto">
              <div class="md:flex md:flex-wrap">
              <LandingLeftSideDesign/>
              <LandingRightSideDesign/>
              </div>
            </div>
          </div>
          <svg class="fill-current text-white hidden md:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
            <path fill-opacity="1" d="M0,224L1440,32L1440,320L0,320Z"></path>
          </svg>
        </div>
  
        <p class="text-center text-sm p-4 text-gray-600 pt-10">
          Created by
          <a class="border-b text-green-500" href="https://twitter.com/mithicher" target="_blank">Qonics Inc</a>
  
        </p>
      </div>
    
  </template>
  
  <script lang="ts" setup>
  definePageMeta({
    layout: "default"
  })
  </script>
  
  <style></style>
  
  