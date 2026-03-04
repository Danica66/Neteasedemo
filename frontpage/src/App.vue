<script setup>
import { RouterView } from 'vue-router'
import Header from './components/header.vue'
import playlist from './components/playlist.vue';
import { onMounted } from 'vue';
import { usePlayer } from './stores/player';

const player=usePlayer()

onMounted(()=>{
  player.getPlaylist()
})
</script>

<template>
  <div class="app">
    <Header />
    <RouterView />
    <playlist />
  </div>
</template>
<style scoped>
.app {
  background-color: rgb(27, 21, 21);
  height: 90px;
}
</style>