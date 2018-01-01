<template>
  <div id="app">
    <h1 :class="app.item">{{ msg }}</h1>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data() {
      return {
        msg: 'Hello World'
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
