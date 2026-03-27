<script setup lang="ts">
	const route = useRoute()

	const { data: car } = await useAsyncData(`car-${route.params.slug}`, () =>
		queryCollection('cars')
			.where('slug', '=', route.params.slug)
			.first()
	)

	if (!car.value) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Auto niet gevonden',
			fatal: true
		})
	}

	const carData = car.value!

	const title = computed(() => {
		if (carData.title) return carData.title

		if (carData.model) return carData.model

		if (carData.make && carData.type) {
			return `${carData.make} ${carData.type}`
		}

		return ''
	})

	useSeoMeta({
		title,
		description: carData.description?.substring(0, 160),
		ogImage: carData.image
	})
</script>

<template>
	<v-container class="mt-0 mt-sm-4 mt-md-8">
		<v-row>
			<v-col
				cols="12"
				sm="4"
				class="order-1 order-sm-2 contact"
			>
				<v-card title="Contact">
					<v-card-text>
						<a
							v-tooltip="'Open in Google Maps'"
							href="https://www.google.com/maps/dir/?api=1&destination_place_id=ChIJVenUkkwlx0cRX8NxKTYT6mQ&destination=Sluis+elf%2C+Broekstraat+8%2C+5711+CT+Someren%2C+Netherlands"
							target="_blank"
						>
							Broekstraat 8<br>
							5711 CT Someren<br>
							Nederland
						</a>
						<a
							href="tel:+31634439649"
							target="_blank"
						>
							+316-34439649
						</a>
						<a
							href="maitlo:info@mmcautos.com"
							target="_blank"
						>
							info@mmcautos.com
						</a>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col
				cols="12"
				sm="8"
				class="order-2 order-sm-1"
			>
				<h1 class="mt-0">
					{{ title }}
				</h1>
				<v-carousel
					v-if="car?.images?.length"
					crossfade
					hide-delimiters
					height="auto"
					class="my-8"
				>
					<v-carousel-item
						v-for="(src, i) in car.images"
						:key="i"
						:src="src"
						:aspect-ratio="4/3"
					/>
				</v-carousel>

				<p
					v-if="carData.description"
					class="mt-4 text-pre-wrap"
				>
					{{ carData.description }}
				</p>
			</v-col>
		</v-row>
	</v-container>
</template>

<style lang="scss" scoped>
	@use 'sass:map';
	@use '~/assets/css/vuetify';

	.contact {
		> .v-card {
			@media (map.get(vuetify.$display-breakpoints, 'sm-and-up')) {
				position: sticky;
				top: 84px;
			}
		}

		a {
			text-decoration: none;
			color: rgb(var(--v-theme-on-surface));
			display: block;
			transition: color .2s vuetify.$standard-easing;

			&:before {
				content: none;
			}

			&:hover {
				color: rgb(var(--v-theme-anchor));
			}

			+ a {
				margin-top: 1rem;
			}
		}
	}

	.v-carousel {
		background-color: rgb(var(--v-theme-surface));

		:deep(.v-window__controls) {
			opacity: 0;
			transition: opacity .2s vuetify.$standard-easing;
		}

		&:hover {
			:deep(.v-window__controls) {
				opacity: 1;
			}
		}
	}
</style>
