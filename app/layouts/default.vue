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
					class="logo"
				>
					<logo />
				</nuxt-link>
				<v-spacer />
				<v-btn
					v-tooltip="`Wissel naar de ${inDarkMode ? 'lichte' : 'donkere'} modus`"
					color="on-background"
					icon="mdi-theme-light-dark"
					class="mr-4"
					@click="theme.toggle()"
				/>
				<v-btn
					variant="flat"
					text="Contact"
					to="/contact"
					:density="smAndDown ? 'comfortable' : 'default'"
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
	.logo {
		display: inline-block;
		height: 100%;

		> svg {
			height: 100%;
			width: auto;
		}
	}

	footer {
		border-top: 1px solid rgb(var(--v-border-color), .1);
		background-color: rgb(var(--v-theme-surface));

		nav {
			> a {
				display: inline-block;
				position: relative;
				padding: 0 .5rem;
				text-decoration: none;
				color: rgb(var(--v-theme-on-surface));
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
