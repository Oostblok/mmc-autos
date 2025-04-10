<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.path}`, () => queryCollection('content').path(route.path).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('content'))
</script>

<template>
  <main>
    <header>
      <nav v-if="navigation.length">
        <nuxt-link
          v-for="item in navigation"
          :key="item.stem"
          :to="item.path"
          :text="item.title"
        />
      </nav>
    </header>
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

  header {
    width: 100%;
    display: flex;
    justify-content: end;

    nav {
      padding: 1rem;

      > a {
        display: inline-block;
        position: relative;
        padding: 0 .5rem;
        text-decoration: none;
        color: #000;
        font: {
          family: 'Poppins', sans-serif;
          weight: 600;
        }

        transition: color .2s cubic-bezier(.4, 0, .2, 1);

        &:before {
          content: '';

          position: absolute;
          bottom: -4px;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #E2000D;

          transition: all .2s cubic-bezier(.4, 0, .2, 1);
        }

        &:hover,
        &.router-link-active {
          color: #E2000D;
        }

        &:hover:before {
          left: 0;
          width: 100%;
        }

        &:not(:last-child) {
          margin-right: 1rem;
        }
      }
    }
  }
</style>
