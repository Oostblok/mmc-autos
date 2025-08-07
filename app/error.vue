<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const title = computed(() => {
  return [
    props.error?.statusCode,
    props.error?.statusMessage,
  ]
    .filter(Boolean)
    .join(' - ')
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <main>
    <div>
      <h6
        class="logo"
        @click="handleError"
      >
        MMC Auto's
      </h6>
      <h1>{{ title }}</h1>
      <a
        href="/"
        @click.prevent="handleError"
      >
        Klik hier om naar de home pagina te gaan
      </a>
    </div>
  </main>
</template>

<style lang="scss" scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;

    font: {
      size: 16px;
      family: 'Poppins', sans-serif;
      weight: 400;
    }

    .logo {
      cursor: pointer;
      font-size: 4rem;
      margin-bottom: 4rem;

      @media (min-width: 600px) {
        font-size: 5rem;
      }
    }

    h1 {
      font-size: 1.5rem;
      margin-bottom: 2rem;

      @media (min-width: 600px) {
        font-size: 2.5rem;
      }
    }

    > div {
      width: auto;
      max-width: 900px;
      text-align: center;

      a {
        display: inline-block;
        position: relative;
        color: #000;
        text-decoration: none;

        &:before {
          content: '';
          height: 2px;
          width: 0;
          background-color: #000;

          position: absolute;
          bottom: -4px;
          left: 50%;

          transition: all .2s cubic-bezier(.4, 0, .2, 1);
        }

        &:hover {
          &:before {
            left: 0;
            width: 100%;
          }
        }
      }
    }
  }
</style>
