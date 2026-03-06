import { ref } from "vue"
import api from "@/api"
import { parsesong,parselyric,parsetimestamp,parsesonglist,parsesingerlist,parseplaylistList } from "../utils/parse"



//拿歌信息
export const fetchSongDetail=async(ids)=>{
    const song=ref({})
    try{
        const res=await api.get('/song/detail',{ids})
        const detail=(res.songs||[])[0]
        song.value=parsesong(detail,',')
    }catch(error){
        console.error('获取歌曲详情失败',error)
    }
    return song.value
}
//拿歌词
export const fetchLyrics=async(id)=>{
    const lyrics=ref([])
    const timestamp=ref(0)
    try{
        const res=await api.get('/lyric',{id})
        const raw=res.lrc?.lyric||''
        lyrics.value=parselyric(raw)
        timestamp.value=parsetimestamp(raw)
    }catch(error){
        console.log("获取歌词失败",error)
        lyrics.value=[]
    }
    return {
        lyrics:lyrics.value,
        timestamp:timestamp.value
    }
}
//拿播放地址
export const fetchSongUrl=async(id)=>{
    const audioUrl=ref('')
    try{
        const res=await api.get("/song/url",{id})
        const item=(res.data||[])[0]
        audioUrl.value=item?.url||''
    }catch(error){
        console.log("获取歌曲播放地址失败",error);
        audioUrl.value=""
    }
    return audioUrl.value
}
//拿推荐歌单
export const fetchPlayLists = async () => {
    const playlist=ref([])
    try {
        const res=await api.get('/personalized',{limit:10})
        const playlists=res.result||[]
        playlist.value = parseplaylistList(playlists)
    } catch (error) {
        console.log("获取推荐歌单失败:",error);
        
    }
    return playlist.value
}
//拿推荐新音乐
export const fetchNewSongs = async () => {
    const newsongs=ref([])
    try {
        const res=await api.get('/personalized/newsong',{limit:10})
        const newsonglist=res.result||[]
        newsongs.value = parsesonglist(newsonglist)
    } catch (error) {
        console.log("获取推荐新音乐失败:",error);
    }
    return newsongs.value
}
//拿歌手榜单
export const fetchSingerRank = async () => {
    const singerRank=ref([])
    try {
        const res=await api.get('/top/artists',{limit:100})
        const singerlist=res.artists||[]
        singerRank.value = parsesingerlist(singerlist)
    } catch (error) {
        console.log("获取歌手榜单失败:",error);
    }
    return singerRank.value
}
//拿歌手歌单
export const fetchartistsong=async(id)=>{
    const songlist=ref([])
    try{
        const res=await api.get('/artist/songs',{id,limit:1000})
        const playlist=res.songs||[]
        songlist.value=parsesonglist(playlist)
    }catch(error){
        console.log("获取歌手歌曲失败",error);
    }
    return songlist.value
}
//拿歌单里的歌
export const fetchPlaylistDetail=async(id)=>{
    const title=ref('')
    const list=ref([])
    try {
        const res=await api.get('/playlist/detail',{id})
        title.value=res.playlist?.name||'歌单'
        const playlist=res.playlist?.tracks||[]
        list.value=parsesonglist(playlist)
            
    } catch (error) {
        console.log("获取歌单详情失败:",error);
    }
    return {
        title,
        list
    }
}
//拿用户私人歌单
export const fetchUserPlayLists=async(uid)=>{
    const playlists=ref([])
    try{
        const res=await api.get("/user/playlist",{uid})
        const playlist=res.playlist||[]
        playlists.value=parseplaylistList(playlist)
    }catch(error){
        console.log("获取歌单失败",error);
    }
    return playlists.value
}
//拿搜索结果
export const fetchSearchResult=async(keywords)=>{
    const songlist=ref([])
    try {
        keywords=keywords.value.trim()
        const res=await api.get("/search",{keywords,limit:100})
        const songs=res.result?.songs||[]
        songlist.value=parsesonglist(songs)
    } catch (error) {
        console.log("搜索失败",error);
    }
    return songlist.value
}
