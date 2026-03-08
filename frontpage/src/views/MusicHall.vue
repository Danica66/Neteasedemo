<script setup>
    import { ref, onMounted , computed } from 'vue'
    import { handleSingerPlaylist,handlePlaylist } from '@/utils'
    import { fetchSingerRank,fetchPlayLists,fetchNewSongs } from '@/api/fetch'
    import { usePlayer } from '@/stores/player'
    import card from '@/components/card.vue'
    const playList = ref([])
    const newsongs = ref([])
    const singerRank=ref([])
    const player=usePlayer()
    //加载数据
    const loadData = async () => {
        try {
            // 可以并行请求提升速度
            const [playlists, songs, artists] = await Promise.all([
                fetchPlayLists(),
                fetchNewSongs(),
                fetchSingerRank()
            ])
            playList.value = playlists
            newsongs.value = songs
            singerRank.value = artists
        } catch (error) {
            console.error('加载音乐大厅数据失败', error)
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
        loadData()
    })

</script>

<template>
    <div class="hall-wrapper">
        <div class="inner">
            <!-- 推荐歌单 -->
            <card customClass="playlist" :title="'推荐歌单'" :itemlist="playList" :handle="handlePlaylist"/>
            <!-- 推荐新音乐 -->
            <card customClass="newsonglist" :title="'推荐新音乐'" :itemlist="newsongs" :handle="player.Play"/>
            <!-- 歌手榜单 -->
            <h2 class="section-title--singer">歌手榜单</h2>
            <div class="singer-carousel" v-if="singerSlides.length">
                <div class="singer-carousel-track">
                    <div v-for="(slide,index) in singerSlides" :key="index" class="singer-slide" v-show="index==currentSingerSlide">
                        <ul class="singer-list">
                            <li v-for="singer in slide" :key="singer.id" class="singer-item" @click="handleSingerPlaylist(singer,singer.name)">
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