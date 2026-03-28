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

	const smallPictures = ref(false)
	const showFilters = ref(true) // TODO: False in het begin

	const cars = computed(() => {
		let filtered = [...data.value?.cars || []]

		if (filters.make) {
			filtered = filtered.filter(car => car.make === filters.make)
		}

		if (filters.fuelType) {
			filtered = filtered.filter(car => car.fuelType === filters.fuelType)
		}

		if (filters.gearboxType) {
			filtered = filtered.filter(car => car.gearbox === filters.gearboxType)
		}

		if (filters.price && filters.price.length === 2) {
			const [minPrice, maxPrice] = filters.price
			filtered = filtered.filter(car => {
				const price = Number(car.price)
				return price >= minPrice && price <= maxPrice
			})
		}

		if (filters.engineSize && filters.engineSize.length === 2) {
			const [minEngineSize, maxEngineSize] = filters.engineSize
			filtered = filtered.filter(car => {
				const engineSize = Number(car.engineSize?.replace(/\D/g, ""))
				return engineSize >= minEngineSize && engineSize <= maxEngineSize
			})
		}

		if (filters.mileage && filters.mileage.length === 2) {
			const [minMileage, maxMileage] = filters.mileage
			filtered = filtered.filter(car => {
				const mileage = Number(car.mileage)
				return mileage >= minMileage && mileage <= maxMileage
			})
		}

		return filtered
	})

	const formattedCars = computed(() =>
		cars.value.map(car => ({
			...car,
			price: formatPrice(car.price),
			mileage: formatMileage(car.mileage),
			link: {
				href: car.link || undefined,
				slug: car.slug ? `/autos/${car.slug}` : undefined
			}
		}))
	)

	const cols = computed(() => {
		if (smallPictures.value) {
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

	const filters = reactive({
		make: null,
		fuelType: null,
		gearboxType: null,
		price: [0, 0],
		engineSize: [0, 0],
		mileage: [0, 0]
	})

	const filterDefaults = reactive({
		price: [0, 0],
		engineSize: [0, 0],
		mileage: [0, 0]
	})

	const activeFilters = computed(() =>
		Object.entries(filters).filter(([key, value]) => {
			if (value == null) return false

			if (typeof value === 'string' && value !== '') return true

			if (typeof value === 'number') return true

			if (Array.isArray(value) && filterDefaults[key]) {
				const [min, max] = filterDefaults[key]
				return value[0] !== min || value[1] !== max
			}

			return true
		})
	)

	const filterOptions = computed(() => {
		const currentCars = cars.value
		const allCars = data.value?.cars || []

		const activeFiltersCount = activeFilters.value.length

		const source = activeFiltersCount <= 1 ? allCars : currentCars

		const countValues = (arr: CarsCollectionItem[], key: keyof CarsCollectionItem) =>
			arr.reduce((acc, item) => {
				const val = item[key]
				if (val) acc[val] = (acc[val] || 0) + 1
				return acc
			}, {} as Record<string, number>)

		const formatCounts = (counts: Record<string, number>) =>
			Object.entries(counts).map(([value, count]) => ({
				title: `${value} (${count})`,
				value
			}))

		const prices = source.map(c => Number(c.price)).filter(Boolean)
		const engineSizes = source.map(c => Number(c.engineSize?.replace(/\D/g, ""))).filter(Boolean)
		const mileages = source.map(c => Number(c.mileage)).filter(Boolean)
		const years = source.map(c => Number(c.year)).filter(Boolean)

		return {
			makes: formatCounts(countValues(source, 'make')).sort((a, b) => a.value.localeCompare(b.value)),
			fuelTypes: formatCounts(countValues(source, 'fuelType')),
			gearboxTypes: formatCounts(countValues(source, 'gearbox')),
			price: { min: Math.min(...prices), max: Math.max(...prices) },
			engineSize: { min: Math.min(...engineSizes), max: Math.max(...engineSizes) },
			mileage: { min: Math.min(...mileages), max: Math.max(...mileages) },
			year: { min: Math.min(...years), max: Math.max(...years) }
		}
	})

	const resetFilters = () => {
		filters.make = null
		filters.fuelType = null
		filters.gearboxType = null
		filters.price = [...filterDefaults.price]
		filters.engineSize = [...filterDefaults.engineSize]
		filters.mileage = [...filterDefaults.mileage]
	}

	watch(error, (err) => {
		if (err) console.error('Failed to fetch cars:', err)
	})

	watch(() => data.value?.cars, (cars) => {
		if (!cars?.length) return

		const prices = cars.map(c => Number(c.price)).filter(Boolean)
		const engineSizes = cars.map(c => Number(c.engineSize?.replace(/\D/g, ""))).filter(Boolean)
		const mileages = cars.map(c => Number(c.mileage)).filter(Boolean)

		filterDefaults.price = [Math.min(...prices), Math.max(...prices)]
		filterDefaults.engineSize = [Math.min(...engineSizes), Math.max(...engineSizes)]
		filterDefaults.mileage = [Math.min(...mileages), Math.max(...mileages)]

		filters.price = [...filterDefaults.price]
		filters.engineSize = [...filterDefaults.engineSize]
		filters.mileage = [...filterDefaults.mileage]
	}, { immediate: true })
</script>

<template>
	<v-container>
		<v-row
			align="center"
			class="toolbar"
		>
			<v-slide-x-reverse-transition>
				<v-card
					v-show="showFilters"
					class="filters"
				>
					<v-card-title class="d-flex align-center">
						<v-icon
							icon="mdi-filter-cog"
							size="x-small"
							class="mr-4"
						/>
						<span>Filters</span>
						<v-spacer />
						<v-btn
							icon="mdi-close"
							density="compact"
							variant="text"
							@click="showFilters = false"
						/>
					</v-card-title>
					<v-divider />
					<v-card-text>
						<v-autocomplete
							v-model="filters.make"
							label="Merk"
							:items="filterOptions.makes"
							clearable
						/>
						<v-autocomplete
							v-model="filters.fuelType"
							label="Brandstof"
							:items="filterOptions.fuelTypes"
							clearable
						/>
						<v-autocomplete
							v-model="filters.gearboxType"
							label="Transmissie"
							:items="filterOptions.gearboxTypes"
							clearable
						/>
						<v-label>Prijs</v-label>
						<v-range-slider
							v-model="filters.price"
							:min="filterOptions.price.min"
							:max="filterOptions.price.max"
							thumb-label="hover"
							step="1"
						/>
						<v-label>Motorinhoud</v-label>
						<v-range-slider
							v-model="filters.engineSize"
							:min="filterOptions.engineSize.min"
							:max="filterOptions.engineSize.max"
							hint="aantal cc"
							thumb-label="hover"
							step="1"
						/>
						<v-label>Kilometerstand</v-label>
						<v-range-slider
							v-model="filters.mileage"
							:min="filterOptions.mileage.min"
							:max="filterOptions.mileage.max"
							thumb-label="hover"
							step="1"
							hide-details
						/>
					</v-card-text>
					<div class="ma-2">
						<v-btn
							class="mb-2"
							block
							color="on-background"
							variant="outlined"
							:disabled="activeFilters.length === 0"
							text="Reset"
							@click="resetFilters"
						/>
						<v-btn
							block
							text="Filter"
							variant="flat"
						/>
					</div>
				</v-card>
			</v-slide-x-reverse-transition>
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
					v-tooltip="smallPictures ? 'Kleinere foto\'s' : 'Grotere foto\'s'"
					color="on-background"
					variant="text"
					:icon="smallPictures ? 'mdi-grid' : 'mdi-grid-large'"
					@click="smallPictures = !smallPictures"
				/>
				<v-btn
					v-tooltip="showFilters ? 'Verberg filters' : 'Toon filters'"
					color="on-background"
					variant="text"
					:icon="showFilters ? 'mdi-filter-off' : 'mdi-filter'"
					@click="showFilters = !showFilters"
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
			<template v-else-if="formattedCars.length === 0">
				<v-alert
					text="Er zijn geen auto's gevonden."
					type="info"
					variant="outlined"
				/>
			</template>
			<template v-else>
				<v-col
					v-for="(car, i) in formattedCars"
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
	@use 'sass:map';
	@use '~/assets/css/vuetify';

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

	.toolbar {
		container-type: scroll-state;
		position: sticky;
		top: var(--v-layout-top);
		padding: .5rem 0;
		z-index: 10;

		background-color: rgb(var(--v-theme-background));

		&:after {
			content: '';
			height: 0;
			width: 100%;
			position: absolute;
			bottom: 0;
			border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
			opacity: 0;
		}

		@container scroll-state(stuck: top) {
			&:after {
				opacity: 1;
			}
		}
	}

	.filters {
		position: absolute;
		z-index: 15;
		right: 0;
		top: .5rem;
		min-width: 300px;
	}
</style>
