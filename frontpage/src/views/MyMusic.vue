<script setup>
    import {ref,onMounted} from 'vue'
    import { useUserStore } from '@/stores/user';
    import api from '../api'
    import { parseplaylistList,handlePlaylist,handleLogin} from '@/utils';
    import card from '@/components/card.vue';
    const userstore=useUserStore()

    //获取歌单
    const playlists=ref([])
    const fetchUserPlayLists=async()=>{
        try{
            const uid=userstore.user?.id
            const res=await api.get("/user/playlist",{uid})
            const playlist=res.playlist||[]
            playlists.value=parseplaylistList(playlist)
        }catch(err){
            console.log("获取歌单失败",err);
        }
    }
    onMounted(()=>{
        fetchUserPlayLists()
    })
</script>
<template>
    <div class="page">
        <div class="inner">
            <div v-if="!userstore.isLoggedIn" class="login-hint">
                <p class="hint-text">没登录哪来的音乐 ,->
                    <button class="hint-btn" type="button" @click="handleLogin">去登录</button>
                    <-
                </p>
            </div>
            <card v-else customClass="mymusiclist" :title="'我的音乐'" :itemlist="playlists" :handle="handlePlaylist"/>
        </div>
    </div>
</template>
<style scoped>
.hint-btn{
  padding: 5px 10px;
  transition: all 0.3s ease;
  border-radius: 20px;
  background-color: transparent;
  border: 0;
}
.hint-btn:hover{
    background-color: #ff0000;
    color:white
}
</style>