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
						primary: '#0048bc',
						secondary: '#010409',
						anchor: '#0048bc',
						background: '#F7FAFB',
						surface: '#FFF',
						'on-secondary': '#f0f6fc',
						'on-background': '#010409',
						'on-surface': '#010409'
					}
				},
				dark: {
					colors: {
						primary: '#1a76ff',
						secondary: '#8b8b8b',
						anchor: '#2196f3',
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
