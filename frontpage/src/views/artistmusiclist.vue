<script setup>
    import {ref,onMounted,computed} from 'vue'
    import { useRoute } from 'vue-router' 
    import Songlist from '@/components/songlist.vue'
    import { fetchartistsong } from '@/api/fetch'

    const songlist=ref([])
    const route=useRoute()    
    const loading=ref(false)
    const id=computed(()=>{
        return route.query.id
    })
    const artistname=computed(()=>{
        return route.query.name
    })

    //加载数据
    const loadData=async()=>{
        try{
            loading.value=true
            songlist.value=await fetchartistsong(id.value)
        }catch(err){
            console.log("加载数据失败",err);
        }finally{
            loading.value=false
        }
    }

    onMounted(()=>{
        loadData()
    })

</script>
<template>
    <div class="page">
        <div class="inner">
            <Songlist :title="`${artistname}${songlist.length}首歌(最多200首)`" :songlist="songlist" :loading="loading"/>
        </div>
    </div>
</template>