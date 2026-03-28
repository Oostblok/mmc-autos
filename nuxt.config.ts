import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

const siteName = 'MMC Auto\'s'
const primaryColor = '#024AB5'
const baseURL = process.env.NODE_ENV === 'production' ? '/mmc-autos/' : '/'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/google-fonts'
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
        { name: 'description', content: siteName },
        { name: 'theme-color', content: primaryColor },
        { name: 'msapplication-navbutton-color', content: primaryColor },
        { name: 'apple-mobile-web-app-status-bar-style', content: primaryColor }
        // TODO: OG Images
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
	css: [
		'vuetify/styles',
		'@mdi/font/css/materialdesignicons.css'
	]
})
