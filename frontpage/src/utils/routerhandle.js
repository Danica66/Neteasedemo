import router from '@/router'  

//跳转放歌
export const handlePlaySong=()=>{
    router.push({
        name:'player'
    })
}

//跳转歌手歌单列表
export const handleSingerPlaylist=(item,name)=>{
    router.push({
        name:'artistmusic',
        query:{
            id:item.id,
            name:name
        },
    })
}

//跳转歌单列表
export const handlePlaylist=(item)=>{
    router.push({
        name:'musiclist',
        query:{id:item.id}
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