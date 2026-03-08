<script setup>
import { RouterView,useRoute } from 'vue-router'
import Header from './components/header.vue'
import playlist from './components/playlist.vue';
import playercontrol from './components/playercontrol.vue';
import { onMounted ,computed} from 'vue';
import { usePlayer } from './stores/player';


const player=usePlayer()

onMounted(()=>{
  player.setCurrentSongid(0)
  player.getPlaylist()
})
</script>

<template>
  <div class="app">
    <Header />
    <RouterView />
    <playlist />
    <playercontrol />
  </div>
</template>
<style scoped>
.app {
  background-color: rgb(27, 21, 21);
  height: 90px;
}
</style>