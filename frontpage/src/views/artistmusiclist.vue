<script setup>
    import api from '../api'
    import {ref,onMounted,computed} from 'vue'
    import { useRoute } from 'vue-router' 
    import { parsesonglist } from '@/utils'
    import Songlist from '@/components/songlist.vue'

    const songlist=ref([])
    const route=useRoute()    
    const id=computed(()=>{
        return route.query.id
    })
    const artistname=computed(()=>{
        return route.query.name
    })

    //加载状态
    const loading=ref(false)
    

    //拿歌
    const fetchartistsong=async(id)=>{
        try{
            loading.value=true
            const res=await api.get('/artist/songs',{id,limit:1000})
            const playlist=res.songs||[]
            songlist.value=parsesonglist(playlist)
        }catch(err){
            console.log("获取歌手歌曲失败",err);
        }finally{
            loading.value=false
        }
        
    }

    onMounted(()=>{
        fetchartistsong(id.value)
    })

</script>
<template>
    <div class="page">
        <div class="inner">
            <Songlist :title="`${artistname}${songlist.length}首歌(最多200首)`" :songlist="songlist" :loading="loading" :isindex="true"/>
        </div>
    </div>
</template>