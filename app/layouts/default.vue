<script setup lang="ts">
	import { useDisplay, useTheme } from 'vuetify'

	const { data: navigation = [] } = await useAsyncData('navigation', () => queryCollectionNavigation('content'))

	const theme = useTheme()
	const { smAndDown } = useDisplay()

	const inDarkMode = computed(() => theme.name.value === 'dark')
</script>

<template>
	<v-app>
		<v-app-bar
			:density="smAndDown ? 'compact' : 'default'"
			scroll-behavior="elevate"
			:class="{ 'border-b-thin': inDarkMode }"
		>
			<v-container class="d-flex align-center fill-height">
				<nuxt-link
					to="/"
					class="fill-height d-inline-block"
				>
					<img
						src="/logo.jpg"
						alt="MMC Auto's"
						class="fill-height"
					>
				</nuxt-link>
				<v-spacer />
				<v-btn
					v-tooltip="`Wissel naar de ${inDarkMode ? 'lichte' : 'donkere'} modus`"
					color="on-background"
					icon
					class="mr-4"
					@click="theme.toggle()"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z"
						/>
					</svg>
				</v-btn>
				<v-btn
					variant="flat"
					text="Contact"
					to="/contact"
				/>
			</v-container>
		</v-app-bar>
		<v-main>
			<slot />
		</v-main>
		<footer>
			<v-container class="d-flex">
				<v-spacer />
				<nav>
					<nuxt-link
						v-for="item in navigation"
						:key="item.stem"
						:to="item.path"
					>
						{{ item.title }}
					</nuxt-link>
				</nav>
			</v-container>
		</footer>
	</v-app>
</template>

<style scoped lang="scss">
	.v-btn {
		svg {
			width: 50%;
		}
	}

	footer {
		border-top: 1px solid rgb(var(--v-border-color), .1);

		nav {
			> a {
				display: inline-block;
				position: relative;
				padding: 0 .5rem;
				text-decoration: none;
				color: rgb(var(--v-theme-on-background));
				transition: color .2s cubic-bezier(.4, 0, .2, 1);

				&:before {
					content: '';

					position: absolute;
					bottom: 0;
					left: 50%;
					width: 0;
					height: 2px;
					background-color: rgb(var(--v-theme-anchor));

					transition: all .2s cubic-bezier(.4, 0, .2, 1);
				}

				&:hover,
				&.router-link-active {
					color: rgb(var(--v-theme-anchor));
				}

				&:hover:before {
					left: 0;
					width: 100%;
				}

				&:not(:last-child) {
					margin-right: 1rem;
				}
			}
		}
	}
</style>
