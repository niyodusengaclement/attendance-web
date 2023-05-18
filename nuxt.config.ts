// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: 'http://192.168.1.66:8080/web/api/v1/',
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
  css :[ "~/assets/styles/main.css"],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  nitro: {
    serveStatic: true,
  },
  devServerHandlers: [],
  hooks: {
  },

})


