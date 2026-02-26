<script setup>
    import { useRouter } from 'vue-router'
    import api from '../api'
    import { ref, onMounted , computed } from 'vue'
    import { parseplaylistList, parsesonglist } from '@/util/parse'

    const router=useRouter()

    // 歌单列表
    const playList = ref([])
    const fetchPlayList = async () => {
        try {
            const res=await api.get('/personalized',{limit:10})
            const playlists=res.result||[]
            playList.value = parseplaylistList(playlists)
        } catch (error) {
            console.log("获取推荐歌单失败:",error);
            
        }
    }


    //推荐新音乐
    const newsongs = ref([])
    const fetchNewsongs = async () => {
        try {
            const res=await api.get('/personalized/newsong',{limit:10})
            const newsonglist=res.result||[]
            newsongs.value = parsesonglist(newsonglist)
        } catch (error) {
            console.log("获取推荐新音乐失败:",error);
        }
    }
 

    //歌手榜单
    const singerRank=ref([])
    const fetchSingerRank = async () => {
        try {
            const res=await api.get('/top/artists',{limit:100})
            singerRank.value = (res.artists||[]).map((artist,index)=>({
                id:artist.id,
                name:artist.name,
                rank:index+1,
                avatar:artist.picUrl,
            }))
        } catch (error) {
            console.log("获取歌手榜单失败:",error);
        }
    }
    //处理轮播图左右按钮
    const currentSingerSlide=ref(0)
    const SINGER_PAGE_SIZE=5
    const singerSlides=computed(()=>{
        const list=singerRank.value||[]
        const slides=[]
        for(let i=0;i<list.length;i+=SINGER_PAGE_SIZE){
            slides.push(list.slice(i,i+SINGER_PAGE_SIZE))
        }
        return slides
    })

    const prevSingerSlide=()=>{
        if(!singerSlides.value.length) return
        currentSingerSlide.value=(currentSingerSlide.value-1+singerSlides.value.length)%singerSlides.value.length
    }
    const nextSingerSlide=()=>{
        if(!singerSlides.value.length) return
        currentSingerSlide.value=(currentSingerSlide.value+1)%singerSlides.value.length
    }



    //歌手榜单交互
    const handlesearchsinger=(id,name)=>{
        if(!id) return
        router.push({
                name:'artistmusic',
                query:{
                    id:id,
                    name:name
                },
        })
    }
    // 点击歌单项
    const handlePlaylistClick=(id)=>{
        if(!id) return
        router.push({
                name:'musiclist',
                query:{id}
        })
    }

    // 播放歌曲
    const handlePlaySong=(id)=>{
        if(!id) return
        router.push({
            name:'player',
            query:{id}
        })
    }


    // 页面加载时获取数据
    onMounted(()=>{
        fetchPlayList()
        fetchNewsongs()
        fetchSingerRank()
    })

</script>

<template>
    <div class="hall-wrapper">
        <div class="inner">
            <!-- 推荐歌单 -->
            <h2 class="section-title">推荐歌单</h2>
            <ul class="playlist-list">
                <li v-for="item in playList" :key="item.id" class="playlist-item" @click="handlePlaylistClick(item.id)">
                    <div class="cover-wrapper">
                        <img :src="item.cover" :alt="item.title" class="cover-image" />
                    </div>
                    <div class="info">
                        <p class="title">{{ item.name }}</p>
                        <p class="desc">{{ item.desc }}</p>
                    </div>
                </li>
            </ul>
            <!-- 推荐新音乐 -->
            <h2 class="section-title section-title--sub">推荐新音乐</h2>
            <ul class="song-list">
                <li class="song-item" @click="handlePlaySong(song.id)" v-for="song in newsongs" :key="song.id">
                    <div class="song-cover">
                        <img :src="song.cover" :alt="song.name" class="song-image">
                    </div>
                    <div class="song-info">
                        <p class="song-name">{{ song.name }}</p>
                        <p class="song-artist">{{ song.artist }}</p>
                    </div>
                </li>
            </ul>
            <!-- 歌手榜单 -->
            <h2 class="section-title section-title--sub section-title--singer">歌手榜单</h2>
            <div class="singer-carousel" v-if="singerSlides.length">
                <div class="singer-carousel-track">
                    <div v-for="(slide,index) in singerSlides" :key="index" class="singer-slide" v-show="index==currentSingerSlide">
                        <ul class="singer-list">
                            <li v-for="singer in slide" :key="singer.id" class="singer-item" @click="handlesearchsinger(singer.id,singer.name)">
                                <div class="singer-avatar">
                                    <img :src="singer.avatar" :alt="singer.name">
                                </div>
                                <span class="singer-name">{{ singer.rank }} {{ singer.name }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="singer-carousel-controls" v-if="singerSlides.length>1">
                    <button class="singer-arrow" @click="prevSingerSlide">&lt;</button>
                    <button class="singer-arrow" @click="nextSingerSlide">&gt;</button>
                </div>
            </div>
        </div>
        
    </div>
</template>
<style scoped>
/* 推荐歌单 */
.section-title {
    font-size: 24px;
    margin: 20px 0 10px;
}
.playlist-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.playlist-item {
    width: 220px;
    height: 310px;
    margin-right: 1px;
}
.cover-wrapper {
    margin-bottom: 10px;
}
.cover-image {
    width: 100%;
    height: 220px;
    border-radius: 10px;
}
.cover-image:hover {
    transform: scale(1.05);
    transition: all 0.3s ease;
}
.info {
    text-align: center;
}
.title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
}
.desc {
    font-size: 14px;
    color: #666;
}


/* 推荐新音乐 */
.section-title--sub {
    font-size: 20px;
    margin: 30px 0 15px;
}
.song-list {
    display: flex;
    flex-direction: column;
    flex-wrap:wrap;
    justify-content: space-between;
    height: 400px;
}
.song-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    width: 48%;
}
.song-item:hover {
    background-color: rgba(125, 124, 124, 0.1);
    transition: all 0.3s ease;
    border-radius: 5px;
}
.song-cover {
    width: 60px;
    height: 60px;
    margin-right: 15px;
}
.song-image{
    width: 100%;
    height: 100%;
    border-radius: 5px;
}
.song-info {
    font-size: small;
}
.song-name {
    font-weight: bold; 
    margin-bottom: 5px;
}
.song-artist {
    color: #666;
}


/* 歌手榜单 */
.section-title--singer {
    margin-top: 40px;
}
.singer-carousel {
    position: relative;
    height: 300px;
}
.singer-carousel-track {
    transition: all 0.5s ease;
}
.singer-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}
.singer-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;    
    z-index: 999;
}
.singer-avatar {
    width: 180px;
    height: 180px;
    margin-bottom: 10px;
}
.singer-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}
.singer-name {
    font-size: 14px;
    color: #333;
}
.singer-carousel-controls {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
}
.singer-arrow {
    background-color: rgba(170, 148, 148, 0.5);
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 50px;
}
.singer-arrow:hover {
    background-color: rgba(72, 62, 62, 0.7);
    transition: all 0.3s ease;
}

</style>