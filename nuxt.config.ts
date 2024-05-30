// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/supabase", "@nuxt/ui", "@nuxtjs/google-fonts"],
  devtools: { enabled: true },
  ssr: false,
  supabase: {
    redirectOptions: {
      exclude: ["/recovery", "/change-password"],
    },
  },
  googleFonts: {
    families: {
      Poppins: true,
    },
  },
});
