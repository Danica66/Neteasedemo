import { defineStore } from "pinia";
import { formatetime } from "@/utils";
import { ref } from "vue";
export const PlayMode = {
    SINGLE: 1,      // 单曲循环
    RANDOM: 2,      // 随机播放
    LOOP: 3         // 列表循环
}
export const usePlayer=defineStore('player',()=>{
    const PLAYMODE_KEY='playmode'
    const SONGID_KEY='currentsongid'
    const PLAYLIST_KEY="playlist"
    
    const currenttime=ref(0)
    const duration=ref(0)
    const isPlaying=ref(false)
    const currentlyricindex=ref(0)
    const lyrics=ref([])
    const lyricstimestamp=ref([])
    const audio=ref(null)
    const playlist=ref([])
    const currentsongid=ref(0)
    const currentlistindex=ref(0)
    const Playmode=ref(PlayMode.LOOP)


    //把歌曲加入播放列表
    const addPlaylist=(song)=>{
        if(!playlist.value.some(s => s.id === song.id)){
            if (playlist.value===null) {
                playlist.value=[]
            }   
            playlist.value.push(song)
        }
    }
    //改变播放模式
    const changePlaymode=()=>{
        Playmode.value=(Playmode.value+1)%3+1
        localStorage.setItem(PLAYMODE_KEY,JSON.stringify(Playmode.value))
    }
    //上一曲
    const upPlaylist=()=>{
        if(playlist.value.length===0)return
        switch(Playmode.value){ 
            case PlayMode.SINGLE:
                LoadedMetaData()//处理该模式下上下一曲图标未变换的问题
                break;
            case PlayMode.RANDOM:
                currentlistindex.value=Math.floor(Math.random() * playlist.value.length)
                break;
            case PlayMode.LOOP:
                currentlistindex.value=(currentlistindex.value-1+playlist.value.length)%playlist.value.length
                break;
        }
        setCurrentSongid(playlist.value[currentlistindex.value].id)   
    }
    //下一曲
    const downPlaylist=()=>{
        if(playlist.value.length===0)return
        switch(Playmode.value){
            case PlayMode.SINGLE:
                LoadedMetaData()
                break;
            case PlayMode.RANDOM:
                currentlistindex.value=Math.floor(Math.random() * playlist.value.length)
                break;
            case PlayMode.LOOP:
                currentlistindex.value=(currentlistindex.value+1)%playlist.value.length
                break;
        }
        setCurrentSongid(playlist.value[currentlistindex.value].id)
    }   
    //设置currentlistindex
    const setCurrentListIndex=(index)=>{
        currentlistindex.value=playlist.value==[]?0:index
    }
    //设置当前id
    const setCurrentSongid=(id)=>{
        currentsongid.value=id
        localStorage.setItem(SONGID_KEY,id)
    }
    
    //获取id
    const getCurrentSongid=()=>{
        currentsongid.value=localStorage.getItem(SONGID_KEY)
        return currentsongid.value
    }
    //删除id
    const deleteCurrentSongid=()=>{
        localStorage.removeItem(SONGID_KEY)
    }
    //删除列表某个歌曲
    const deletePlaylistByIndex=(index)=>{
        playlist.value.splice(index, 1);
        localStorage.setItem(PLAYLIST_KEY, JSON.stringify(playlist.value));
    }
    //获取歌单
    const getPlaylist=()=>{
        playlist.value=JSON.parse(localStorage.getItem(PLAYLIST_KEY))
    }
    
    //设置list放在localStorage
    const setPlaylist=(list)=>{
        playlist.value=list
        localStorage.setItem(PLAYLIST_KEY,JSON.stringify(list))
    }
    
    //删除list
    const deletePlaylist=()=>{
        playlist.value=[]
        localStorage.removeItem(PLAYLIST_KEY)
    }
    
    
    //获取audio
    const getAudio=(audioref)=>{
        audio.value=audioref
    }

    //加载歌曲元数据
    const LoadedMetaData=()=>{
        duration.value=audio.value.duration||0
        currenttime.value=audio.value.currentTime||0
        if (audio.value) {
        audio.value.play()
            .then(() => {
                isPlaying.value = true
            })
            .catch((error) => {
                console.log('自动播放失败:', error)
                audio.value.pause()
                isPlaying.value= false
            })
        }    
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
    //结尾下一曲
    const Endedplay = () =>{
        isPlaying.value=false
        downPlaylist()
    }
    //正常播放
    const Timeupdate = () =>{
        currenttime.value=audio.value.currentTime
        duration.value=audio.value.duration
        //找歌词对应的currentindex
        currentlyricindex.value=findExactLyricIndex(formatetime(currenttime.value*1000,1))
    }
    //计算歌词位置
    const findExactLyricIndex = (currentTime) => {
        if (!lyricstimestamp.value.length) return -1
        const tolerance = 0.5 // 0.1毫秒的容差
        for (let i = 0; i < lyricstimestamp.value.length; i++) {
            // 如果当前时间非常接近某个时间戳（在容差范围内）
            if (Math.abs(lyricstimestamp.value[i] - currentTime) < tolerance) {
                return i
            }
            // 标准逻辑：当前时间介于当前时间戳和下一个时间戳之间
            if (lyricstimestamp.value[i] <= currentTime + tolerance) {
                if (i === lyricstimestamp.value.length - 1 || lyricstimestamp.value[i + 1] > currentTime + tolerance) {
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

    //初始化防止小bug
    const init=()=>{
        isPlaying.value=false;
        Playmode.value=JSON.parse(localStorage.getItem(PLAYMODE_KEY))
    }


    
    return {
        Playmode,
        playlist,
        isPlaying,
        currenttime,
        duration,
        currentlyricindex,
        lyrics,
        lyricstimestamp,
        currentlistindex,
        init,
        LoadedMetaData,
        Toggleplay,
        Endedplay,
        Timeupdate,
        Progressclick,
        getAudio,
        setPlaylist,
        getPlaylist,
        deletePlaylist,
        setCurrentSongid,
        getCurrentSongid,
        deleteCurrentSongid,
        deletePlaylistByIndex,
        setCurrentListIndex,
        upPlaylist,
        downPlaylist,
        changePlaymode,
        addPlaylist,
    }
})