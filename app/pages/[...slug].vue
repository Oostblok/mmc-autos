<script setup lang="ts">
	import { componentNames } from '#components'

	type MinimarkNode = [string, Record<string, any>, ...(MinimarkContent[])]
	type MinimarkContent = MinimarkNode | string

	const route = useRoute()

	const { data: page } = await useAsyncData(
		`page-${route.path}`,
		() => queryCollection('content').path(route.path).first()
	)

	if (!page.value) {
	  throw createError({
	    statusCode: 404,
	    statusMessage: 'Pagina niet gevonden',
	    fatal: true
	  })
	}

	const groupedBody = computed(() => {
		const body = page.value?.body

		if (!body || !Array.isArray(body.value)) {
			return body
		}

		const rawNodes = body.value as MinimarkContent[]
		const nodes: MinimarkContent[] = []
		let proseBuffer: MinimarkContent[] = []

		const flushBuffer = () => {
			if (proseBuffer.length > 0) {
				nodes.push(['v-container', { class: 'md' }, ...proseBuffer])
				proseBuffer = []
			}
		}

		rawNodes.forEach((node) => {
			if (!Array.isArray(node)) {
				proseBuffer.push(node)
				return
			}

			const tagName = node[0]

			const pascalName = tagName
				.split('-')
				.map(part => part.charAt(0).toUpperCase() + part.slice(1))
				.join('')

			const isCustomComponent = componentNames.includes(pascalName) && !pascalName.startsWith('Prose')

			if (isCustomComponent) {
				flushBuffer()
				nodes.push(node)
			} else {
				proseBuffer.push(node)
			}
		})

		flushBuffer()

		return {
			...body,
			value: nodes
		}
	})
</script>

<template>
  <content-renderer
    v-if="page"
    :value="{
			...page,
			body: groupedBody
		}"
  />
</template>

<style lang="scss" scoped>
	:deep(.v-container.md) {
		p:not(:last-child) {
			margin-bottom: 1rem;
		}
	}
</style>
