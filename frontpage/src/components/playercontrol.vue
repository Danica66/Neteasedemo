<script setup>
import { handlePlaySong } from '@/utils';
import { usePlayer } from '@/stores/player';
import { computed, ref,watch ,nextTick} from 'vue';
import { fetchSongDetail,fetchSongUrl } from '@/api/fetch';
import { useRoute } from 'vue-router';
import playercontrolUI from './playercontrolUI.vue';

    const route=useRoute()
    const audioref=ref('')
    const player=usePlayer()
    const isopen=ref(false)
    const songId=computed(()=>{
        return player.getCurrentSongid()
    })
    const customClass = computed(() => {
        return route.name === 'player' ? 'player' : 'all'
    })
    const audioUrl=computed(()=>{
        return player.currentaudioUrl
    })
    const handleshowslider=()=>{
        isopen.value=!isopen.value
    }
    //加载数据
    const loadData=async()=>{
        if (!songId.value || songId.value === 0) return
        try {       
                // 并行请求
                const [songData, urlData] = await Promise.all([
                    fetchSongDetail(songId.value),
                    fetchSongUrl(songId.value)
                ])
                // 更新数据
                player.currentsong = songData
                player.currentaudioUrl = urlData
                // 初始化播放器
                player.init()
                isopen.value=true
                
            } catch (error) {
                console.error('加载歌曲失败', error)
            }
    }
    //id变化传数据
    watch(
        () => songId.value,
        (newId, oldId) => {
            //如果不是从非0变成0，正常执行(两个=不是三个=)
            if(!(newId==0&&oldId!=0)){
                loadData()
            }
        }
    )
    //监听url变化获取对象传回player
    watch(audioUrl, (newUrl) => {
        if (newUrl) {
            nextTick(() => {
                if (audioref.value) {
                    player.getAudio(audioref.value)
                }
            })
        }
    })

</script>
<template>
    <div :class="`${customClass}-style`">
        <div class="container" :class="{ open: isopen }">
            <div class="controls-smallclick" @click="handleshowslider">
                <div class="title" >{{ isopen?'↓':'↑' }}</div>
            </div>
            <div v-show="isopen">
                <div class="song-info">
                    <div class="cover-disc">
                        <img class="cover-img" @click="handlePlaySong" v-show="player.currentsong.cover" :src="player.currentsong.cover" alt="专辑封面">
                    </div>
                    <div class="song-meta">
                        <p class="song-title">{{ player.currentsong.name||'暂无歌曲' }}</p>
                        <p class="song-artist">{{ player.currentsong.artist }}</p>
                    </div>
                </div>
                <playercontrolUI />
                <audio :src="audioUrl" ref="audioref" v-if="audioUrl" class="audio-hidden" @loadedmetadata="player.LoadedMetaData" @timeupdate="player.Timeupdate" @ended="player.Endedplay"></audio>
            </div>
        </div>
    </div>
</template>
<style scoped>
.player-style{
    display: none;
}
.all-style{
    .container {
        position: fixed;
        width: 100%;
        height: 180px;
        margin: 0 auto;
        bottom: -180px;
        transition: bottom 0.3s ease;
        background-color: #1d1a1a;
        z-index: 999;
    }
    .container.open {
        bottom:0;  /* 展开时显示 */
    }
    .controls-smallclick {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        height: 40px;
        border-radius: 20px 20px 0 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        background-color: #181a1b;
        box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
        padding: 0 20px;
        color: rgb(242, 183, 183);
        font-weight: 500;
        transition: all 0.3s ease;
    }
    .info-main {
        align-items: center;
        gap: 20px;
    }
    .song-info {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: 50px;
    }
    .song-meta {
        min-width: 0;        /* 允许文字区域缩小 */
    }
    .song-title {
        font-size: 15px;
        font-weight: bold;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;     /* 限制最大宽度为父元素宽度 */
    }
    
    .song-artist {
        font-size: 13px;
        color: #ccc;
        margin: 2px 0 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;     /* 限制最大宽度为父元素宽度 */
    }
    
    
    
    .cover-disc{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow:hidden;
    }
    .cover-img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
}
</style>