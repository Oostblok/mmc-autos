<script setup lang="ts">
	import { useDisplay } from 'vuetify'
	import { formatMileage, formatPrice } from '~/assets/js/format'

	const route = useRoute()
	const { xs } = useDisplay()

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
	const carouselIndex = ref(0)

	const title = computed(() => {
		if (carData.title) return carData.title

		if (carData.model) return carData.model

		if (carData.make && carData.type) {
			return `${carData.make} ${carData.type}`
		}

		return ''
	})

	const tableData = computed(() => (
		Object.fromEntries(
			Object.entries({
				Merk: carData.make,
				Model: carData.type,
				Brandstoftype: carData.fuelType,
				Kilometertellerstand: carData.mileage ? `${formatMileage(carData.mileage)} km` : undefined,
				Vermogen: carData.power,
				Motorinhoud: carData.engineSize,
				Transmissie: carData.gearbox,
				Bouwjaar: carData.year,
				Kleur: carData.color,
				Carrosserie: carData.bodyType,
				Verkoopprijs: formatPrice(carData.price),
				'Exportprijs NETTO': formatPrice(carData.exportPrice)
			}).filter(([_, value]) => !!value)
		)
	))

	useSeoMeta({
		title,
		description: [carData.model, carData.description, carData.damage]
			.filter(Boolean)
			.join(' ')
			?.substring(0, 160),
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
				<div>
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
								href="mailto:info@mmcautos.com"
								target="_blank"
							>
								info@mmcautos.com
							</a>
						</v-card-text>
					</v-card>
					<v-card
						v-if="carData.description || carData.damage"
						class="mt-4 description tall"
					>
						<v-card-text>
							<div v-if="carData.damage">
								<h6 class="my-0">
									Schades
								</h6>
								<p class="text-pre-wrap mt-1">
									{{ carData.damage }}
								</p>
							</div>
							<div v-if="carData.description">
								<h6 :class="['my-0', { 'mt-8': carData.damage }]">
									Bijzonderheden
								</h6>
								<p class="text-pre-wrap mt-1">
									{{ carData.description }}
								</p>
							</div>
						</v-card-text>
					</v-card>
				</div>
			</v-col>
			<v-col
				cols="12"
				sm="8"
				class="order-2 order-sm-1"
			>
				<h1 class="mt-0">
					{{ title }}
				</h1>

				<template v-if="car?.images?.length">
					<v-carousel
						v-model="carouselIndex"
						crossfade
						hide-delimiters
						show-arrows="hover"
						height="auto"
						class="mt-8"
					>
						<v-carousel-item
							v-for="(src, i) in car.images"
							:key="i"
							:src="src"
							:aspect-ratio="4/3"
						/>
					</v-carousel>
					<div
						v-if="!xs"
						class="carousel-thumbnails"
					>
						<div
							v-for="(image, i) in car.images"
							:key="i"
						>
							<v-img
								:src="image"
								:aspect-ratio="4/3"
								@click="carouselIndex = i"
							/>
						</div>
					</div>
				</template>
				<v-table
					class="mt-2 mb-4"
					hover
				>
					<tbody>
						<tr
							v-for="(value, label) in tableData"
							:key="label"
						>
							<td>{{ label }}</td>
							<td>{{ value || '-' }}</td>
						</tr>
					</tbody>
				</v-table>
				<v-card
					v-if="carData.description || carData.damage"
					class="my-4 text-pre-wrap description short"
				>
					<v-card-text>
						<div v-if="carData.damage">
							<h6 class="my-0">
								Schades
							</h6>
							<p class="text-pre-wrap mt-1">
								{{ carData.damage }}
							</p>
						</div>
						<div v-if="carData.description">
							<h6 :class="['my-0', { 'mt-8': carData.damage }]">
								Bijzonderheden
							</h6>
							<p class="text-pre-wrap mt-1">
								{{ carData.description }}
							</p>
						</div>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<style lang="scss" scoped>
	@use 'sass:map';
	@use '~/assets/css/vuetify';

	.contact {
		> div {
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
	}

	.carousel-thumbnails {
		margin: .25rem -.25rem -.25rem -.25rem;

		> div {
			width: calc(100% / 6);
			padding: .25rem;
			display: inline-block;

			@media (map.get(vuetify.$display-breakpoints, 'lg-and-up')) {
				width: calc(100% / 8);
			}

			> .v-img {
				cursor: pointer;
				width: 100%;
			}
		}
	}

	.description {
		@media (max-height: 899px) {
			&.tall {
				display: none;
			}
		}

		@media (min-height: 900px) {
			&.short {
				display: none;
			}
		}
	}
</style>
