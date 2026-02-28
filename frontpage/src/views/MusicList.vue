<script setup>
    import {useRoute, useRouter} from 'vue-router'
    import { ref,computed, onMounted } from 'vue'
    import { parsesonglist  } from '@/utils'
    import api from '../api'
    import Songlist from '@/components/songlist.vue'
    
    const route=useRoute()

    //加载状态
    const loading=ref(false)
    
        
    // 歌单详情数据
    const playlistName=ref('')
    const songlist=ref([])
    const playlistId=computed(()=>{
        return route.query.id
    })
    const fetchPlaylistDetail=async(id)=>{
        try {
            // 开始加载
            loading.value=true
            // 获取歌单详情
            const res=await api.get('/playlist/detail',{id})
            // console.log(res);
            playlistName.value=res.playlist?.name||'歌单'
            const playlist=res.playlist?.tracks||[]
            // console.log(songlist.value);
            
            songlist.value=parsesonglist(playlist)
        } catch (error) {
            console.log("获取歌单详情失败:",error);
        }finally{
            // 无论成功失败都结束加载状态
            loading.value=false
        }
    }

    onMounted(()=>{
        fetchPlaylistDetail(playlistId.value)
    })
</script>
        
<template>
    <div class="page">
        <div class="inner">
            <Songlist :title="`${playlistName}`" :songlist="songlist" :loading="loading" :isindex="true"/>
        </div>
    </div>
</template>