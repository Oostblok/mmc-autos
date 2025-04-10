<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('page-' + route.path, () => {
  return queryCollection('content').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <main>
    <div>
      <ContentRenderer
        v-if="page"
        :value="page"
      />
    </div>
  </main>
</template>

<style lang="scss">
  @for $i from 1 to 7 {
    h#{$i} {
      color: #E2000D;
      font: {
        family: 'Poppins', sans-serif;
        weight: 800;
      }
      margin-bottom: 1rem;
    }
  }

  h1 {
    font-size: 4rem;
  }

  h2 {
    font-size: 3.5rem;
  }

  h3 {
    font-size: 3rem;
  }

  h4 {
    font-size: 2.125rem;
  }

  h5 {
    font-size: 1.5rem;
  }

  h6 {
    font-size: 1.25rem;
  }

  b, strong {
    font-weight: 600;
  }
</style>

<style scoped lang="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;

    font: {
      size: 16px;
      family: 'Poppins', sans-serif;
      weight: 400;
    }

    > div {
      width: 90vw;
      max-width: 1200px;

      :deep(a.link) {
        display: inline-block;
      }

      :deep(p:not(:last-child)) {
        margin-bottom: 1em;
      }
    }
  }
</style>
