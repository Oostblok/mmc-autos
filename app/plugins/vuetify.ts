import { defineNuxtPlugin } from '#app'
import { nl } from 'vuetify/locale'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((app) => {
	const vuetify = createVuetify({
		components,
		directives,
		locale: {
			locale: 'nl',
			messages: { nl }
		},
		theme: {
			defaultTheme: 'system',
			themes: {
				light: {
					colors: {
						primary: '#024AB5',
						secondary: '#000',
						anchor: '#024AB5',
						background: '#f2f2f2',
						surface: '#FFF',
						'on-secondary': '#FFF',
						'on-background': '#000',
						'on-surface': '#000'
					}
				},
				dark: {
					colors: {
						primary: '#024AB5',
						secondary: '#8b8b8b',
						anchor: '#2196F3',
						background: '#0B0E13',
						surface: '#0B0E13',
						'on-secondary': '#0B0E13',
						'on-background': '#FFF',
						'on-surface': '#FFF'
					}
				}
			}
		},
		defaults: {
			VBtn: {
				variant: 'flat',
				color: 'primary'
			},
			VCard: {
				variant: 'flat',
				tile: true
			}
		}
	})

	app.vueApp.use(vuetify)
})
