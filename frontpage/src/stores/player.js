import { defineStore } from "pinia";
import { formatetime } from "@/utils";
import { ref,computed } from "vue";
export const usePlayer=defineStore('player',()=>{
    const currenttime=ref(0)
    const duration=ref(0)
    const isPlaying=ref(false)
    const currentindex=ref(0)
    const lyrics=ref([])
    const timestamp=ref([])
    const audio=ref(null)
    const getAudio=(audioref)=>{
        audio.value=audioref
    }

    //加载歌曲元数据
    const LoadedMetaData=()=>{
        duration.value=audio.value.duration||0
        currenttime.value=audio.value.currentTime||0    
    }

    //点击播放暂停图标切换
    const Toggleplay=()=>{
        if(audio.value.paused){
            audio.value.play().then(()=>{
                isPlaying.value=true
            }).catch(()=>{})
        }else{
            audio.value.pause()
            isPlaying.value=false
        }
    }
    //结尾暂停
    const Endedplay = () =>{
        isPlaying.value=false
    }
    //正常播放
    const Timeupdate = () =>{
        currenttime.value=audio.value.currentTime
        duration.value=audio.value.duration
        //找歌词对应的currentindex
        currentindex.value=findExactLyricIndex(formatetime(currenttime.value*1000,1))
    }
    //计算歌词位置
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
    //计算点击跳转进度条位置
    const Progressclick=(event)=>{
        const bar=event.currentTarget
        const rect=bar.getBoundingClientRect()
        const ratio=(event.clientX-rect.left)/rect.width
        const newTime=duration.value*ratio
        audio.value.currentTime=newTime
        currenttime.value=newTime
    }

    return {
        audio,
        isPlaying,
        currenttime,
        duration,
        currentindex,
        lyrics,
        timestamp,
        LoadedMetaData,
        Toggleplay,
        Endedplay,
        Timeupdate,
        Progressclick,
        getAudio
    }
})