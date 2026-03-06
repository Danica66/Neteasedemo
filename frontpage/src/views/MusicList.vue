<script setup>
    import {useRoute} from 'vue-router'
    import { ref,computed, onMounted } from 'vue'
    import Songlist from '@/components/songlist.vue'
    import { fetchPlaylistDetail } from '@/api/fetch'
    
    const route=useRoute()
    const loading=ref(false)    
    const playlistName=ref('')
    const songlist=ref([])
    const playlistId=computed(()=>{
        return route.query.id
    })

    //加载数据
    const loadData=async()=>{
        try {
            loading.value=true
            const data=await fetchPlaylistDetail(playlistId.value)
            playlistName.value=data.title.value
            songlist.value=data.list.value
        } catch (error) {
            console.log("加载状态失败",error);
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
            <Songlist :title="`${playlistName}`" :songlist="songlist" :loading="loading" />
        </div>
    </div>
</template>