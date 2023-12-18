// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: process.env.BASE_URL,
    },
    googleClientId: process.env.GOOGLE_AUTH_CLIENT_ID_LOCAL,

  },
  googleSignIn: {
    clientId: process.env.GOOGLE_AUTH_CLIENT_ID_LOCAL,
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
    'nuxt-vue3-google-signin',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  css :[ "~/assets/styles/main.css"],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  pinia:{
    autoImports: ["defineStore"]
  },
  imports: {
    dirs: ["./stores"]
  },

})


