<script lang="ts" setup>
	import type { CarsCollectionItem } from '@nuxt/content'
	import { formatMileage, formatPrice } from '~/assets/js/format'

	interface CarsResponse {
		updatedAt: string
		cars: CarsCollectionItem[]
	}

	defineProps({
		title: {
			type: String,
			default: undefined
		}
	})

	const { data, pending, error } = useFetch<CarsResponse>('/cars.json')

	const smallGrid = ref(false)

	const cars = computed(() => (data.value?.cars ?? []).map(car => ({
		...car,
		price: formatPrice(car.price),
		mileage: formatMileage(car.mileage),
		link: {
			href: car.link || undefined,
			slug: car.slug ? `/autos/${car.slug}` : undefined
		}
	})))

	const cols = computed(() => {
		if (smallGrid.value) {
			return {
				cols: 12,
				sm: 6,
				md: 4
			}
		}

		return {
			cols: 6,
			sm: 4,
			md: 3
		}
	})

	watch(error, (err) => {
		if (err) console.error('Failed to fetch cars:', err)
	})
</script>

<template>
	<v-container>
		<v-row align="center">
			<v-col>
				<h3
					v-if="title"
					class="ma-0"
				>
					{{ title }}
				</h3>
			</v-col>
			<v-col cols="auto">
				<v-btn
					color="on-background"
					variant="text"
					:icon="smallGrid ? 'mdi-grid-large' : 'mdi-grid'"
					@click="smallGrid = !smallGrid"
				/>
			</v-col>
		</v-row>
		<v-divider class="mt-2 mb-6" />
		<v-row>
			<template v-if="pending || error">
				<v-col
					v-for="i in 12"
					:key="i"
					v-bind="cols"
				>
					<v-skeleton-loader type="image, paragraph" />
				</v-col>
			</template>
			<template v-else>
				<v-col
					v-for="(car, i) in cars"
					:key="i"
					v-bind="cols"
				>
					<v-card
						:href="car.link.href"
						:to="car.link.slug"
						:target="car.link.slug ? '_self' : '_blank'"
					>
						<v-img
							v-if="car.image"
							:alt="car.model"
							:lazy-src="car.lazyImage"
							:src="car.image"
						>
							<div
								v-if="car.labels?.length"
								v-for="(label, i) in car.labels"
								:key="i"
								:class="['label', { export: label.includes('export') }]"
							>
								<template v-if="label.includes('€')">
									<span
										v-for="part in label.split('€')"
										:key="part"
									>
										{{ part }}
									</span>
								</template>
								<template v-else>
									{{ label }}
								</template>
							</div>
						</v-img>
						<v-card-text>
							<div class="d-flex align-start justify-space-between">
								<div class="pr-2">
									<div
										v-if="car.year"
										class="text-truncate"
									>
										<v-icon
											icon="mdi-calendar"
											size="small"
										/>
										{{ car.year }}
									</div>
									<div
										v-if="car.mileage"
										class="text-truncate"
									>
										<v-icon
											icon="mdi-speedometer"
											size="small"
										/>
										{{ car.mileage }}
									</div>
									<div
										v-if="car.fuelType"
										class="text-truncate"
									>
										<v-icon
											icon="mdi-gas-station"
											size="small"
										/>
										{{ car.fuelType }}
									</div>
								</div>
								<h5 class="my-0">
									{{ car.price }}
								</h5>
							</div>
							<h4
								class="mb-0 mt-5 pb-1 text-truncate"
								:title="car.title || car.model"
							>
								{{ car.title || car.model }}
							</h4>
						</v-card-text>
					</v-card>
				</v-col>
			</template>
		</v-row>
	</v-container>
</template>

<style lang="scss" scoped>
	:deep(.label) {
		position: absolute;
		top: 0;
		right: 0;
		background-color: rgba(var(--v-theme-primary), .8);
		color: rgb(var(--v-theme-on-primary));
		padding: .25rem .5rem;
		font-size: .75rem;

		&.export {
			right: auto;
			top: auto;
			left: 0;
			bottom: 0;

			color: rgb(var(--v-theme-on-surface));
			background-color: rgba(var(--v-theme-surface), .5);

			display: flex;
			flex-direction: column;
			align-items: center;

			> span:last-child {
				font-weight: bold;
			}
		}

		+ .label:not(.export) {
			top: 2rem;
		}
	}
</style>
