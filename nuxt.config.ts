import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const siteName = "MMC Auto's"
const primaryColor = '#024AB5'
const baseURL = process.env.SITE_PREFIX || '/'

export default defineNuxtConfig({
  modules: [
		'@nuxt/content',
	  '@nuxt/image',
	  '@nuxtjs/google-fonts',
	  'nuxt-gtag'
  ],
  ssr: false,
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-04-03',
  app: {
	  baseURL,
    head: {
      title: siteName,
      htmlAttrs: { lang: 'nl', dir: 'ltr' },
      meta: [
        { charset: 'utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover, minimum-scale=1, user-scalable=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:title', content: siteName },
        { name: 'description', content: "MMC Auto's B.v. is de nieuwe naam van Marius vd Eijnden Auto's B.v." },
        { name: 'theme-color', content: primaryColor },
        { name: 'msapplication-navbutton-color', content: primaryColor },
        { name: 'apple-mobile-web-app-status-bar-style', content: primaryColor },
	      { property: 'og:image', content: `${process.env.SITE_URL}/og-1200x628.jpg` },
	      { property: 'og:width', content: '1200' },
	      { property: 'og:height', content: '628' },
	      { property: 'og:image:type', content: 'image/jpeg' },
	      { property: 'og:image', content: `${process.env.SITE_URL}/og-1080x1920.jpg` },
	      { property: 'og:width', content: '1080' },
	      { property: 'og:height', content: '1920' },
	      { property: 'og:image:type', content: 'image/jpeg' }
      ],
      link: [
				{ rel: 'icon', type: 'image/x-icon', href: `${baseURL}favicon.ico` }
      ]
    }
  },
	build: {
		transpile: ['vuetify']
	},
	vite: {
		vue: { template: { transformAssetUrls } },
		plugins: [
			...vuetify({
				autoImport: true,
				styles: { configFile: 'assets/css/vuetify.scss' }
			})
		],
		optimizeDeps: {
			include: []
		}
	},
  googleFonts: {
    families: {
      Poppins: {
        wght: [800, 600, 400],
        ital: [400]
      }
    }
  },
	gtag: {
		id: process.env.GOOGLE_ANALYTICS_ID || '',
		enabled: !!process.env.GOOGLE_ANALYTICS_ID
	},
	css: [
		'vuetify/styles',
		'@mdi/font/css/materialdesignicons.css'
	]
})
