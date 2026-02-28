<script setup>
    import api from '../api'
    import { ref, onMounted , computed } from 'vue'
    import { parseplaylistList, parsesingerlist, parsesonglist,handlePlaySong,handleSingerPlaylist,handlePlaylist } from '@/utils'
    import card from '@/components/card.vue'
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
            // console.log(newsonglist);
            newsongs.value = parsesonglist(newsonglist)
            // console.log(newsongs.value);
            
        } catch (error) {
            console.log("获取推荐新音乐失败:",error);
        }
    }
 

    //歌手榜单
    const singerRank=ref([])
    const fetchSingerRank = async () => {
        try {
            const res=await api.get('/top/artists',{limit:100})
            const singerlist=res.artists||[]
            singerRank.value = parsesingerlist(singerlist)
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
            <card customClass="playlist" :title="'推荐歌单'" :itemlist="playList" :handle="handlePlaylist"/>
            <!-- 推荐新音乐 -->
            <card customClass="newsonglist" :title="'推荐新音乐'" :itemlist="newsongs" :handle="handlePlaySong"/>
            <!-- 歌手榜单 -->
            <h2 class="section-title--singer">歌手榜单</h2>
            <div class="singer-carousel" v-if="singerSlides.length">
                <div class="singer-carousel-track">
                    <div v-for="(slide,index) in singerSlides" :key="index" class="singer-slide" v-show="index==currentSingerSlide">
                        <ul class="singer-list">
                            <li v-for="singer in slide" :key="singer.id" class="singer-item" @click="handleSingerPlaylist(singer.id,singer.name)">
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