<script setup>
    import { ref,onMounted,computed,watch } from 'vue'
    import { useRoute,useRouter } from 'vue-router';
    import api from '../api'
    import { parsesonglist } from '@/utils';
    import Songlist from '@/components/songlist.vue';
    const route=useRoute()

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
            console.log("搜索失败",error);
        }finally{
            loading.value=false
        }
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
    <div class="page">
        <div class="inner">
            <Songlist :songlist="songlist" :title="'搜索结果(展示100条)'" :tip="`找不到与“${keyword}”相关内容`" :loading="loading">
                <template #l-title>
                    <p class="keyword" >关键字:{{ keyword }}</p>
                </template>
            </Songlist>
        </div>
    </div>
</template>