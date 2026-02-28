<script setup>
import { RouterView } from 'vue-router'
import Header from './components/header.vue'

</script>

<template>
  <div class="app">
    <Header />
    <main class="main-view">
      <RouterView />
    </main>
  </div>
</template>
<style scoped>
.app {
  background-color: rgb(27, 21, 21);
  height: 90px;
}
</style>