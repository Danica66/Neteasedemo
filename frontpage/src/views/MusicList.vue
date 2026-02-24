<script setup>
    import {useRoute, useRouter} from 'vue-router'
    import { ref,computed, onMounted } from 'vue'

    import api from '../api'
    const route=useRoute()
    const router=useRouter()

    //加载状态
    const loading=ref(false)
    

    //时间转换
    const formatDuration=(durationMs)=>{
    const minutes=Math.floor(durationMs/1000/60)
    const seconds=Math.floor((durationMs/1000)%60)
        return `${minutes}:${seconds.toString().padStart(2,'0')}`
    }
    
        
    // 歌单详情数据
    const playlistName=ref('')
    const tracks=ref([])
    const playlistId=computed(()=>{
        return route.query.id
    })
    const fetchPlaylistDetail=async(id)=>{
        try {
            // 开始加载
            loading.value=true
            // 获取歌单详情
            const res=await api.get('/playlist/detail',{id})
            playlistName.value=res.playlist?.name||'歌单'
            tracks.value=res.playlist.tracks?.map((track)=>{
                return {
                    id:track.id,
                    name:track.name,
                    artist:(track.ar||track.artists||[]).map((a)=>a.name).join('/'),
                    durationMs:track.dt||track.duration||0,
                    album:(track.al||track.album).name||'',
                }
            })||[]
        } catch (error) {
            console.log("获取歌单详情失败:",error);
        }finally{
            // 无论成功失败都结束加载状态
            loading.value=false
        }
    }

    // 播放歌曲
    const handlePlaySong=(id)=>{
        if(!id) return
        router.push({
            name:'player',
            query:{id}
        })
    }
    onMounted(()=>{
        fetchPlaylistDetail(playlistId.value)
    })
</script>
        
<template>
    <div class="musiclist-page">
        <div class="inner">
            <h2 class="title">{{ playlistName }}</h2>
            <div class="tip" v-if="loading">加载中...</div>
            <div class="tip" v-else-if="!tracks.length">暂无歌曲</div>
            <ul class="track-list" v-else>
                <li class="track-item" @click="handlePlaySong(track.id)" v-for="(track,index) in tracks" :key="track.id">
                    <span class="track-index">{{index+1}}</span>
                    <div class="track-main">
                        <span class="track-name">{{track.name}}</span>
                        <span class="track-artist">{{track.artist}}</span>
                    </div>
                    <div class="track-extra">
                        <span class="track-album">{{track.album}}</span>
                        <span class="track-duration">{{formatDuration(track.durationMs)}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>


<style scoped>
.musiclist-page{
    min-height: calc(100vh - 90px);
    padding: 24px 32px;
    box-sizing: border-box;
}
.title{
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
}
.tip{
    font-size: 18px;
    text-align: center;
    margin-top: 40px;
}
.track-item{
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgb(46, 7, 7);
    color: #666;
    font-size: 14px;
}
.track-item:hover{
    background-color: rgb(46, 7, 7);
    transition: background-color 0.3s ease;
    color: white;
}
.track-index{
    width: 30px;
}
.track-main{
    flex: 1;
    display: flex;
    flex-direction: column;
}
.track-name{
    font-size: 16px;
    color: white;
}
.track-album{
    margin-right: 10px;
}
</style>