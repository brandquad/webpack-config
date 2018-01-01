<template>
  <div id="app">
    <h1 :class="{ [app.item]: true, [app2.item]: true }" @click="click">{{ msg }}</h1>
    <test-vue/>
  </div>
</template>

<script>
  export default {
    name: 'app',

    components: {
      'test-vue': () => import('./Test.vue')
    },

    data() {
      return {
        msg: 'Hello World'
      }
    },

    methods: {
      click() {
        return import('./Test.vue')
      }
    }
  }
</script>

<style lang="stylus" module="app">
  $red = red
  .item
    color: $red
</style>

<style lang="scss" module="app2">
  .item {
    color: $green
  }
</style>
