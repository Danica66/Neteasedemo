<script setup>
    import {ref,onMounted} from 'vue'
    import { useUserStore } from '@/stores/user';
    import api from '../api'
    import { useRouter} from 'vue-router';
    import { parseplaylistList } from '@/utils';

    
    const router=useRouter()
    const userstore=useUserStore()


    //跳转登录
    const handlegologin=()=>{
        router.push("/login")
    }


    //跳转歌单
    const handleopenplaylist=(id)=>{
        router.push({
            name:"musiclist",
            query:{id}
        })
    }
    
    
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
    <div class="mymusic-page">
        <div class="inner">
            <div v-if="!userstore.isLoggedIn" class="login-hint">
                <p class="hint-text">没登录哪来的音乐 ,->
                    <button class="hint-btn" type="button" @click="handlegologin">去登录</button>
                    <-
                </p>
            </div>
            <div v-else>
                <h2 class="title">我的音乐</h2>
                <div v-if="!playlists.length" class="tip">没歌</div>
                <ul v-else class="playlist-list">
                    <li class="playlist-item" @click="handleopenplaylist(item.id)" v-for="item in playlists" :key="item.id">
                        <div class="cover">
                            <img :src="item.cover" alt="封面">
                        </div>
                        <div class="info">
                            <p class="name">{{ item.name }}</p>
                            <p class="count">共 {{ item.trackCount }} 首</p>
                        </div>
                    </li>
                </ul>
            </div>
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
.mymusic-page{
    min-height: calc(100vh - 90px);
    padding: 24px 32px;
}
.title{
    margin-bottom: 16px;
}
.tip{
    font-size: 18px;
    text-align: center;
    margin-top: 40px;
}
.playlist-list{
    display: flex;
    flex-wrap: wrap;
    gap:20px
}
.playlist-item{
    width: 270px;
    height: 360px;
    background: #f7f1f1;
    align-items: center;
    border-radius: 5px;
    box-shadow: 1px 1px 5px black;
}
.playlist-item:hover {
    cursor: pointer;
    transform: scale(1.05);
    transition: all 0.3s ease;
}   
.cover img{
    width: 100%;
    height: 100%;
    border-radius: 5px 5px 0 0;
}
.info{
    padding: 10px;
    height: 100px;
}
</style>