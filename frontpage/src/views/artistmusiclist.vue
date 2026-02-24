<script setup>
    import api from '../api'
    import {ref,onMounted,computed} from 'vue'
    import { useRoute,useRouter } from 'vue-router' 

    const playlist=ref([])
    const router=useRouter()
    const route=useRoute()    
    const id=computed(()=>{
        return route.query.id
    })
    const artistname=computed(()=>{
        return route.query.name
    })

    //加载状态
    const loading=ref(false)
    

    //时间转换
    const formatDuration=(durationMs)=>{
    const minutes=Math.floor(durationMs/1000/60)
    const seconds=Math.floor((durationMs/1000)%60)
        return `${minutes}:${seconds.toString().padStart(2,'0')}`
    }

    //拿歌
    const fetchartistsong=async(id)=>{
        try{
            loading.value=true
            const res=await api.get('/artist/songs',{id,limit:1000})
            console.log(res);
            console.log(artistname.value);
            playlist.value=res.songs.map((song)=>{
                return {
                    id:song.id,
                    name:song.name,
                    artist:(song.ar||song.artists||[]).map((a)=>a.name).join('/'),
                    durationMs:song.dt||song.duration||0,
                    album:(song.al||song.album).name||'',
                }
            })||[]
        }catch(err){
            console.log("获取歌手歌曲失败",err);
        }finally{
            loading.value=false
        }
        
    }

    //跳转播放
    const handlePlaySong=(id)=>{
        if(!id) return
        router.push({
            name:'player',
            query:{id}
        })
    }


    onMounted(()=>{
        fetchartistsong(id.value)
    })

</script>
<template>
    <div class="artistsonglist-page">
        <div class="inner">
            <h2 class="title">{{ artistname }}{{playlist.length}}首歌(最多200首)</h2>
            <div class="tip" v-if="loading">加载中...</div>
            <div class="tip" v-else-if="!playlist.length">暂无歌曲</div>
            <ul class="song-list" v-else>
                <li class="song-item" @click="handlePlaySong(song.id)" v-for="(song,index) in playlist" :key="song.id">
                    <span class="song-index">{{index+1}}</span>
                    <div class="song-main">
                        <span class="song-name">{{song.name}}</span>
                        <span class="song-artist">{{song.artist}}</span>
                    </div>
                    <div class="song-extra">
                        <span class="song-album">{{song.album}}</span>
                        <span class="song-duration">{{formatDuration(song.durationMs)}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>


<style scoped>
.artistsonglist-page{
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
.song-item{
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgb(46, 7, 7);
    color: #666;
    font-size: 14px;
}
.song-item:hover{
    background-color: rgb(46, 7, 7);
    transition: background-color 0.3s ease;
    color: white;
}
.song-index{
    width: 30px;
}
.song-main{
    flex: 1;
    display: flex;
    flex-direction: column;
}
.song-name{
    font-size: 16px;
    color: white;
}
.song-album{
    margin-right: 10px;
}
</style>