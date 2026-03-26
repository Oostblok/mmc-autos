<script lang="ts" setup>
	interface Car {
		link: string
		image: string
		labels: string[]
		model: string
		type: string
		year: string
		fuelType: string
		mileage: string
	}

	interface CarsResponse {
		updatedAt: string
		cars: Car[]
	}

	const { data, pending, error } = useFetch<CarsResponse>('/cars.json')

	const cars = computed(() => data.value?.cars ?? [])

	watch(error, (err) => {
		if (err) console.error('Failed to fetch cars:', err)
	})
</script>

<template>
	<v-container>
		<v-row>
			<template v-if="pending || error">
				<v-col
					v-for="i in 9"
					:key="i"
					cols="6"
					md="4"
				>
					<v-skeleton-loader type="image, paragraph" />
				</v-col>
			</template>
			<template v-else>
				<v-col
					v-for="(car, i) in cars"
					:key="i"
					cols="6"
					md="4"
				>
					<v-card
						:href="car.link"
						target="_blank"
					>
						<v-img
							v-if="car.image"
							:alt="car.model"
							:src="car.image"
							class="mb-4"
						/>
						<v-card-text>
							<h4 class="my-0">
								{{ car.model }}
							</h4>
							<p
								v-if="car.type"
								class="mt-3"
							>
								{{ car.type }}
							</p>
							<div
								v-if="car.year || car.fuelType || car.mileage"
								class="d-flex justify-space-between mt-3 border-t-thin pt-3"
							>
								<div v-if="car.year">
									{{ car.year }}
								</div>
								<div v-if="car.fuelType">
									{{ car.fuelType }}
								</div>
								<div v-if="car.mileage">
									{{ car.mileage }}
								</div>
							</div>
						</v-card-text>
					</v-card>
				</v-col>
			</template>
		</v-row>
	</v-container>
</template>
