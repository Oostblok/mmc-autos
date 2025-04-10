<template>
  <div
    class="iframe-container"
    :style="{ 'padding-top': paddingTop }"
  >
    <iframe
      :src="src"
      frameborder="0"
      scrolling="no"
      tabindex="0"
    />
  </div>
</template>

<script setup lang="ts">
const { src, aspectRatio } = defineProps({
  src: {
    type: String,
    required: true
  },
  aspectRatio: {
    type: String,
    default: '1:2',
    validator: v => !!v && /\d+:\d+$/.test(v.toString())
  }
})

const paddingTop = computed(() => {
  const [width, height] = aspectRatio.split(':').map(value => parseInt(value, 10))

  return width && height ? `${(height / width) * 100}%` : '100%'
})
</script>

<style scoped lang="scss">
  .iframe-container {
    position: relative;

    width: 100%;
    height: 100%;

    > iframe {
      height: 100%;
      width: 100%;

      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      top: 0;
    }
  }
</style>
