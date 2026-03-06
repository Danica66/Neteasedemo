<script setup>
    import {ref,onMounted} from 'vue'
    import { useUserStore } from '@/stores/user';
    import { handlePlaylist,handleLogin} from '@/utils';
    import { fetchUserPlayLists } from '@/api/fetch';
    import card from '@/components/card.vue';
    const userstore=useUserStore()

    //加载数据
    const playlists=ref([])
    const loadData=async()=>{
        try {
            playlists.value=await fetchUserPlayLists(userstore.user?.id)
        } catch (error) {
            console.log("加载数据失败",error);
        }
    }
    onMounted(()=>{
        loadData()
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