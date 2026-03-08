<script setup>
    import{ref,watch,nextTick, onMounted, computed} from 'vue'
    import { usePlayer } from '@/stores/player'
    import { fetchLyrics} from '@/api/fetch'
    import playercontrolUI from '@/components/playercontrolUI.vue'

    const player = usePlayer()
    const song=computed(()=>{
        return player.currentsong
    })
    const audioUrl=computed(()=>{
        return player.currentaudioUrl
    })
    const audioref=ref('')
    const songId=computed(()=>{
        return player.getCurrentSongid()
    })
    //加载数据
    const loadData=async()=>{
        try {       
                const lyricsData= await fetchLyrics(songId.value)
                // 更新数据
                player.currentlyrics = lyricsData.lyrics
                player.currentlyricstimestamp = lyricsData.timestamp
            } catch (error) {
                console.error('加载歌曲失败', error)
            }
    }
    //监听currentsongid变化重新读取歌曲信息
    watch(
        ()=>songId.value,
        ()=>{
            loadData()
        }
    )

    // 监听currentlyricindex使歌词滚动中间
    watch(
        () => player.currentlyricindex, 
        (newIndex) => {
        if (player.currentlyrics.length) {
            nextTick(() => {
                const lyricElement = document.getElementById(`lyric-${newIndex}`)
                if (lyricElement) {
                    lyricElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'  // 这将使元素滚动到容器中间
                    })
                }
            })
        }
    })
    
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
    onMounted(()=>{
        loadData()  
    })
</script>

<template>
    <div class="page">
        <div class="inner">
            <div class="player-main">
                <div class="player-left">
                    <div class="cover-wrap">
                        <div class="cover-disc">
                            <img class="cover-img" :src="song.cover" alt="专辑封面">
                        </div>
                    </div>
                    <div class="song-meta">
                        <h2 class="song-title">{{ song.name }}</h2>
                        <p class="song-artist">{{ song.artist }}</p>
                        <p class="song-album">{{ song.album }}</p>
                        <p>───无vip,播放vip歌曲只有30秒───</p>
                        <p>当前播放状态: {{ player.Playmode===1?'单曲循环':player.Playmode===2?'随机播放':'循环播放'  }}</p>
                    </div>
                </div>
                <div class="player-right">
                    <div class="lyrics-card">
                        <h3 class="lyrics-title">歌词</h3>
                        <div class="lyrics-content">
                            <template v-if="player.currentlyrics.length">
                                <p v-for="(line,index) in player.currentlyrics" :key="index" :class="{'lyrics-line--highlight' :index===player.currentlyricindex}" :id="`lyric-${index}`" class="lyrics-line">{{ line }}</p>
                            </template>
                            <p v-else class="lyrics-line">暂无歌词</p>
                        </div>
                    </div>
                </div>
            </div>
            <playercontrolUI />
        </div>
    </div>
</template>

<style scoped>
.page{
    background: radial-gradient(circle at top left,#2b2b2b,#000);
    display: flex;
    justify-content: center;
    padding: 40px 0;
}
.inner{
    display: flex;
    flex-direction: column;
    gap: 32px;
    justify-content: space-between;
}
.player-main{
    width: 100%;
    display: flex;
    gap: 32px;
}
.player-left{
    width: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.cover-wrap{
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle,#444,#111);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.7);
}
.cover-disc{
    width: 220px;
    height: 220px;
    border-radius: 50%;
    overflow:hidden;
}
.cover-img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.song-meta{
    margin-top: 20px;
    text-align:center;
    color: rgb(214, 209, 209);
}
.song-title{
    margin: 0;
    font-size: 22px;
    font-weight: 600;
}
.song-artist,.song-album{
    margin: 6px 0 0;
    font-size: 13px;
}
.player-right{
    flex:1;
    display:flex;
    flex-direction:column;
    justify-content:center;
}
.lyrics-card{
    width: 100%;
    max-height: 520px;
    padding: 18px 24px;
    border-radius: 16px;
    background: transparent;
    box-shadow: none;
    box-sizing: border-box;
}
.lyrics-title{
    margin: 0 0 16px;
    font-size: 18px;
    color:#fff;
    text-align: center;
    letter-spacing: 1px;
}
.lyrics-content{
    max-height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 0;
}
.lyrics-line{
    margin: 6px 0;
    font-size: 16px;
    line-height: 1.6;
    color:rgba(255,255,255,0.65);
    text-align: center;
    transition: color 0.2s ease,transform 0.2s ease;
    white-space: normal;
}
.lyrics-line--highlight{
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    transform: scale(1.02);
}
.lyrics-content::-webkit-scrollbar{
    width: 0;
    height: 0;
}
.lyrics-content{
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
}


.player-controls{
    width: 100%;
    padding: 16px 24px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.controls-main{
    display:flex;
    justify-content: center;
    align-items:center;
    gap:24px;
}
.btn-circle{
    border-radius: 50%;
    border:none;
    cursor: pointer;
    background: rgb(54, 41, 41);
    color: #cbc4c4;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 18px rgba(0,0,0,0.4);
}
.btn-large{
    width: 56px;
    height: 56px;
    font-size: 22px;
}
.btn-small{
    width: 40px;
    height: 40px;
    font-size: 18px;
}
.btn-circle:hover{
    transform:translateY(-1px);
}
.progress-wrap{
    display:flex;
    align-items:center;
    gap:12px;
}
.time-label{
    font-size: 12px;
    color:#c0c0c0;
}
.progress-bar{
    flex:1;
    height: 10px;
    border-radius: 999px;
    background: rgba(85, 78, 78, 0.927);
    overflow:hidden;
}
.progress-inner{
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg,#ff4b2b,#ff416c);
}
.btn-text,.extra-left,.extra-right,.audio-hidden{
    display: none;
}
.btn-text:hover{
    color:#fff;
}
@media (max-width: 1200px) {
    .player-inner{
        flex-direction: column;
    }
    .player-main{
        flex-direction: column;
        align-items: center;
    }
    .player-left{
        width: auto;
    }
}
</style>