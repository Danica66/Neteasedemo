import router from '@/router'  

//跳转放歌
export const handlePlaySong=(id)=>{
    if(!id) return
    router.push({
        name:'player',
        query:{id}
    })
}

//跳转歌手歌单列表
export const handleSingerPlaylist=(id,name)=>{
    if(!id) return
    router.push({
        name:'artistmusic',
        query:{
            id:id,
            name:name
        },
    })
}

//跳转歌单列表
export const handlePlaylist=(id)=>{
    if(!id) return
    router.push({
        name:'musiclist',
        query:{id}
    })
}

//跳转登录
export const handleLogin=()=>{
    router.push("/login")
}

//点击空白返回主页
export const handleBack=(event)=>{
    if(event.target===event.currentTarget){
        router.push("/")
    }
}