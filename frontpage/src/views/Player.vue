<script setup>
    import{ref,onMounted,computed,watch,nextTick} from 'vue'
    import { useRoute } from 'vue-router'
    import api from '../api'
    import { formatetime } from '@/util/formattime'
    const route = useRoute()

    // 获取歌曲
    const songTitle=ref("正在播放的歌曲")
    const songArtist=ref("歌手姓名")
    const songAlbum=ref("专辑名称")
    const songCover=ref("https://via.placeholder.com/260x260.png?text=Cover")
    const id = computed(() => route.query.id)
    const fetchSongDetail=async(ids)=>{
        try{
            const res=await api.get('/song/detail',{ids})
            const detail=(res.songs||[])[0]
            songTitle.value=detail.name||"未知歌曲"
            songArtist.value=(detail.ar||detail.artists||[]).map(a=>a.name).join(",")||"未知歌手"
            songAlbum.value=(detail.al||detail.album)?.name||"未知专辑"
            songCover.value=(detail.al||detail.album)?.picUrl||songCover.value

        }catch(error){
            console.error('获取歌曲详情失败',error)
            songTitle.value="正在播放的歌曲"
            songArtist.value="歌手姓名"
            songAlbum.value="专辑名称"
            songCover.value="https://via.placeholder.com/260x260.png?text=Cover"
        }
    }
    


    //获取歌词
    const lyrics=ref([])
    const timestamp=ref([])
    const fetchlyrics=async(id)=>{
        try{
            const res=await api.get('/lyric',{id})
            const raw=res.lrc?.lyric||''
            lyrics.value=parselyric(raw)
            timestamp.value=parsetimestamp(raw)
            // console.log(lyrics.value);            
            // console.log(timestamp.value);
            
        }catch(err){
            console.log("获取歌词失败",err)
            lyrics.value=[]
        }
    }
    //解析歌词
    const parselyric=(raw='')=>{
        return raw.split("\n").map((line)=>line.trim()).filter((line)=>line).map((line)=>{
            const text=line.replace(/^\[[^\]]*]/g,'').trim()
            return text||'~♫♫♫~'
        })
    }
    //解析时间戳
    const parsetimestamp=(raw='')=>{
        return raw.split("\n").map(line => line.trim()).filter(line => line).map(line => {
            const match = line.match(/^\[[^\]]+\]/)
            return match[0]
        })
    }



    //音乐播放地址
    const audioref=ref(null)
    const currenttime=ref(0)
    const duration=ref(0)
    const audioUrl=ref('')
    const isPlaying=ref(false)
    const fetchsongurl=async(id)=>{
        try{
            const res=await api.get("/song/url",{id})
            const item=(res.data||[])[0]
            audioUrl.value=item?.url||''
            currenttime.value=0
            duration.value=0
            isPlaying.value=false
        }catch(err){
            console.log("获取歌曲播放地址失败");
            audioUrl.value=""
            isPlaying.value=false
            
        }
    }
    
    
    
    //加载歌曲元数据
    const handleloadedmetadata=()=>{
        const audio=audioref.value
        duration.value=audio.duration||0
        currenttime.value=audio.currentTime||0    
    }

    //滚动歌词
    const currentindex=ref(0)
    const findExactLyricIndex = (currentTime) => {
        if (!timestamp.value.length) return -1
        const tolerance = 0.01 // 10毫秒的容差
        for (let i = 0; i < timestamp.value.length; i++) {
            // 如果当前时间非常接近某个时间戳（在容差范围内）
            if (Math.abs(timestamp.value[i] - currentTime) < tolerance) {
                return i
            }
            // 标准逻辑：当前时间介于当前时间戳和下一个时间戳之间
            if (timestamp.value[i] <= currentTime + tolerance) {
                if (i === timestamp.value.length - 1 || timestamp.value[i + 1] > currentTime + tolerance) {
                    return i
                }
            }
        }
        return 0
    }
    
    //播放交互细节
    const handletoggleplay=()=>{
        const audio=audioref.value
        if(audio.paused){
            audio.play().then(()=>{
                isPlaying.value=true
            }).catch(()=>{})
        }else{
            audio.pause()
            isPlaying.value=false
        }
    }
    const handleaudioended = () =>{
        isPlaying.value=false
    }
    const handletimeupdate = () =>{
        const audio=audioref.value
        currenttime.value=audio.currentTime
        duration.value=audio.duration
        //找歌词对应的currentindex
        currentindex.value=findExactLyricIndex(formatetime(currenttime.value*1000,1))
    }
    const handleprogressclick=(event)=>{
        const bar=event.currentTarget
        const rect=bar.getBoundingClientRect()
        const ratio=(event.clientX-rect.left)/rect.width
        const audio=audioref.value
        const newTime=duration.value*ratio
        audio.currentTime=newTime
        currenttime.value=newTime
    }

    // 监听currentindex使歌词滚动中间
    watch(currentindex, (newIndex) => {
        if (lyrics.value.length) {
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

    onMounted(() => {
        fetchSongDetail(id.value)
        fetchlyrics(id.value)
        fetchsongurl(id.value)
    })
</script>

<template>
    <div class="player-page">
        <div class="inner">
            <div class="player-main">
                <div class="player-left">
                    <div class="cover-wrap">
                        <div class="cover-disc">
                            <img class="cover-img" :src="songCover" alt="专辑封面">
                        </div>
                    </div>
                    <div class="song-meta">
                        <h2 class="song-title">{{ songTitle }}</h2>
                        <p class="song-artist">{{ songArtist }}</p>
                        <p class="song-album">{{ songAlbum }}</p>
                        <p>!!!无vip播放vip歌曲只有30秒!!!</p>
                    </div>
                </div>
                <div class="player-right">
                    <div class="lyrics-card">
                        <h3 class="lyrics-title">歌词</h3>
                        <div class="lyrics-content">
                            <template v-if="lyrics.length">
                                <p v-for="(line,index) in lyrics" :key="index" :class="{'lyrics-line--highlight' :index===currentindex}" :id="`lyric-${index}`" class="lyrics-line">{{ line }}</p>
                            </template>
                            <p v-else class="lyrics-line">暂无歌词</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="player-controls">
                <div class="controls-main">
                    <button class="btn-circle btn-large" @click="handletoggleplay">{{ isPlaying?"⏸":"▶" }}</button>
                </div>
                <div class="progress-wrap">
                    <span class="time-label">{{ formatetime(currenttime*1000) }}</span>
                    <div class="progress-bar" @click="handleprogressclick">
                        <div class="progress-inner" :style="{width:duration ? `${(currenttime/duration)*100}%` : '0%' }"></div>
                    </div>
                    <span class="time-label">{{ formatetime(duration*1000) }}</span>
                </div>
            <audio :src="audioUrl" ref="audioref" v-if="audioUrl" class="audio-hidden" @loadedmetadata="handleloadedmetadata" @timeupdate="handletimeupdate" @ended="handleaudioended"></audio>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-page{
    min-height:calc(100vh - 90px);
    background: radial-gradient(circle at top left,#2b2b2b,#000);
    display: flex;
    justify-content: center;
    padding: 40px 0;
    box-sizing: border-box;
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
    align-items:center;
    gap:24px;
}
.btn-circle{
    border-radius: 50%;
    border:none;
    cursor: pointer;
    background: #fff;
    color: #000;
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