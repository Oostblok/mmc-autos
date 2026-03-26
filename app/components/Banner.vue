<script setup lang="ts">
	import { joinURL } from 'ufo'

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

	const config = useRuntimeConfig()

	const src = computed(() => props.src.startsWith('/')
		? joinURL(config.app.baseURL, props.src)
		: props.src)

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
			:cover="!!aspectRatio"
		/>
	</v-container>
</template>
