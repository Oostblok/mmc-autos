<script setup lang="ts">
	import type { NuxtError } from '#app'

	const props = defineProps({
		error: {
			type: Object as () => NuxtError,
			default: () => ({ statusCode: 404, statusMessage: 'Pagina niet gevonden' })
		}
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
	    <v-img
		    src="/logo.jpg"
		    alt="MMC Auto's"
		    @click="handleError"
	    />
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

    h1 {
      font-size: 1.5rem;
      margin: 2rem 0;

      @media (min-width: 600px) {
        font-size: 2.5rem;
      }
    }

    > div {
      width: auto;
      max-width: 900px;
      text-align: center;

	    > .v-img {
		    max-width: 300px;
		    margin: 0 auto;
		    cursor: pointer;
	    }

      a {
        display: inline-block;
        position: relative;
        color: rgb(var(--v-theme-on-background));
        text-decoration: none;

        &:before {
          content: '';
          height: 2px;
          width: 0;
          background-color: rgb(var(--v-theme-on-background));

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
