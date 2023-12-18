// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: 'http://192.168.1.77:8080/web/api/v1/',
    }
  },
  typescript: {
    shim: false
  },
  build: {
    transpile: [
      "vuetify",
      "@fawmi/vue-google-maps",
      "vue-toastification"
    ],
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css :[ "~/assets/styles/main.css"],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
 

})


