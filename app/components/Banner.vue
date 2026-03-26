<script setup lang="ts">
	const props = defineProps({
		src: {
			type: String,
			required: true
		},
		aspectRatio: {
			type: String,
			default: undefined,
			validator: v => !!v && /\d+:\d+$/.test(v.toString())
		},
		fluid: {
			type: Boolean,
			default: true
		},
		alt: {
			type: String,
			default: undefined
		}
	})

	const aspectRatio = computed(() => {
		const [w, h] = props.aspectRatio?.split(':').map(Number) || []

		if (!Number.isInteger(w) || !Number.isInteger(h)) {
			return undefined
		}

		return w! / h!
	})
</script>

<template>
	<v-container
		:fluid="fluid"
		class="pa-0"
	>
		<v-img
			:src="src"
			:alt="alt"
			:aspect-ratio="aspectRatio"
			cover
		/>
	</v-container>
</template>
