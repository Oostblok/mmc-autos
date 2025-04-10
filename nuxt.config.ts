const siteName = 'MMC Auto\'s'
const primaryColor = '#E2000D'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/google-fonts'
  ],
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-04-03',
  app: {
    head: {
      title: siteName,
      htmlAttrs: { lang: 'nl', dir: 'ltr' },
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover, minimum-scale=1, user-scalable=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { name: 'description', content: siteName },
        { name: 'theme-color', content: primaryColor },
        { name: 'msapplication-navbutton-color', content: primaryColor },
        { name: 'apple-mobile-web-app-status-bar-style', content: primaryColor }
        // TODO: OG Images
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          type: 'text/css',
          href: 'https://meyerweb.com/eric/tools/css/reset/reset.css'
        }
      ]
    }
  },
  googleFonts: {
    families: {
      Poppins: {
        wght: [800, 600, 400],
        ital: [400]
      }
    }
  }
})
