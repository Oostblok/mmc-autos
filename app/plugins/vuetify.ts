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
						secondary: '#010409',
						anchor: '#024AB5',
						background: '#f2f2f2',
						surface: '#f0f6fc',
						'on-secondary': '#f0f6fc',
						'on-background': '#010409',
						'on-surface': '#010409'
					}
				},
				dark: {
					colors: {
						primary: '#024AB5',
						secondary: '#8b8b8b',
						anchor: '#4493F8',
						background: '#0D1117',
						surface: '#010409',
						'on-secondary': '#0B0E13',
						'on-background': '#f0f6fc',
						'on-surface': '#f0f6fc'
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
