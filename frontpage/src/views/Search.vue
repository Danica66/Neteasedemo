<script setup>
    import { ref,onMounted,computed,watch } from 'vue'
    import { useRoute,useRouter } from 'vue-router';
    import api from '../api'
    import { formatetime,parsesonglist } from '@/utils';

    const route=useRoute()
    const router=useRouter()


    //搜歌
    const songlist=ref([])
    const loading=ref(false)
    const keyword =computed(()=>(route.query.keyword ||'').toString())
    const fetchSearchResult=async()=>{
        try {
            loading.value=true
            const keywords=keyword.value.trim()
            const res=await api.get("/search",{keywords,limit:100})
            const songs=res.result?.songs||[]
            songlist.value=parsesonglist(songs)
        } catch (error) {
            console.log("搜索失败",err);
        }finally{
            loading.value=false
        }
    }


    
    //点击放歌
    const handleplay=(id)=>{
        router.push({
            name:"player",
            query:{id}
        })
    }


    //搜索完输入框还可以搜索
    watch(
        () =>keyword.value,
        () =>{
            fetchSearchResult()
        }
    )




    onMounted(()=>{
        fetchSearchResult()
    })  
</script>


<template>
    <div class="search-page">
        <div class="inner">
            <div class="title">搜索结果(展示100条)</div>
            <p class="keyword" >关键字:{{ keyword }}</p>
            <div v-if="loading" class="tip">正在搜索中</div>
            <div v-else-if="keyword&&!songlist.length" class="tip">找不到与{{ keyword }}相关内容</div>
            <ul v-else class="song-list">
                <li @click="handleplay(song.id)" v-for="song in songlist" :key="song.id" class="song-item">
                    <div class="song-main">
                        <span class="song-name">{{ song.name }}</span>
                        <span class="song-artist">{{ song.artist }}</span>
                    </div>
                    <div class="song-extra">
                        <div class="song-album">{{ song.album }}</div>
                        <div class="song-duration">{{ formatetime(song.duration) }}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    
</template>


<style scoped>
.search-page{
    min-height: calc(100vh - 90px);
    padding: 24px 32px;
    box-sizing: border-box;
}
.title{
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
}
.tip{
    font-size: 18px;
    text-align: center;
    margin-top: 40px;
}
.keyword{
    margin-bottom: 20px;
}
.song-item{
    display: flex;
    align-items: center;
    padding: 12px 5px;
    border-bottom: 1px solid rgb(46, 7, 7);
    font-size: 14px;
}
.song-item:hover{
    background-color: rgba(77, 77, 77, 0.637);
    transition: background-color 0.3s ease;
    color: white;
}
.song-main{
    flex: 1;
    display: flex;
    flex-direction: column;
}
.song-extra{
    display: flex;
}
.song-name{
    font-size: 16px;
}
.song-album{
    margin-right: 10px;
}
</style>