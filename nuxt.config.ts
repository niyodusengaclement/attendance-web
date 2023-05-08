// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: '',
    }
  },
  typescript: {
    shim: false
  },
  build: {
    transpile: [
      "vuetify",
      "@fawmi/vue-google-maps",
    ],
  },
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


