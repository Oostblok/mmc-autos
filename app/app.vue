<script setup lang="ts">
	const siteName = 'MMC Auto\'s'

	useHead({
		titleTemplate: (titleChunk) => titleChunk
			? `${titleChunk} | ${siteName}`
			: siteName
	})
</script>

<template>
	<nuxt-loading-indicator color="primary" />
	<nuxt-layout>
		<nuxt-page />
	</nuxt-layout>
</template>

<style lang="scss">
	@use 'sass:map';
	@use '~/assets/css/vuetify' as settings;

	@for $i from 1 to 7 {
		h#{$i} {
			font: {
				size: map.get(settings.$typography, 'h#{$i}', 'size');
				weight: map.get(settings.$typography, 'h#{$i}', 'weight');
			}
			line-height: map.get(settings.$typography, 'h#{$i}', 'line-height');
			letter-spacing: map.get(settings.$typography, 'h#{$i}', 'letter-spacing');
			text-transform: map.get(settings.$typography, 'h#{$i}', 'text-transform');
			color: rgb(var(--v-theme-primary));
		}
	}

	p {
		margin-bottom: 0;
	}

	a:not([class]),
	a[class=""] {
		display: inline-block;
		position: relative;
		text-decoration: none;
		color: rgb(var(--v-theme-anchor));

		&:before {
			content: '';

			position: absolute;
			bottom: .25rem;
			left: 50%;
			width: 0;
			height: 1px;
			background-color: rgb(var(--v-theme-anchor));

			transition: all .2s cubic-bezier(.4, 0, .2, 1);
		}

		&:hover:before {
			width: 100%;
			left: 0;
		}
	}
</style>
